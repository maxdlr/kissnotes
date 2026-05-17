import { Router } from "express";
import addNativeExpression from "../controllers/addNativeExpression";
import browseNativeExpressions from "../controllers/browseNativeExpressions";
import deleteNativeExpression from "../controllers/deleteNativeExpression";
import editNativeExpression from "../controllers/editNativeExpression";
import readNativeExpression from "../controllers/readNativeExpression";
import authenticate from "@/middlewares/authenticate";

const router = Router();

router.get("/browse", [browseNativeExpressions]);
router.get("/read", [readNativeExpression]);
router.post("/add", [addNativeExpression]);
router.put("/edit", authenticate, [editNativeExpression]);
router.delete("/delete", authenticate, [deleteNativeExpression]);

export default router;
