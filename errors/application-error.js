class ApplicationError extends Error {

    status;
    errors;

    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError() {
        return new ApplicationError(401, "User not authorized");
    }

    static BadRequestError(message, errors = []) {
        return new ApplicationError(400, message, errors);
    }
}

module.exports = ApplicationError;
