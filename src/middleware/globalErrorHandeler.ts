import type { NextFunction, Request, Response } from "express";
import { sendError } from "../utility/sendResponse";
import { StatusCodes } from "http-status-codes";
import config from "../config";

export const globalErrorHandler = (err: any,req: Request,res: Response,next: NextFunction) => {

if(config.node_env === 'development'){
return sendError(res,
    err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    err.message || "Internal Server Error",
    err)
}else{
return sendError(res,
    err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    err.isOperational ? err.message || "Internal Server Error" : 'Something went very wrong!'
)
}
};

export const notFound = (req: Request, res: Response) => {

return sendError(res,StatusCodes.NOT_FOUND,'API Not Found',{path: req.originalUrl,method: req.method})
};

