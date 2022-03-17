export function isSameCards(cardsA, cardsB) {
    if (cardsA.length !== cardsB.length) {
        console.log("The length is not same");
        return false;
    }

    if (cardsA.length !== 4) {
        console.log("The cards length must be 4");
        return false;
    }

    let used = [...Array(4)].map((_) => false);
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const a = cardsA[i];
            const b = cardsB[j];
            if (a.number === b.number && a.color === b.color && !used[j]) {
                used[j] = true;
            }
        }
    }

    if (used.every(u => u)) {
        return true;
    } else {
        return false;
    }
}
