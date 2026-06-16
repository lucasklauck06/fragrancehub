import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const news = await prisma.news.findMany({
      orderBy: { date: "desc" },
    });
    res.json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching news" });
  }
};

export const getNewsById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const news = await prisma.news.findUnique({
      where: { id: id as string },
    });

    if (!news) {
      res.status(404).json({ error: "News not found" });
      return;
    }
    
    res.json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching news item" });
  }
};

export const createNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const news = await prisma.news.create({
      data: req.body,
    });
    res.status(201).json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating news" });
  }
};

export const updateNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const news = await prisma.news.update({
      where: { id: id as string },
      data: req.body,
    });
    res.json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating news" });
  }
};

export const deleteNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.news.delete({
      where: { id: id as string },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting news" });
  }
};
