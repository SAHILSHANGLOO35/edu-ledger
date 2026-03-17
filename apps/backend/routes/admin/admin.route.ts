import { Router } from "express";
import jwt from "jsonwebtoken";
import { CreateUserSchema, SigninSchema } from "common/inputs";
import { NETWORK } from "common/solana";
import { prisma } from "db/client";
import { adminAuthuthMiddleware } from "../../middlewares/admin/admin.middleware";
import axios from "axios";
import { TSSCli } from "solana-mpc-tss-lib";

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
      process.env.ADMIN_JWT_SECRET!,
    );

    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error Signing In",
    });
  }
});

router.post("/create-user", adminAuthuthMiddleware, async (req, res) => {
  try {
    const { success, data } = CreateUserSchema.safeParse(req.body);
    if (!success) {
      return res.status(403).json({
        message: "Incorrect credentials",
      });
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        phone: data.phone,
        role: "USER",
      },
    });

    // Send request to MPC Servers for creating public and secret key for this user
    const responses = await Promise.all(
      MPC_SERVERS.map(async (server) => {
        const response = await axios.post(`${server}/create-user`, {
          userId: user.id,
        });
        return response.data;
      }),
    );

    // Combine the public keys -> Actual solana wallet address
    const aggregatedPublicKeys = cli.aggregateKeys(
      responses.map((r) => r.publicKey),
      MPC_THRESHOLD,
    );

    // Updating user table with aggregated public key
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        publicKey: aggregatedPublicKeys.aggregatedPublicKey,
      },
    });

    // Airdropping SOL to this created user
    await cli.airdrop(aggregatedPublicKeys.aggregatedPublicKey, 0.1);

    return res.json({
      message: "User created",
      user: {
        ...user,
        publicKey: aggregatedPublicKeys.aggregatedPublicKey,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error creating user",
    });
  }
});

export default router;
