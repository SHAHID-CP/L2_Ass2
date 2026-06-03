import type { NextFunction, Request, Response } from "express";
import { sendError } from "../utility/sendResponse";
import { StatusCodes } from "http-status-codes";

const globalErrorHandler = (err: any,req: Request,res: Response,next: NextFunction) => {

return sendError(res,StatusCodes.INTERNAL_SERVER_ERROR,err.message || "Internal Server Error",err)
};

export default globalErrorHandler;