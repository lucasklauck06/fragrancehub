import { Router } from "express";
import { getAromaticGroups, getAromaticGroupById, createAromaticGroup, updateAromaticGroup, deleteAromaticGroup } from "../controllers/aromaticGroupController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", getAromaticGroups);
router.get("/:id", getAromaticGroupById);
router.post("/", authMiddleware, createAromaticGroup);
router.put("/:id", authMiddleware, updateAromaticGroup);
router.delete("/:id", authMiddleware, deleteAromaticGroup);

export default router;
