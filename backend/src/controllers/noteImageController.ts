import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getNoteImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.query;

    if (!name || typeof name !== "string") {
      res.status(400).json({ error: "O nome da nota é obrigatório." });
      return;
    }

    // 1. Check Cache
    const cachedImage = await prisma.noteImage.findUnique({
      where: { name }
    });

    if (cachedImage) {
      res.json({ imageUrl: cachedImage.imageUrl });
      return;
    }

    // 2. Fetch from Unsplash
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
      console.warn("UNSPLASH_ACCESS_KEY não configurada. Cache será preenchido com null.");
      // Se não houver chave, cria o cache nulo e retorna nulo.
      await prisma.noteImage.create({ data: { name, imageUrl: null } });
      res.json({ imageUrl: null });
      return;
    }

    // Aprimora a query para buscar por termos como planta, fruta, resina
    const searchQuery = encodeURIComponent(`${name} plant fruit`);
    const unsplashUrl = `https://api.unsplash.com/search/photos?query=${searchQuery}&client_id=${accessKey}&per_page=1&orientation=squarish`;

    const response = await fetch(unsplashUrl);
    if (!response.ok) {
      console.error(`Unsplash API error: ${response.statusText}`);
      await prisma.noteImage.create({ data: { name, imageUrl: null } });
      res.json({ imageUrl: null });
      return;
    }

    const data = await response.json();
    let imageUrl = null;

    if (data.results && data.results.length > 0) {
      // Pega a URL 'small' ou 'regular' da primeira imagem
      imageUrl = data.results[0].urls.small || data.results[0].urls.regular;
    }

    // 3. Save to Cache
    await prisma.noteImage.create({
      data: { name, imageUrl }
    });

    res.json({ imageUrl });
  } catch (error) {
    console.error("Erro ao buscar imagem da nota:", error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
};
