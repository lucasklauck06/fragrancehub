import { Router } from "express";
import { getPerfumists, getPerfumistById, createPerfumist, updatePerfumist, deletePerfumist } from "../controllers/perfumistController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", getPerfumists);
router.get("/:id", getPerfumistById);
router.post("/", authMiddleware, createPerfumist);
router.put("/:id", authMiddleware, updatePerfumist);
router.delete("/:id", authMiddleware, deletePerfumist);

export default router;
