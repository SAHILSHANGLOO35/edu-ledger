import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { prisma } from "db/client";
import { authMiddleware } from "./middlewares/auth.middleware";
import { SigninSchema } from "common/inputs";

const app = express();
app.use(cors());
app.use(express.json());

console.log("DB URL:", process.env.DATABASE_URL);

app.post("/signin", async (req, res) => {
  try {
    const { success, data } = SigninSchema.safeParse(req.body);
    if (!success) {
      res.status(403).json({
        message: "Incorrect credentials",
      });
      return;
    }

    const { email, password } = data;

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    if (user.password != password) {
      res.status(401).json({
        message: "Incorrect Password",
      });
      return;
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET!,
    );

    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);

    res.status(401).json({
      message: "Error Signing In",
    });
    return;
  }
});

app.get("/calendar/:courseId", authMiddleware, async (req, res) => {
  const courseId = req.params.courseId;
  const course = await prisma.course.findFirst({
    where: {
      id: courseId as string,
    },
  });

  if (!course) {
    res.status(404).json({
      message: `Course with this ID: ${courseId} not found`,
    });
    return;
  }

  const purchase = await prisma.purchases.findFirst({
    where: {
      userId: req.userId,
      courseId: courseId as string,
    },
  });

  if (!purchase) {
    res.status(403).json({
      message: "Course not purchased. You don't have access to this course",
    });
    return;
  }

  return res.status(200).json({
    id: course.id,
    calendarNotionId: course.calendarNotionId,
  });
});

app.get("/courses", authMiddleware, async (req, res) => {
  const courses = await prisma.course.findMany({
    where: {
      purchases: {
        some: {
          userId: req.userId,
        },
      },
    },
  });

  return res.status(200).json({
    courses: courses.map((c) => ({
      id: c.id,
      title: c.title,
      slugf: c.slug,
      calendarNotionId: c.calendarNotionId,
    })),
  });
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`SERVER STARTED ON PORT: ${process.env.PORT}`);
});
