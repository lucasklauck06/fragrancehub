import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboardController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/stats", authMiddleware, getDashboardStats);

export default router;
