import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getPerfumes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { brandId } = req.query;
    
    let whereClause = {};
    if (brandId) {
      whereClause = { brandId: brandId as string };
    }
    
    const perfumes = await prisma.perfume.findMany({
      where: whereClause,
      include: {
        brand: true,
        perfumist: true,
      },
      orderBy: { name: "asc" },
    });
    
    const formattedPerfumes = perfumes.map(p => ({
      ...p,
      brand: p.brand ? p.brand.name : "",
      perfumist: p.perfumist ? p.perfumist.name : ""
    }));
    
    res.json(formattedPerfumes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching perfumes" });
  }
};

export const getPerfumeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const perfume = await prisma.perfume.findUnique({
      where: { id: id as string },
      include: {
        brand: true,
        perfumist: true,
      }
    });

    if (!perfume) {
      res.status(404).json({ error: "Perfume not found" });
      return;
    }
    
    res.json({
      ...perfume,
      brand: perfume.brand ? perfume.brand.name : "",
      perfumist: perfume.perfumist ? perfume.perfumist.name : ""
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching perfume" });
  }
};

export const deletePerfume = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    await prisma.perfume.delete({
      where: { id: id as string },
    });
    
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting perfume" });
  }
};

export const createPerfume = async (req: Request, res: Response): Promise<void> => {
  try {
    const perfume = await prisma.perfume.create({
      data: req.body,
    });
    res.status(201).json(perfume);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating perfume" });
  }
};

export const updatePerfume = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const perfume = await prisma.perfume.update({
      where: { id: id as string },
      data: req.body,
    });
    res.json(perfume);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating perfume" });
  }
};
