import { Router } from "express";
import browseLayers from "../controllers/browseLayers";

const router = Router();

router.get("/browse", [browseLayers]);

export default router;
