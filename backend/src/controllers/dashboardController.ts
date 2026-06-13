import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const [perfumesCount, brandsCount, perfumistsCount, usersCount, reviewsCount] = await Promise.all([
      prisma.perfume.count(),
      prisma.brand.count(),
      prisma.perfumist.count(),
      prisma.user.count(),
      prisma.review.count(),
    ]);

    const recentReviews = await prisma.review.findMany({
      take: 5,
      orderBy: { date: 'desc' },
      include: {
        user: { select: { name: true } },
        perfume: { select: { name: true } }
      }
    });
    
    const formattedReviews = recentReviews.map(r => ({
      id: r.id,
      userName: r.user.name,
      perfumeName: r.perfume.name,
      rating: r.rating,
      comment: r.comment,
      date: r.date
    }));

    res.json({
      stats: {
        perfumes: perfumesCount,
        brands: brandsCount,
        perfumists: perfumistsCount,
        users: usersCount,
        reviews: reviewsCount
      },
      recentReviews: formattedReviews
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching dashboard stats" });
  }
};
