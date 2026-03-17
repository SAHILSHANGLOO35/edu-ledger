import express from "express";
import { TSSCli } from "solana-mpc-tss-lib";
import { prisma } from "mpc-db/client";
import { NETWORK } from "common/solana";

const cli = new TSSCli(NETWORK);

const app = express();
app.use(express.json());

app.post("/create-user", async (req, res) => {
  try {
    const { userId } = req.body;

    const participant = await cli.generate();

    await prisma.keyShare.create({
      data: {
        userId,
        publicKey: participant.publicKey,
        secretKey: participant.secretKey,
      },
    });

    return res.status(200).json({
      publicKeys: participant.publicKey,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error creating MPC user",
    });
  }
});

app.post("/send/step-1", async (req, res) => {
  try {
    const { to, amount, userId, recentBlockhash } = req.body;

    const user = await prisma.keyShare.findFirst({
      where: { userId },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const response = await cli.aggregateSignStepOne(
      user.secretKey,
      to,
      amount,
      undefined,
      recentBlockhash,
    );

    return res.status(200).json({ response });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error in step-1 signing",
    });
  }
});

app.post("/send/step-2", async (req, res) => {
  try {
    const {
      to,
      amount,
      userId,
      recentBlockhash,
      step1Responses,
      allPublicNonces,
    } = req.body;

    const user = await prisma.keyShare.findFirst({
      where: { userId },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const response = await cli.aggregateSignStepTwo(
      JSON.stringify(step1Responses),
      user.secretKey,
      to,
      amount,
      allPublicNonces,
      undefined,
      recentBlockhash,
    );

    return res.status(200).json({ response, publicKey: user.publicKey });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error in step-2 signing",
    });
  }
});

app.listen(`${process.env.PORT}`, () => {
  console.log(`MPC SERVER STARTED ON PORT ${process.env.PORT}`);
});
