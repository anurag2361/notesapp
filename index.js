/* eslint-disable no-console */
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const User = require('./model/usermodel');
const Post = require('./model/postmodel');
const port = 4000;
const route = require('./controller/routes');
const path = require('path');

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './front/build', 'index.html'));
});

app.use('/user', route);

mongoose.connect('mongodb://localhost/test1', { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connected");
});

app.listen(port, () => {
    console.log("app listening on port 4000");
});