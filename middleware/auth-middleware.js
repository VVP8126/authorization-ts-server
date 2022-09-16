const ApplicationError = require("./../errors/application-error");
const tokenService = require("./../service/tokenService");

// This middleware necessary to limit access only for authorized users
module.exports = function(request, responce, next) {
    try {
        const authorizationHeader = request.headers.authorization;
        if(!authorizationHeader) {
            return next(ApplicationError.UnauthorizedError());
        }
        const accessToken = authorizationHeader.split(" ")[1];
        if(!accessToken) {
            return next(ApplicationError.UnauthorizedError());
        }
        const userData = tokenService.validateAccessToken(accessToken);
        if(!userData) {
            return next(ApplicationError.UnauthorizedError());
        }
        request.user = userData;
        next();
    } catch (error) {
        return next(ApplicationError.UnauthorizedError());
    }
}
