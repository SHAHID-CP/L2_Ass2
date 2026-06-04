import type { Response } from "express";

export const sendSuccess = <T>(res: Response, statusCode: number, message: string, data?: T):Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (res: Response, statusCode: number, message: string, errors?: unknown):Response => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    if (stack) {
      this.stack = stack;
    } else if (Error.captureStackTrace){
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

