import { Request, Response, NextFunction } from 'express';

export const adminMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const user = (req as any).user;
  
  if (!user || user.role !== 'ADMIN') {
    res.status(403).json({ error: 'Acesso negado. Apenas administradores podem realizar esta ação.' });
    return;
  }
  
  next();
};
