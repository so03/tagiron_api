const isSameCards = require('./isSameCards');

test('test', () => {
    const cardA = [
        {
            number: 1,
            color: "red"
        },
        {
            number: 2,
            color: "red"
        },
        {
            number: 3,
            color: "red"
        },
        {
            number: 4,
            color: "red"
        },
    ];
    const cardB = [
        {
            number: 1,
            color: "red"
        },
        {
            number: 2,
            color: "red"
        },
        {
            number: 3,
            color: "red"
        },
        {
            number: 4,
            color: "red"
        },
    ]
    expect(isSameCards(cardA, cardB)).toBe(true);
})