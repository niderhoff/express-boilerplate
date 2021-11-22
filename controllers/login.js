const { BadRequestError } = require('../errors');
const jwt = require('jsonwebtoken');

const getUserID = () => {
    return 1;
};

const login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        throw new BadRequestError('username or password not provided');

    const id = getUserID(); // get the user ID from DB
    const token = jwt.sign({ id, username }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

    res.status(200).json({ msg: 'user logged in', token });
};

module.exports = login;
