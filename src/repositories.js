import fs from 'fs';

export class FileRepository {
    constructor(filepath) {
        this.filepath = filepath
    }

    persist(jsonable) {
        fs.writeFileSync(this.filepath, jsonable.toJson());
    }
}