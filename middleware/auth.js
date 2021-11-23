const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer '))
        throw new UnauthenticatedError('Please provide authentication.');

    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        // Improvement: Check DB for user (if the token is not expired, but user
        // was deleted).
        // const user = User.findById(payload.userId).select('-password')
        req.user = { userId: payload.userId, name: payload.name };

        next();
    } catch (err) {
        throw new UnauthenticatedError('Not authorized to access this route.');
    }
};

module.exports = auth;
