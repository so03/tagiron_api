export function abort(status, message = '') {
    switch (status) {
        case 400:
            throw new BadRequest(message)
        case 404:
            throw new NotFound(message)
        case 409:
            throw new Conflict(message)
        default:
            throw new InternalServerError(message)
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