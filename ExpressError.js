class ExpressError extends Error {
    constructor(status, messgae) {
        super();
        this.status = status;
        this.message = message;
    }
}

module.exports = ExpressError;
