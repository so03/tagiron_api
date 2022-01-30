const express = require('express');

const app = express();

app.use(express.json());


const { v4 } = require('uuid');


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

app.listen(3000);