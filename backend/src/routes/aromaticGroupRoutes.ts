import { Router } from "express";
import { getAromaticGroups, getAromaticGroupById, createAromaticGroup, updateAromaticGroup, deleteAromaticGroup } from "../controllers/aromaticGroupController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { adminMiddleware } from "../middlewares/adminMiddleware";

const router = Router();

router.get("/", getAromaticGroups);
router.get("/:id", getAromaticGroupById);
router.post("/", authMiddleware, adminMiddleware, createAromaticGroup);
router.put("/:id", authMiddleware, adminMiddleware, updateAromaticGroup);
router.delete("/:id", authMiddleware, adminMiddleware, deleteAromaticGroup);

export default router;
