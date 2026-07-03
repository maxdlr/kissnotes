import { Router } from "express";
import expressionRoutes from "./api/expressions/routes/index";
import nativeExpressionRoutes from "./api/native-expressions/routes/index";
import searchRoutes from "./api/search/routes/index";
import userRoutes from "./api/users/routes/index";
import socialLinkRoutes from "./api/socials/routes/index";
import getMe from "./api/auth/controllers/getMe";
import logIn from "./api/auth/controllers/logIn";
import authenticate from "./middlewares/authenticate";
import getRefreshToken from "./api/auth/controllers/getRefreshToken";
import logOut from "./api/auth/controllers/logOut";
import signUp from "./api/auth/controllers/signup";

const router = Router();

router.post("/login", logIn);
router.post("/signup", signUp);
router.post("/logout", authenticate, logOut);
router.post("/refresh", getRefreshToken);

router.get("/me", authenticate, getMe);

router.use("/expressions", expressionRoutes);
router.use("/native-expressions", nativeExpressionRoutes);
router.use("/search", searchRoutes);
router.use("/users", userRoutes);
router.use("/social-links", socialLinkRoutes);

export default router;
