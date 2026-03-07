import { Router } from "express";
import addNativeExpression from "../controllers/addNativeExpression";
import browseNativeExpressions from "../controllers/browseNativeExpressions";
import deleteNativeExpression from "../controllers/deleteNativeExpression";
import editNativeExpression from "../controllers/editNativeExpression";
import readNativeExpression from "../controllers/readNativeExpression";

const router = Router();

router.get("/browse", [browseNativeExpressions]);
router.get("/read", [readNativeExpression]);
router.post("/add", [addNativeExpression]);
router.put("/edit", [editNativeExpression]);
router.delete("/delete", [deleteNativeExpression]);

export default router;
