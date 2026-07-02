import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const globalSearch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== "string") {
      res.json({ perfumes: [], brands: [], reviews: [] });
      return;
    }

    const perfumes = await prisma.perfume.findMany({
      where: { name: { contains: q, mode: "insensitive" } },
      select: { id: true, name: true, image: true, brand: { select: { name: true } } },
      take: 8
    });

    const brands = await prisma.brand.findMany({
      where: { name: { contains: q, mode: "insensitive" } },
      select: { id: true, name: true, image: true },
      take: 8
    });

    const reviews = await prisma.review.findMany({
      where: { perfume: { name: { contains: q, mode: "insensitive" } } },
      select: { id: true, rating: true, comment: true, perfumeId: true, perfume: { select: { name: true, image: true } }, user: { select: { name: true } } },
      take: 8
    });

    res.json({ perfumes, brands, reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Search failed" });
  }
};
