import { Router } from "express";
import { TSSCli } from "solana-mpc-tss-lib";
import jwt from "jsonwebtoken";
import { prisma } from "db/client";
import { authMiddleware } from "../../middlewares/user/user.middleware";
import { SendSchema, SigninSchema } from "common/inputs";
import { NETWORK } from "common/solana";
import axios from "axios";

const cli = new TSSCli(NETWORK);

const MPC_SERVERS = [
  "http://localhost:8001",
  // "http://localhost:8002",
  // "http://localhost:8003",
];

const MPC_THRESHOLD = Math.max(1, MPC_SERVERS.length - 1);

const router = Router();

router.post("/signin", async (req, res) => {
  try {
    const { success, data } = SigninSchema.safeParse(req.body);
    if (!success) {
      return res.status(403).json({
        message: "Incorrect credentials",
      });
    }

    const { email, password } = data;

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.password != password) {
      return res.status(401).json({
        message: "Incorrect Password",
      });
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
    return res.status(500).json({
      message: "Error Signing In",
    });
  }
});

router.get("/calendar/:courseId", authMiddleware, async (req, res) => {
  try {
    const courseId = req.params.courseId;

    const course = await prisma.course.findFirst({
      where: {
        id: courseId as string,
      },
    });

    if (!course) {
      return res.status(404).json({
        message: `Course with this ID: ${courseId} not found`,
      });
    }

    const purchase = await prisma.purchases.findFirst({
      where: {
        userId: req.userId,
        courseId: courseId as string,
      },
    });

    if (!purchase) {
      return res.status(403).json({
        message: "Course not purchased. You don't have access to this course",
      });
    }

    return res.status(200).json({
      id: course.id,
      calendarNotionId: course.calendarNotionId,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error fetching calendar",
    });
  }
});

router.get("/courses", authMiddleware, async (req, res) => {
  try {
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
        slug: c.slug,
        calendarNotionId: c.calendarNotionId,
      })),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error fetching courses",
    });
  }
});

router.post("/send", authMiddleware, async (req, res) => {
  try {
    const { success, data } = SendSchema.safeParse(req.body);

    if (!success) {
      return res.status(403).json({
        message: "Incorrect credentials",
      });
    }

    const blockhash = await cli.recentBlockHash();

    const user = await prisma.user.findFirst({
      where: {
        id: req.userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const step1Responses = await Promise.all(
      MPC_SERVERS.map(async (server) => {
        const response = await axios.post(`${server}/send/step-1`, {
          to: data.to,
          amount: data.amount,
          userId: user.id,
          recentBlockhash: blockhash,
        });
        return response.data;
      }),
    );

    const step2Responses = await Promise.all(
      MPC_SERVERS.map(async (server, index) => {
        const response = await axios.post(`${server}/send/step-2`, {
          to: data.to,
          amount: data.amount,
          userId: user.id,
          recentBlockhash: blockhash,
          step1Responses: step1Responses[index],
          allPublicNonces: step1Responses.map((r) => r.response.publicNonce),
        });
        return response.data;
      }),
    );

    const partialSignatures = step2Responses.map((r) => r.response);

    const transactionDetails = {
      amount: data.amount,
      to: data.to,
      from: user.publicKey,
      network: NETWORK,
      memo: undefined,
      recentBlockhash: blockhash,
    };

    const signature = await cli.aggregateSignaturesAndBroadcast(
      JSON.stringify(partialSignatures),
      JSON.stringify(transactionDetails),
      JSON.stringify({
        aggregatedPublicKey: user.publicKey,
        participantKeys: step2Responses.map((r) => r.publicKey),
        threshold: MPC_THRESHOLD,
      }),
    );

    return res.status(200).json({
      signature,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error processing transaction",
    });
  }
});

export default router;
