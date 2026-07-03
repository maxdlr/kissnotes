import { Router } from "express";
import search from "../controllers/search";

const router = Router();

router.get("/browse", [search]);

export default router;
