import { Router } from "express";
import { getUsers, updateUserRole, getMe, updateMe } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { adminMiddleware } from "../middlewares/adminMiddleware";

const router = Router();

// ─── RF05: Rotas do próprio usuário (qualquer user autenticado) ───────────────
router.get("/me", authMiddleware, getMe);
router.put("/me", authMiddleware, updateMe);

// ─── Admin: gerenciamento de usuários ────────────────────────────────────────
router.get("/", authMiddleware, adminMiddleware, getUsers);
router.patch("/:id/role", authMiddleware, adminMiddleware, updateUserRole);

export default router;
