class ExpressError extends Error {
    constructor(status, messgae) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = ExpressError;
