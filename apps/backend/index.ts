import express from "express";
import cors from "cors";
import { prisma } from "db/client";
import { authMiddleware } from "./middlewares/auth.middleware";

const app = express();
app.use(cors());

app.post("/signin", async (req, res) => {});

app.post("/calendar", authMiddleware, async (req, res) => {});

app.listen(process.env.PORT || 8080);
