import { v4 } from 'uuid';
import { abort } from './errors.js';
import isSameCards from './logics/isSameCards.js';
import shuffle from './logics/shuffle.js';
import { QUESTION_TEXTS } from './constants.js';

// HTTPエラーコードを、プログラムのエラーコード的に利用する（HTTPに依存しているのではなく、たまたま一致した体を装う）
export class Game {
    constructor() {
        this.players = [];
        this.questions = [];
        this.answerCards = [];
        this.turn = null;
        this.winner = null;
    }

    toJson() {
        return JSON.stringify({
            players: this.players,
            questions: this.questions,
            answerCards: this.answerCards,
            turn: this.turn,
            winner: this.winner
        })
    }

    static fromJson(json) {
        const obj = JSON.parse(json);
        let game = new Game();
        game.players = obj.players 
        game.questions = obj.questions
        game.answerCards = obj.answerCards
        game.turn = obj.turn
        game.winner = obj.winner
        return game;
    }

    addPlayer(name) {
        if (this.players.some(p => p.name === name)) abort(409);
        const uuid = v4();
        this.players.push({
            name,
            uuid,
            cards: null,
            retired: false
        })
        return uuid;
    }

    removePlayer(name) {
        const index = this.players.findIndex(p => p.name === name);
        if (index < 0) return abort(400, 'Failed to delete');
        this.players.splice(index, 1);
    }

    init() {
        if (this.players.length < 4) abort(400, 'The members count are not enough.');

        this.winner = null;
        this.turn = 0;
        this.players = this.players.map(player => {
            player.retired = false;
            return player;
        })
        this.players = shuffle(this.players);
        let cards = [...Array(20)].map((_, i) => {
            const number = i % 10;
            if (number === 5) {
                return { number, color: 'yellow' }
            }
            if (i < 10) {
                return { number, color: 'red' }
            }
            return { number, color: 'blue' }
        });
        cards = shuffle(cards);
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].cards = [];
            for (let j = 0; j < 4; j++) {
                this.players[i].cards.push(cards.pop());
            }
        }
        console.log("All cards were passed out", this.players.map(p => JSON.stringify(p)));
        this.answerCards = cards;
        this.questions = shuffle(QUESTION_TEXTS).map(([_, text], i) => {
            return {
                id: i + 1,
                text,
                isOpen: i < 5
            }
        });
        return true;
    }

    view(uuid) {
        const me = this.findBy(uuid);
        if (!me) abort(404, 'View is not found');
        const opens = this.questions.filter(q => q.isOpen);
        const playerList = this.players.map((p, i) => {
            return {
                name: p.name,
                retired: p.retired,
                isTurn: i === this.turn
            }
        });
        return {
            me,
            opens,
            playerList
        };
    }

    result() {
        const playerCards = this.players.map(p => {
            return {
                name: p.name,
                cards: p.cards
            }
        })
        return {
            winner: this.winner,
            playerCards,
            answerCards: this.answerCards
        };
    }

    select(id) {
        const i = this.questions.findIndex(q => q.id === id);
        if (i < 0) abort(404);
        this.questions[i].selected = true;
    }

    declare(cards, name) {
        if (isSameCards(this.answerCards, cards)) {
            this.winner = name;
            return true;
        } else {
            this.retire(name);
            return false;
        }
    }

    retire(name) {
        const i = this.players.findIndex(p => p.name === name)
        this.players[i].retired = true;
    }

    isTurned(name) {
        const i = this.players.findIndex(p => p.name === name);
        return this.turn === i;
    }

    findBy(uuid) {
        return this.players.find(p => p.uuid === uuid);
    }
}
