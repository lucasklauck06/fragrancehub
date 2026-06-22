import { Router } from "express";
import { getPerfumes, getPerfumeById, deletePerfume, createPerfume, updatePerfume } from "../controllers/perfumeController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { adminMiddleware } from "../middlewares/adminMiddleware";

const router = Router();

router.get("/", getPerfumes);
router.get("/:id", getPerfumeById);
router.post("/", authMiddleware, adminMiddleware, createPerfume);
router.put("/:id", authMiddleware, adminMiddleware, updatePerfume);
router.delete("/:id", authMiddleware, adminMiddleware, deletePerfume);

export default router;
