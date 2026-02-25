import { Request, Response, Router } from "express";

const router = Router();

router.use("/test", async (_req: Request, res: Response) => {
  return res.send("hello world");
});

export default router;
