const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('../errors/custom-error');

const errorHandlerMiddleware = async (err, req, res, next) => {
    const genericError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || 'Something went wrong. Try again later.',
    };
    if (err.name === 'ValidationError') {
        genericError.message = Object.values(err.errors)
            .map((item) => item.message)
            .join(',');
        genericError.statusCode = StatusCodes.BAD_REQUEST;
    }
    if (err.code && err.code === 11000) {
        genericError.message = `Duplicate value entered for ${Object.keys(
            err.keyValue
        )} field, please choose another value.`;
        genericError.statusCode = StatusCodes.BAD_REQUEST;
    }
    if (err.name === 'CastError') {
        genericError.message = `No item found with id ${err.value}.`;
        genericError.statusCode = StatusCodes.NOT_FOUND;
    }
    // Log internal server error stack trace because probably we want to fix it.
    if (!(err instanceof CustomAPIError)) console.log(err);
    return res
        .status(genericError.statusCode)
        .json({ msg: genericError.message });
};

module.exports = errorHandlerMiddleware;
