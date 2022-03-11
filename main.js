import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { Game } from "./src/game.js";
import { GameRepository } from "./src/gameRepository.js";
import { handleErrors } from "./src/middleware/handleErrors.js";
import fs from "fs";
import path from 'path';

// ゲームデータ初期化
let game = null;

// セーブファイルの指定
const gameRepository = new GameRepository(path.resolve('./game.json'));

// セーブデータの読み込み
if (fs.existsSync("./game.json")) {
    const json = fs.readFileSync("./game.json");
    game = Game.fromJson(json, gameRepository);
} else {
    game = new Game(gameRepository);
}

// APIサーバーの初期化
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("a user connected");
});

function isTurn(req, res, next) {
    if (!game.isTurned(req.player.name)) {
        res.status(401).send("Not your turn.");
        return;
    }
    next();
}

function broadcast() {
    io.emit("update", "updated");
}

app.use(express.json());
app.use(cors());

// API エンドポイント

const api = express.Router();

api.get("/", (req, res) => {
    res.status(200).send("hello\n");
});

// 参加者一覧
api.get("/players", (req, res) => {
    res.send(game.players.map(p => ({ name: p.name })))
});

// 参加
api.post("/players", (req, res) => {
    const uuid = game.addPlayer(req.body.name)
    game.save();
    broadcast();
    res.send({
        uuid,
    });
});

// ゲーム開始済？
api.get("/is-started", (req, res) => {
    res.status(200).send({ isStarted: game.isStarted })
})

// 新しくゲーム開始
api.post("/game", (req, res) => {
    game.init();
    game.save();
    broadcast();
    res.status(200).send("New game initialized");
});

// 全カード
api.get("/cards", (req, res) => {
    res.send(game.allCards());
});

// ゲームビュー
api.get("/game-view", (req, res) => {
    res.send(game.view(req.query.uuid));
});

// 質問選択
api.patch("/questions/:id", [isTurn], (req, res) => {
    game.select(req.params.id)
    game.save();
    broadcast();
    res.status(204).send();
});

// 宣言
api.post("/declare", (req, res) => {
    const msg = game.declare(req.body.cards, req.query.uuid) ? "success" : "fail";
    game.save();
    broadcast();
    res.status(200).send(msg);
});

// 結果
api.get("/result", (req, res) => {
    res.send(game.result());
});

app.use('/api', api)

app.use(handleErrors);

server.listen(3000);
