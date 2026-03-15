import { Router } from "express";
import expressionRoutes from "./api/expressions/routes/index";
import nativeExpressionRoutes from "./api/native-expressions/routes/index";
import userRoutes from "./api/users/routes/index";
import getMe from "./api/auth/controllers/getMe";
import logIn from "./api/auth/controllers/logIn";
import authenticate from "./middlewares/authenticate";
import getRefreshToken from "./api/auth/controllers/getRefreshToken";
import logOut from "./api/auth/controllers/logOut";

const router = Router();

router.post("/login", logIn);
router.post("/logout", logOut);
router.post("/refresh", getRefreshToken);

router.get("/me", authenticate, getMe);

router.use("/expressions", expressionRoutes);
router.use("/native-expressions", nativeExpressionRoutes);
router.use("/users", userRoutes);

export default router;
