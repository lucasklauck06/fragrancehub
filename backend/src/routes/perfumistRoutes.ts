import { Router } from "express";
import { getPerfumists, getPerfumistById, createPerfumist, updatePerfumist, deletePerfumist } from "../controllers/perfumistController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { adminMiddleware } from "../middlewares/adminMiddleware";

const router = Router();

router.get("/", getPerfumists);
router.get("/:id", getPerfumistById);
router.post("/", authMiddleware, adminMiddleware, createPerfumist);
router.put("/:id", authMiddleware, adminMiddleware, updatePerfumist);
router.delete("/:id", authMiddleware, adminMiddleware, deletePerfumist);

export default router;
