import { Router } from "express";
import { getUsers, updateUserRole } from "../controllers/userController";

const router = Router();

router.get("/", getUsers);
router.patch("/:id/role", updateUserRole);

export default router;
