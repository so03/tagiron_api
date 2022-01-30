const express = require('express');

const app = express();

app.get('/hello', (req, res) => {
    res.send("hello, world\n");
});

app.listen(3000);