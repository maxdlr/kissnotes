import { Test } from "@kissnotes/types";
import { Request, Response, Router } from "express";

const router = Router();

router.use("/test", async (_req: Request, res: Response) => {
  const hello: Test = { message: "Hello World" };
  return res.send(hello);
});

export default router;
