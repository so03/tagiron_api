exports.abort = function (status, message = '') {
    switch (status) {
        case 400:
            throw new BadRequest(message)
            break;
        case 404:
            throw new NotFound(message)
            break;
        case 409:
            throw new Conflict(message)
            break;
        default:
            throw new InternalServerError(message)
            break;
    }
}

class BadRequest extends Error {
    constructor(message) {
        super(message)
        this.name = 'BadRequest'
    }
}

class NotFound extends Error {
    constructor(message) {
        super(message)
        this.name = 'NotFoundError'
    }
}

class Conflict extends Error {
    constructor(message) {
        super(message)
        this.name = 'ConflictError'
    }
}

class InternalServerError extends Error {
    constructor(message) {
        super(message)
        this.name = 'InternalServerError'
    }
}