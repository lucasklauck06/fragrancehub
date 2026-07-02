import { Router } from "express";
import { getNoteImage } from "../controllers/noteImageController";

const router = Router();

router.get("/", getNoteImage);

export default router;
