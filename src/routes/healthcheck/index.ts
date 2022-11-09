import express, { Request, Response } from "express";

const router = express.Router();

router.get("/", async function (req: Request, res: Response) {
  const healthcheck = {
    uptime: process.uptime(),
    message: "OK",
    timestamp: Date.now(),
  };
  try {
    res.send(healthcheck);
  } catch (error) {
    process.exit(1);
    res.status(503).send();
  }
});

export { router as healthcheckRouter };
