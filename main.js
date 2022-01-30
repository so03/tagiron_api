const express = require('express');

const app = express();

app.use(express.json());

let players = [];

app.get('/hello', (req, res) => {
    res.send("hello, world\n");
});

app.post('/players', (req, res) => {
    const { name } = req.body;
    if (players.some(p => p.name === name)) {
        console.error("this name is already used: ", name);
        res.status(409).send();
        return;
    }
    players.push(req.body);
    console.log("current players", players);

    res.status(204).send();
})

app.listen(3000);