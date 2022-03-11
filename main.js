import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { Game } from "./src/game.js";
import { GameRepository } from "./src/gameRepository.js";
import { handleErrors } from "./src/middleware/handleErrors.js";
import fs from "fs";
import path from 'path';

let game = null;

const gameRepository = new GameRepository(path.resolve('./game.json'));

if (fs.existsSync("./game.json")) {
    const json = fs.readFileSync("./game.json");
    game = Game.fromJson(json, gameRepository);
} else {
    game = new Game(gameRepository);
}

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

function auth(req, res, next) {
    const player = game.findBy(req.uuid);
    if (!player) {
        res.status(401).send("Unauthorized.");
        return;
    }
    req.player = player;
    next();
}

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
app.use((req, res, next) => {
    const token = req.headers.authorization;
    if (token) req.uuid = token.replace(/^uuid /, "");
    next();
});

app.get("/", (req, res) => {
    res.status(200).send("hello\n");
});

// 参加者一覧
app.get("/api/players", (req, res) => {
    res.send(game.players.map(p => ({ name: p.name })))
});

// 参加
app.post("/api/players", (req, res) => {
    const uuid = game.addPlayer(req.body.name)
    game.save();
    broadcast();
    res.send({
        uuid,
    });
});

// 新しくゲーム開始
app.post("/api/game", (req, res) => {
    game.init();
    game.save();
    broadcast();
    res.status(200).send("New game initialized");
});

// 全カード
app.get("/api/cards", (req, res) => {
    res.send(game.allCards());
});

// ゲームビュー
app.get("/api/game-view", [auth], (req, res) => {
    res.send(game.view(req.params.uuid));
});

// 質問選択
app.patch("/api/questions/:id", [auth, isTurn], (req, res) => {
    game.select(req.params.id)
    game.save();
    broadcast();
    res.status(204).send();
});

// 宣言
app.post("/api/declare", [auth], (req, res) => {
    const msg = game.declare(req.body.cards) ? "success" : "fail";
    game.save();
    broadcast();
    res.status(200).send(msg);
});

// 結果
app.get("/api/result", [auth], (req, res) => {
    res.send(game.result());
});

app.use(handleErrors);

server.listen(3000);
