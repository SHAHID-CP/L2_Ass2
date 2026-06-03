import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { sendError } from '../utility/sendResponse';
import config from '../config';

export interface JwtPayload {
  id: number;
  name: string;
  role: 'contributor' | 'maintainer';
}

export interface AuthRequest extends Request {
  user?: JwtPayload
}

export type ROLES = 'contributor' | 'maintainer';


// Request a user add
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}



export const authenticate = (req: Request,res: Response,next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token) return sendError(res, StatusCodes.UNAUTHORIZED, 'No token provided');
  try {
    const decoded = jwt.verify(token, config.secret as string) as JwtPayload;
    
    //Decoded user data insert
    req.user = decoded;
    next();
    }catch {
    return sendError(res, StatusCodes.UNAUTHORIZED, 'Invalid or expired token');
    }
};



export const authorize = (...roles: ROLES[])=> {

    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return sendError(res, StatusCodes.FORBIDDEN, 'Forbidden Insufficient permissions');
        }
    next();
    }
};