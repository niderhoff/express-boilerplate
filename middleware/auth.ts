import assert from 'assert';
import { NextFunction, Request, Response } from 'express';
import { verify, JwtPayload } from 'jsonwebtoken';
import { UnauthenticatedError } from '../errors';

interface AuthenticatedRequest extends Request {
    user: {
        id: Number,
        username: string
    }
}

const authenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthenticatedError('Please provide authentication.');
    }
    const token = authHeader.split(' ')[1];
    try {
        assert(process.env.JWT_SECRET, "Please set the JWT_SECRET in .env")
        const decoded = verify(token, process.env.JWT_SECRET);
        if (!(typeof decoded === "string")) {
            const { id, username } = decoded;
            (req as AuthenticatedRequest).user = { id, username };
        } else {  // TODO??? wtf why can it be a string
            console.log(`error : ${decoded}`);
        }
        next();
    } catch (err) {
        throw new UnauthenticatedError('not authorized to access this route');
    }
};

module.exports = authenticationMiddleware;
