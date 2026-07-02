import { Router } from "express";
import {
  createBrand,
  getBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
} from "../controllers/brandController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { adminMiddleware } from "../middlewares/adminMiddleware";

const router = Router();

// Public routes
router.get("/", getBrands);
router.get("/:id", getBrandById);

// Protected routes (Admin level typically, but applying normal authentication first)
router.post("/", authMiddleware, adminMiddleware, createBrand);
router.put("/:id", authMiddleware, adminMiddleware, updateBrand);
router.delete("/:id", authMiddleware, adminMiddleware, deleteBrand);

export default router;
