import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAromaticGroups = async (req: Request, res: Response): Promise<void> => {
  try {
    const groups = await prisma.aromaticGroup.findMany({
      orderBy: { name: "asc" },
    });
    res.json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching aromatic groups" });
  }
};

export const getAromaticGroupById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const group = await prisma.aromaticGroup.findUnique({
      where: { id: id as string },
    });

    if (!group) {
      res.status(404).json({ error: "Aromatic group not found" });
      return;
    }
    
    res.json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching aromatic group" });
  }
};

export const createAromaticGroup = async (req: Request, res: Response): Promise<void> => {
  try {
    const group = await prisma.aromaticGroup.create({
      data: req.body,
    });
    res.status(201).json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating aromatic group" });
  }
};

export const updateAromaticGroup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const group = await prisma.aromaticGroup.update({
      where: { id: id as string },
      data: req.body,
    });
    res.json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating aromatic group" });
  }
};

export const deleteAromaticGroup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.aromaticGroup.delete({
      where: { id: id as string },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting aromatic group" });
  }
};
