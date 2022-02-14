import { BadRequest } from "../errors.js";

export function handleErrors(err, req, res, next) {
    if (err instanceof BadRequest) {
        res.status(400).send(err.message);
    }
    console.error(err.stack)
    res.status(500).send('Something broke!')
}