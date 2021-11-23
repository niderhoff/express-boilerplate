const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');
const User = require('../models/User');

const register = async (req, res) => {
    const user = await User.create({ ...req.body });
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({ name: user.getName(), token });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) throw new Error('email or password not provided');

    // user exists?
    const user = await User.findOne({ email });
    if (!user) throw new UnauthenticatedError('Invalid credentials.');

    // password is correct?
    if (!(await user.checkPassword(password)))
        throw new UnauthenticatedError('Invalid credentials.');

    const token = user.createJWT();
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = { login, register };
