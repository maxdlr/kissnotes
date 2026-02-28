import { Router } from "express";
import addExpression from "../controllers/addExpression";
import editExpression from "../controllers/editExpression";
import deleteExpression from "../controllers/deleteExpression";
import browseExpressions from "../controllers/browseExpressions";
import readExpression from "../controllers/readExpression";

const router = Router();

router.get("/browse", [browseExpressions]);
router.get("/read", [readExpression]);
router.post("/add", [addExpression]);
router.put("/edit", [editExpression]);
router.delete("/delete", [deleteExpression]);

export default router;
