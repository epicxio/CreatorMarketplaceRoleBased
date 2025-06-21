import { Request, Response, NextFunction } from 'express';
 
export type ValidateRequestMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => void | Promise<void>; 