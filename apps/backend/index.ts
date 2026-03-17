import express from "express";
import cors from "cors";
import "dotenv/config";
import userRouter from "./routes/user/user.route";
import adminRouter from "./routes/admin/admin.route";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/user", userRouter);
app.use("/admin", adminRouter);

app.listen(process.env.PORT || 8080, () => {
  console.log(`PRIMARY SERVER STARTED ON PORT: ${process.env.PORT}`);
});
