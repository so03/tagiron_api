import fs from 'fs';

export function saveToFile(game) {
    fs.writeFileSync('./game.json', game.toJson());
}