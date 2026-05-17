import authenticate from "@/middlewares/authenticate";
import { Router } from "express";
import editSocials from "../controllers/editSocials";

const router = Router();

router.put("/edit", authenticate, [editSocials]);

export default router;
