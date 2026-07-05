import { Router } from "express";
import getDashboard from "../controllers/getDashboard";

const router = Router();

router.get("/browse", [getDashboard]);

export default router;
