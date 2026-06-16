import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getPerfumists = async (req: Request, res: Response): Promise<void> => {
  try {
    const perfumists = await prisma.perfumist.findMany({
      orderBy: { name: "asc" },
    });
    res.json(perfumists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching perfumists" });
  }
};

export const getPerfumistById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const perfumist = await prisma.perfumist.findUnique({
      where: { id: id as string },
    });

    if (!perfumist) {
      res.status(404).json({ error: "Perfumist not found" });
      return;
    }
    
    res.json(perfumist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching perfumist" });
  }
};

export const createPerfumist = async (req: Request, res: Response): Promise<void> => {
  try {
    const perfumist = await prisma.perfumist.create({
      data: req.body,
    });
    res.status(201).json(perfumist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating perfumist" });
  }
};

export const updatePerfumist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const perfumist = await prisma.perfumist.update({
      where: { id: id as string },
      data: req.body,
    });
    res.json(perfumist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating perfumist" });
  }
};

export const deletePerfumist = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.perfumist.delete({
      where: { id: id as string },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting perfumist" });
  }
};
