import type { NextFunction, Request, Response } from "express";
import { sendError } from "../utility/sendResponse";
import { StatusCodes } from "http-status-codes";

export const globalErrorHandler = (err: any,req: Request,res: Response,next: NextFunction) => {

return sendError(res,StatusCodes.INTERNAL_SERVER_ERROR,err.message || "Internal Server Error",err)
};

export const notFound = (req: Request, res: Response) => {

return sendError(res,StatusCodes.NOT_FOUND,'API Not Found',{path: req.originalUrl,method: req.method})
};

