import { Router } from "express";
import getAllExpressions from "../controllers/getAllExpressions";

const router = Router();

router.get("/", [getAllExpressions]);

export default router;
