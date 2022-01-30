const express = require('express');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    const token = req.headers.authorization
    if (token) {
        const uuid = replace(/^uuid /, '');
        console.log(uuid);
        req.uuid = uuid;
    }
    next();
})

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

const { v4 } = require('uuid');

const QUESTION_TEXTS = [
    ["where is same color", "同じ色が隣り合っている数字タイルはどこ？"],
    ["where is 6 or 7", "6または7はどこ？（どちらかひとつ選ぶ）"],
    ["how many reds", "赤の数字タイルは何枚ある？"],
    ["sum", "[共有情報カード]数字タイル全ての数の合計は？"],
    ["where is 1 or 2", "1または2はどこ？（どちらかひとつ選ぶ）"],
    ["how many evens", "偶数は何枚ある？（0も含む）"],
    ["big 3 sum", "大きい方から3枚の数の合計は？"],
    ["continuous positions", "数が連続している数字タイルはどこ？"],
    ["where is 0", "0はどこ？"],
    ["where is 3 or 4", "3または4はどこ？（どちらかひとつ選ぶ）"],
    ["where is 8 or 9", "8または9はどこ？（どちらか一つ選ぶ）"],
    ["how many odds", "奇数は何枚ある？"],
    ["same number pairs", "同じ数字タイルのペアは何組ある？"],
    ["how many blues", "青の数字タイルは何枚ある？"],
    ["reds sum", "赤の数の合計は？"],
    ["where is 5", "5はどこ？"],
    ["small three sum", "小さい方から3枚の数の合計は？"],
    ["blues sum", "青の数の合計は？"],
    ["big - small", "[共有情報カード]数字タイルの最大の数から、最小の数を引いた数は？"],
];

let players = [];
let answerCards = [];
let questions = [];

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
        uuid,
        cards: null
    });
    console.log("current players", players);

    res.send({
        uuid
    });
})

app.post('/init', (req, res) => {
    if (players.length < 4) {
        res.status(400).send('The members count are not enough.')
        return;
    }

    let cards = [...Array(20)].map((_, i) => {
        const number = i % 10;
        if (number === 5) {
            return { number, color: 'yellow' }
        }
        if (number < 10) {
            return { number, color: 'red' }
        }
        return { number, color: 'blue' }
    });
    cards = shuffle(cards);

    for (let i = 0; i < players.length; i++) {
        players[i].cards = [];
        for (let j = 0; j < 4; j++) {
            // console.log("**Debug**", players[i])
            players[i].cards.push(cards.pop());
        }
    }
    console.log("All cards were passed out", players.map(p => JSON.stringify(p)));
    answerCards = cards;

    questions = shuffle(QUESTION_TEXTS).map(([_, text], i) => {
        return {
            id: i + 1,
            text,
            opens: i < 5
        }
    });

    res.send(questions);
})

// app.get('/game', (req, res) => {

// })

function getPlayer(uuid) {
    return players.find(p => p.uuid === uuid);
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

app.listen(3000);