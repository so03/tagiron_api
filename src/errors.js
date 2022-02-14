export function abort(status, message = '') {
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

export class BadRequest extends Error {
    constructor(message) {
        super(message)
        this.name = 'BadRequest'
    }
}

export class NotFound extends Error {
    constructor(message) {
        super(message)
        this.name = 'NotFound'
    }
}

export class Conflict extends Error {
    constructor(message) {
        super(message)
        this.name = 'Conflict'
    }
}

export class InternalServerError extends Error {
    constructor(message) {
        super(message)
        this.name = 'InternalServer'
    }
}