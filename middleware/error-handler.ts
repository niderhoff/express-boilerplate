import CustomAPIError from '../errors/custom-error';
import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';


const errorHandlerMiddleware = async (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof CustomAPIError) {
        return res.status(err.statusCode).json({ msg: err.message });
    }
    console.log(err);
    return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: 'something went wrong' });
};

export default errorHandlerMiddleware
