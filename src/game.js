import { v4 } from 'uuid';
import { abort } from './errors.js';
import { shuffle } from './logics/shuffle.js';
import { isSameCards } from './logics/isSameCards.js';
import { QUESTION_TEXTS } from './constants.js';

// HTTPエラーコードを、プログラムのエラーコード的に利用する（HTTPに依存しているのではなく、たまたま一致した体を装う）
export class Game {
    constructor(repository) {
        this.isStarted = false;
        this.players = [];
        this.questions = [];
        this.answerCards = [];
        this.turn = null;
        this.winner = null;
        this.repository = repository
    }

    addPlayer(name) {
        if (this.players.length === 4) abort(400, 'Already reached Max player count');
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

    allCards() {
        let cards = [];
        let id = 1;
        for (let i = 0; i < 10; i++) {
            if (i === 5) {
                for (let j = 0; j < 2; j++) {
                    cards.push({ id, number: i, color: 'yellow' })
                    id += 1;
                }
                continue;
            }
            cards.push({ id, number: i, color: 'red' })
            id += 1;
            cards.push({ id, number: i, color: 'blue' })
            id += 1;
        }
        return cards;
    }

    save() {
        this.repository.persist(this)
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

    static fromJson(json, repository) {
        const obj = JSON.parse(json);
        let game = new Game();
        game.players = obj.players
        game.questions = obj.questions
        game.answerCards = obj.answerCards
        game.turn = obj.turn
        game.winner = obj.winner
        game.repository = repository

        return game;
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
        let cards = this.allCards();
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
                isUsed: false,
                isSelected: false,
            }
        });

        this.isStarted = true;

        return true;
    }

    nextTurn({ questionCheck = true } = {}) {
        if (this.players.every(p => p.retired)) abort(500, 'All players were already retired');

        while (true) {
            this.turn += 1;
            this.turn %= 4;
            if (!this.turnedPlayer().retired) break;
        }

        console.log("opens", this.opens())

        if (questionCheck) {
            const i = this.questions.findIndex(q => q.isSelected)

            if (i < 0) abort(500, 'Failed to next turn. A question is not selected.')

            this.questions[i].isUsed = true;
        }

        return true;
    }

    view(uuid) {
        const me = this.findBy(uuid);
        if (!me) abort(404, `View is not found. uuid: ${uuid}`);
        const playerList = this.players.map((p, i) => {
            return {
                name: p.name,
                retired: p.retired,
                isTurn: i === this.turn
            }
        });
        const questionCount = this.questions.filter(q => !q.isUsed).length
        return {
            me,
            isTurn: this.isTurned(me.uuid),
            turnedPlayerName: this.turnedPlayer().name,
            opens: this.opens(),
            playerList,
            questionCount,
            isSelected: this.isSelectEnded(),
            isFinished: this.winner !== null
        };
    }

    opens() {
        return this.questions.filter(q => !q.isUsed).slice(0, 5);
    }

    result() {
        const allPlayerCards = this.players.map(p => {
            return {
                name: p.name,
                cards: p.cards
            }
        })
        return {
            winner: this.winner,
            allPlayerCards,
            answerCards: this.answerCards
        };
    }

    select(id) {
        if (this.isSelectEnded()) abort(400, 'Already selected.')
        const i = this.questions.findIndex(q => q.id == id);
        if (i < 0) abort(404);
        this.questions[i].isSelected = true;
    }

    isSelectEnded() {
        return this.opens().some(q => q.isSelected)
    }

    declare(cards, uuid) {
        const player = this.findBy(uuid)
        if (!player) abort(404, 'The player was not found')

        if (isSameCards(this.answerCards, cards)) {
            this.winner = player.name;
            return true;
        } else {
            this.retire(uuid);

            if (this.isTurned(uuid)) {
                this.nextTurn({ questionCheck: false })
            }

            return false;
        }
    }

    retire(uuid) {
        const i = this.players.findIndex(p => p.uuid === uuid)
        if (i < 0) {
            console.error(`A player failed to retire. index: ${i}, name: ${name}`)
            abort(500, 'Retire failed. Something went wrong')
        }
        this.players[i].retired = true;
    }

    isTurned(uuid) {
        const i = this.players.findIndex(p => p.uuid === uuid);
        return this.turn === i;
    }

    turnedPlayer() {
        return this.players[this.turn]
    }

    findBy(uuid) {
        return this.players.find(p => p.uuid === uuid);
    }
}
