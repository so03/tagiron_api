import { BadRequest, Conflict, NotFound } from "../errors.js";

export function handleErrors(err, req, res, next) {
    console.error(err.stack)
    if (err instanceof BadRequest) {
        res.status(400).send(err.message);
        return;
    }
    if (err instanceof NotFound) {
        res.status(404).send(err.message);
        return;
    }
    if (err instanceof Conflict) {
        res.status(409).send(err.message);
        return;
    }
    res.status(500).send('Something broke!')
}