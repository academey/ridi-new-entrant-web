"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express"); // 1
const app = express();
app.get('/', (req, res) => {
    // 2
    res.send('Hello World!');
});
app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});
