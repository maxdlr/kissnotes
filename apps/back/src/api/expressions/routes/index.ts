import { Router } from "express";
import addExpression from "../controllers/addExpression";
import browseExpressions from "../controllers/browseExpressions";
import readExpression from "../controllers/readExpression";

const router = Router();

router.get("/browse", [browseExpressions]);
router.get("/read", [readExpression]);
router.post("/add", [addExpression]);

export default router;
