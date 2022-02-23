import fs from 'fs';

export class GameRepository {
    constructor(filepath) {
        this.filepath = filepath
    }

    persist(game) {
        fs.writeFileSync(this.filepath, game.toJson());
    }
}