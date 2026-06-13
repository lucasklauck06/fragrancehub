import { Router } from "express";
import { getPerfumes, getPerfumeById, deletePerfume } from "../controllers/perfumeController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", getPerfumes);
router.get("/:id", getPerfumeById);
router.delete("/:id", authMiddleware, deletePerfume);

export default router;
