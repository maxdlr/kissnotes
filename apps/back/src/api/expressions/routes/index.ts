import authenticate from "@/middlewares/authenticate";
import { Router } from "express";
import addExpression from "../controllers/addExpression";
import browseExpressions from "../controllers/browseExpressions";
import deleteExpression from "../controllers/deleteExpression";
import editExpression from "../controllers/editExpression";
import generateExpressionSymbols from "../controllers/generateExpressionSymbols";
import readExpression from "../controllers/readExpression";

const router = Router();

router.get("/browse", [browseExpressions]);
router.get("/read", [readExpression]);
router.post("/add", authenticate, addExpression);
router.put("/edit", [editExpression]);
router.delete("/delete", [deleteExpression]);

router.post("/cmd/generate-symbols", authenticate, [generateExpressionSymbols]);

export default router;
