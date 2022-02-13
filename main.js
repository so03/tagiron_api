let game = require('./src/game');

const express = require('express');
const app = express();
app.use(express.json());
app.use(require('cors')());
app.use((req, res, next) => {
    const token = req.headers.authorization
    if (token) req.uuid = token.replace(/^uuid /, '');
    next();
})
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
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

const server = require('http').createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
io.on('connection', (socket) => {
    console.log('a user connected');
})
function broadcastUpdating() {
    io.emit('update', 'updated');
}

app.get('/', (req, res) => {
    res.status(200).send("hello\n");
})
app.get('/players', (req, res) => {
    res.send(game.players)
})
app.post('/players', (req, res) => {
    const uuid = game.addPlayer(req.body.name);
    broadcastUpdating();
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
    res.status(200).send('New game initialized');
})
app.get('/game/:name', [auth], (req, res) => {
    res.send(game.view(req.params.name));
})
app.post('/questions/:id/select', [auth, isTurn], (req, res) => {
    game.select(req.params.id);
    broadcastUpdating();
    res.status(204).send();
})
app.post('/declare', [auth], (req, res) => {
    const msg = game.declare(req.body.cards) ? 'success' : 'fail';
    broadcastUpdating();
    res.status(200).send(msg);
})
app.get('/result', [auth], (req, res) => {
    res.send(game.result());
})

server.listen(3000);