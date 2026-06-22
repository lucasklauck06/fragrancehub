import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getPerfumes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { brandId, perfumistId, collection, gender, maxPrice, q } = req.query;
    
    let whereClause: any = {};
    if (brandId) {
      whereClause.brandId = brandId as string;
    }
    if (perfumistId) {
      whereClause.perfumistId = perfumistId as string;
    }
    if (collection) {
      whereClause.collection = collection as string;
    }
    if (gender) {
      whereClause.gender = gender as string;
    }
    if (maxPrice) {
      whereClause.price = {
        lte: parseFloat(maxPrice as string)
      };
    }
    if (q) {
      whereClause.OR = [
        { name: { contains: q as string, mode: "insensitive" } },
        { description: { contains: q as string, mode: "insensitive" } }
      ];
    }
    
    const perfumes = await prisma.perfume.findMany({
      where: whereClause,
      include: {
        brand: true,
        perfumist: true,
      },
      orderBy: { name: "asc" },
    });
    
    const formattedPerfumes = perfumes.map((p: any) => ({
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
        reviews: {
          include: {
            user: {
              select: { name: true }
            }
          },
          orderBy: { date: "desc" }
        }
      }
    });

    if (!perfume) {
      res.status(404).json({ error: "Perfume not found" });
      return;
    }
    
    res.json({
      ...perfume,
      brandName: perfume.brand ? perfume.brand.name : "",
      perfumistName: perfume.perfumist ? perfume.perfumist.name : "",
      brand: perfume.brand ? perfume.brand.name : "",
      perfumist: perfume.perfumist ? perfume.perfumist.name : "",
      reviews: perfume.reviews.map((r: any) => ({
        id: r.id,
        userName: r.user.name,
        rating: r.rating,
        comment: r.comment,
        date: r.date,
        perfumeId: r.perfumeId,
        userId: r.userId
      }))
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
    const { name, brandId, perfumistId, gender, price } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      res.status(400).json({ error: "Nome é obrigatório." });
      return;
    }
    if (!gender || !["Masculino", "Feminino", "Unissex"].includes(gender)) {
      res.status(400).json({ error: "Gênero inválido. Deve ser Masculino, Feminino ou Unissex." });
      return;
    }
    if (price === undefined || price === null || typeof price !== "number" || price <= 0) {
      res.status(400).json({ error: "Preço deve ser um número maior que zero." });
      return;
    }
    if (!brandId || typeof brandId !== "string" || !brandId.trim()) {
      res.status(400).json({ error: "Marca é obrigatória." });
      return;
    }
    if (!perfumistId || typeof perfumistId !== "string" || !perfumistId.trim()) {
      res.status(400).json({ error: "Perfumista é obrigatório." });
      return;
    }

    // Verify brand exists
    const brandExists = await prisma.brand.findUnique({ where: { id: brandId } });
    if (!brandExists) {
      res.status(400).json({ error: "A marca especificada não existe." });
      return;
    }

    // Verify perfumist exists
    const perfumistExists = await prisma.perfumist.findUnique({ where: { id: perfumistId } });
    if (!perfumistExists) {
      res.status(400).json({ error: "O perfumista especificado não existe." });
      return;
    }

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
    
    // Check if perfume exists
    const perfumeExists = await prisma.perfume.findUnique({ where: { id } });
    if (!perfumeExists) {
      res.status(404).json({ error: "Perfume não encontrado." });
      return;
    }

    const { name, brandId, perfumistId, gender, price } = req.body;

    if (name !== undefined && (typeof name !== "string" || !name.trim())) {
      res.status(400).json({ error: "Nome inválido." });
      return;
    }
    if (gender !== undefined && !["Masculino", "Feminino", "Unissex"].includes(gender)) {
      res.status(400).json({ error: "Gênero inválido. Deve ser Masculino, Feminino ou Unissex." });
      return;
    }
    if (price !== undefined && (typeof price !== "number" || price <= 0)) {
      res.status(400).json({ error: "Preço deve ser maior que zero." });
      return;
    }
    if (brandId !== undefined) {
      if (typeof brandId !== "string" || !brandId.trim()) {
        res.status(400).json({ error: "Marca inválida." });
        return;
      }
      const brandExists = await prisma.brand.findUnique({ where: { id: brandId } });
      if (!brandExists) {
        res.status(400).json({ error: "A marca especificada não existe." });
        return;
      }
    }
    if (perfumistId !== undefined) {
      if (typeof perfumistId !== "string" || !perfumistId.trim()) {
        res.status(400).json({ error: "Perfumista inválido." });
        return;
      }
      const perfumistExists = await prisma.perfumist.findUnique({ where: { id: perfumistId } });
      if (!perfumistExists) {
        res.status(400).json({ error: "O perfumista especificado não existe." });
        return;
      }
    }

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

