import { Game } from './src/game.js';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import { handleErrors } from './src/middleware/handleErrors.js';
import { saveToFile } from './src/persistence.js';
import fs from 'fs'

let game = null;

if (fs.existsSync('./game.json')) {
    const json = fs.readFileSync('./game.json');
    game = Game.fromJson(json);
} else {
    game = new Game();
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');
})

function auth(req, res, next) {
    const player = game.findBy(req.uuid);
    if (!player) {
        res.status(401).send('Unauthorized.')
        return;
    }
    req.player = player;
    next();
}
function isTurn(req, res, next) {
    if (!game.isTurned(req.player.name)) {
        res.status(401).send('Not your turn.');
        return;
    }
    next();
}

function broadcastUpdating() {
    io.emit('update', 'updated');
}

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
    const token = req.headers.authorization
    if (token) req.uuid = token.replace(/^uuid /, '');
    next();
})

app.get('/', (req, res) => {
    res.status(200).send("hello\n");
})
app.get('/players', (req, res) => {
    res.send(game.players)
})
app.post('/players', (req, res) => {
    const uuid = game.addPlayer(req.body.name);
    broadcastUpdating();
    saveToFile(game);
    res.send({
        uuid
    });
})
app.get('/delete-players/:name', (req, res) => {
    game.removePlayer(req.params.name)
    broadcastUpdating();
    res.status(200).send('deleted');
})
app.post('/init', (req, res) => {
    game.init();
    broadcastUpdating();
    saveToFile(game);
    res.status(200).send('New game initialized');
})
app.get('/game/:uuid', [auth], (req, res) => {
    res.send(game.view(req.params.uuid));
})
app.post('/questions/:id/select', [auth, isTurn], (req, res) => {
    game.select(req.params.id);
    broadcastUpdating();
    saveToFile(game);
    res.status(204).send();
})
app.post('/declare', [auth], (req, res) => {
    const msg = game.declare(req.body.cards) ? 'success' : 'fail';
    broadcastUpdating();
    saveToFile(game);
    res.status(200).send(msg);
})
app.get('/result', [auth], (req, res) => {
    res.send(game.result());
})

app.use(handleErrors)

server.listen(3000);