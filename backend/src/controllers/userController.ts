import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ─── Admin: lista todos os usuários ─────────────────────────────────────────
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// ─── Admin: altera role de um usuário ────────────────────────────────────────
export const updateUserRole = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { role } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ error: "Failed to update user role" });
  }
};

// ─── RF05: Retorna dados do próprio usuário autenticado ───────────────────────
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      res.status(401).json({ error: "Não autorizado" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        reviews: {
          orderBy: { date: "desc" },
          take: 5,
          select: {
            id: true,
            rating: true,
            comment: true,
            longevidade: true,
            rastro: true,
            date: true,
            perfume: { select: { id: true, name: true, image: true } },
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({ error: "Usuário não encontrado" });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Erro ao buscar perfil" });
  }
};

// ─── RF05: Atualiza dados cadastrais do próprio usuário ───────────────────────
export const updateMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      res.status(401).json({ error: "Não autorizado" });
      return;
    }

    const { name, email, password, currentPassword } = req.body;

    // Se quiser trocar senha, exige a senha atual
    if (password) {
      if (!currentPassword) {
        res.status(400).json({ error: "Informe a senha atual para alterá-la." });
        return;
      }
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        res.status(404).json({ error: "Usuário não encontrado" });
        return;
      }
      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!passwordMatch) {
        res.status(400).json({ error: "Senha atual incorreta." });
        return;
      }
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    res.json(updatedUser);
  } catch (error: any) {
    console.error("Error updating profile:", error);
    if (error.code === "P2002") {
      res.status(400).json({ error: "Este e-mail já está em uso." });
      return;
    }
    res.status(500).json({ error: "Erro ao atualizar perfil" });
  }
};
