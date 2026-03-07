import { Router } from "express";
import expressionRoutes from "./api/expressions/routes/index";
import nativeExpressionRoutes from "./api/native-expressions/routes/index";
import userRoutes from "./api/users/routes/index";
import getMe from "./api/auth/controllers/getMe";
import logIn from "./api/auth/controllers/logIn";
import authenticate from "./middlewares/authenticate";

const router = Router();

router.post("/login", logIn);
router.get("/me", authenticate, getMe);

router.use("/expressions", expressionRoutes);
router.use("/native-expressions", nativeExpressionRoutes);
router.use("/users", userRoutes);

export default router;
