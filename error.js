class MyError extends Error {
    constructor(message) {
        super(message);
        this.name = 'MyError'
    }
}

function test() {
    throw new MyError("Whoops!");
}

try {
    test();
} catch (err) {
    if (err instanceof MyError) {
        console.log(err.message);
        console.log(err.name);
        console.log(err.stack);
    } else {
        console.log("what?");
    }
}