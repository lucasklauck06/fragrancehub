import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createBrand = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { name, country, image, description } = req.body;

    if (!name) {
      res.status(400).json({ error: "Name is required" });
      return;
    }

    const brand = await prisma.brand.create({
      data: { name, country, image, description },
    });

    res.status(201).json(brand);
  } catch (error) {
    res.status(500).json({ error: "Error creating brand" });
  }
};

export const getBrands = async (req: Request, res: Response): Promise<void> => {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { name: "asc" },
    });
    res.json(brands);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching brands" });
  }
};

export const getBrandById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const brand = await prisma.brand.findUnique({
      where: { id: id as string },
    });

    if (!brand) {
      res.status(404).json({ error: "Brand not found" });
      return;
    }

    res.json(brand);
  } catch (error) {
    res.status(500).json({ error: "Error fetching brand" });
  }
};

export const updateBrand = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, country, image, description } = req.body;

    const brand = await prisma.brand.update({
      where: { id: id as string },
      data: { name, country, image, description },
    });

    res.json(brand);
  } catch (error) {
    res.status(500).json({ error: "Error updating brand" });
  }
};

export const deleteBrand = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.brand.delete({
      where: { id: id as string },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error deleting brand" });
  }
};
