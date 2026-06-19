import { Router } from "express";
import { getPerfumes, getPerfumeById, deletePerfume, createPerfume, updatePerfume } from "../controllers/perfumeController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", getPerfumes);
router.get("/:id", getPerfumeById);
router.post("/", authMiddleware, createPerfume);
router.put("/:id", authMiddleware, updatePerfume);
router.delete("/:id", authMiddleware, deletePerfume);

export default router;
