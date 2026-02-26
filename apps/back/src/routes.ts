import { Router } from "express";
import expressionRoutes from "./api/expressions/routes/index";

const router = Router();

router.use("/expressions", expressionRoutes);

export default router;
