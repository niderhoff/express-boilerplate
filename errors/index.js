const CustomAPIError = require('./custom-error');
const UnauthenticatedError = require('./unauthenticated-error');
const BadRequestError = require('./badrequest-error');
const NotFoundError = require('./not-found-error');

module.exports = {
    CustomAPIError,
    UnauthenticatedError,
    BadRequestError,
    NotFoundError,
};
