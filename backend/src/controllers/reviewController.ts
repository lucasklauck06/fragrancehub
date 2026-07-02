import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { date: "desc" },
      include: {
        user: { select: { name: true } },
        perfume: { select: { name: true, brand: true, image: true, gender: true, price: true } }
      }
    });
    
    const formattedReviews = reviews.map((r: any) => ({
      id: r.id,
      userName: r.user.name,
      perfumeName: r.perfume.name,
      perfumeBrand: r.perfume.brand?.name || r.perfume.brand,
      perfumeImage: r.perfume.image,
      perfumeGender: r.perfume.gender,
      perfumePrice: r.perfume.price,
      rating: r.rating,
      comment: r.comment,
      longevidade: r.longevidade,
      rastro: r.rastro,
      quandoUsar: r.quandoUsar,
      date: r.date,
      perfumeId: r.perfumeId,
      userId: r.userId
    }));

    res.json(formattedReviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching reviews" });
  }
};

export const getReviewById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const review = await prisma.review.findUnique({
      where: { id: id as string },
      include: {
        user: { select: { name: true } },
        perfume: { select: { name: true, brand: true, image: true, gender: true, price: true } }
      }
    });

    if (!review) {
      res.status(404).json({ error: "Review not found" });
      return;
    }
    
    res.json({
      id: review.id,
      userName: review.user.name,
      perfumeName: review.perfume.name,
      perfumeBrand: review.perfume.brand?.name,
      perfumeImage: review.perfume.image,
      perfumeGender: review.perfume.gender,
      perfumePrice: review.perfume.price,
      rating: review.rating,
      comment: review.comment,
      longevidade: review.longevidade,
      rastro: review.rastro,
      quandoUsar: review.quandoUsar,
      date: review.date,
      perfumeId: review.perfumeId,
      userId: review.userId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching review" });
  }
};

// ─── RF06: Criar resenha técnica — userId extraído do token (seguro) ──────────
export const createReview = async (req: Request, res: Response): Promise<void> => {
  try {
    // Segurança: userId sempre vem do token JWT, nunca do body
    const userId = (req as any).user?.userId;
    if (!userId) {
      res.status(401).json({ error: "Não autorizado" });
      return;
    }

    const { perfumeId, rating, comment, longevidade, rastro, quandoUsar } = req.body;

    if (!perfumeId || !comment) {
      res.status(400).json({ error: "perfumeId e comment são obrigatórios." });
      return;
    }

    const review = await prisma.review.create({
      data: {
        perfumeId,
        userId,
        rating: rating ?? 5,
        comment,
        longevidade: longevidade ?? null,
        rastro: rastro ?? null,
        quandoUsar: quandoUsar ?? null,
      },
      include: {
        user: { select: { name: true } },
      }
    });

    res.status(201).json({
      id: review.id,
      userName: review.user.name,
      rating: review.rating,
      comment: review.comment,
      longevidade: review.longevidade,
      rastro: review.rastro,
      quandoUsar: review.quandoUsar,
      date: review.date,
      perfumeId: review.perfumeId,
      userId: review.userId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating review" });
  }
};

export const updateReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;

    // Garante que o usuário só edita sua própria resenha
    const existing = await prisma.review.findUnique({ where: { id: id as string } });
    if (!existing) {
      res.status(404).json({ error: "Review not found" });
      return;
    }
    if (existing.userId !== userId) {
      res.status(403).json({ error: "Você não tem permissão para editar esta resenha." });
      return;
    }

    const { rating, comment, longevidade, rastro, quandoUsar } = req.body;
    const review = await prisma.review.update({
      where: { id: id as string },
      data: { rating, comment, longevidade, rastro, quandoUsar },
    });
    res.json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating review" });
  }
};

export const deleteReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
  const userId = (req as any).user?.userId;
    const userRole = (req as any).user?.role;

    const existing = await prisma.review.findUnique({ where: { id: id as string } });
    if (!existing) {
      res.status(404).json({ error: "Review not found" });
      return;
    }
    // Permite deleção pelo dono da resenha ou por admin
    if (existing.userId !== userId && userRole !== "ADMIN") {
      res.status(403).json({ error: "Você não tem permissão para deletar esta resenha." });
      return;
    }

    await prisma.review.delete({ where: { id: id as string } });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting review" });
  }
};
