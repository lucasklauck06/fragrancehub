import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { date: "desc" },
      include: {
        user: { select: { name: true } },
        perfume: { select: { name: true, brand: true } }
      }
    });
    
    const formattedReviews = reviews.map(r => ({
      id: r.id,
      userName: r.user.name,
      perfumeName: r.perfume.name,
      rating: r.rating,
      comment: r.comment,
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
        perfume: { select: { name: true } }
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
      rating: review.rating,
      comment: review.comment,
      date: review.date,
      perfumeId: review.perfumeId,
      userId: review.userId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching review" });
  }
};

export const createReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const review = await prisma.review.create({
      data: req.body,
    });
    res.status(201).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating review" });
  }
};

export const updateReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const review = await prisma.review.update({
      where: { id: id as string },
      data: req.body,
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
    await prisma.review.delete({
      where: { id: id as string },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting review" });
  }
};
