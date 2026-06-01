import { Router } from "express";
import {
  createBrand,
  getBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
} from "../controllers/brandController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// Public routes
router.get("/", getBrands);
router.get("/:id", getBrandById);

// Protected routes (Admin level typically, but applying normal authentication first)
router.post("/", authMiddleware, createBrand);
router.put("/:id", authMiddleware, updateBrand);
router.delete("/:id", authMiddleware, deleteBrand);

export default router;
