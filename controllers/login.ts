import { Request, Response } from 'express';
import { BadRequestError } from '../errors';
import jwt from 'jsonwebtoken';
import assert from 'assert';

const getUserID = () => {
    return 1;
};

const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (!username || !password)
        throw new BadRequestError('username or password not provided');

    const id = getUserID(); // get the user ID from DB
    assert(process.env.JWT_SECRET)
    const token = jwt.sign({ id, username }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

    res.status(200).json({ msg: 'user logged in', token });
};

export default login;
