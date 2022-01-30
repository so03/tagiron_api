const express = require('express');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    const uuid = req.headers.authorization.replace(/^uuid /, '');
    console.log(uuid);
    req.uuid = uuid;
    next();
})

const { v4 } = require('uuid');


let players = [];


app.get('/hello', (req, res) => {
    res.send("hello, world\n");
});

app.get('/valid', (req, res) => {
    if (req.uuid === 'test-uuid') {
        res.send('ok');
    } else {
        res.status(400).send('ng');
    }
})

app.post('/players', (req, res) => {
    const { name } = req.body;
    if (players.some(p => p.name === name)) {
        console.error("this name is already used: ", name);
        res.status(409).send();
        return;
    }

    const uuid = v4();

    players.push({
        name,
        uuid
    });
    console.log("current players", players);

    res.send({
        uuid
    });
})

app.post('/start', (req, res) => {
    
})

// app.get('/game', (req, res) => {

// })

function getPlayer(uuid) {
    return players.find(p => p.uuid === uuid);
}
app.listen(3000);