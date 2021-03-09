const express = require('express');
const app = express();
const morgan = require('morgan');
const database = require('./database');
const http = require('http');

app.use(morgan('dev'));
app.use(express.json());

app.use('/', require('./src/routes/api.routes'));

const server = http.createServer(app);
const io = require('socket.io')(server);
app.io = io;

io.sockets.on('connection', (socket) => {
  console.log('Conectou => ' + socket.id);
});

module.exports = app;