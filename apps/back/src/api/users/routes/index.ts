import { Router } from "express";
import addUser from "../controllers/addUser";

const router = Router();

router.post("/add", [addUser]);

export default router;
