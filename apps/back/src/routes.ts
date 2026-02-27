import { Router } from "express";
import expressionRoutes from "./api/expressions/routes/index";
import userRoutes from "./api/users/routes/index";

const router = Router();

router.use("/expressions", expressionRoutes);
router.use("/users", userRoutes);

export default router;
