import { Router } from "express";
import { getNews, getNewsById, createNews, updateNews, deleteNews } from "../controllers/newsController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { adminMiddleware } from "../middlewares/adminMiddleware";

const router = Router();

router.get("/", getNews);
router.get("/:id", getNewsById);
router.post("/", authMiddleware, adminMiddleware, createNews);
router.put("/:id", authMiddleware, adminMiddleware, updateNews);
router.delete("/:id", authMiddleware, adminMiddleware, deleteNews);

export default router;
