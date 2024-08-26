require('dotenv').config();

const express = require('express');
const next = require('next');
const http = require('http');
const { Server } = require('socket.io');
const { parse } = require('url');

const dev = process.env.ENV !== 'production';
const port = process.env.PORT || 3000;

const app = next({
    dev,
    hostname: 'localhost',
    port,
});

const handle = app.getRequestHandler();

app.prepare().then(() => {
    const expression = express();
    const server = http.createServer(expression);
    const io = new Server(server);

    let jorkingIT = null; // Waitin' Player

    io.on('connection', (socket) => {
        console.log('User Connected');

        socket.on('boop', (username) => {
            socket.username = username;
            if (jorkingIT) {
                // Match & Start
                socket.symbol = 'O';
                jorkingIT.symbol = 'X';
                jorkingIT.opponent = socket;
                socket.opponent = jorkingIT;
                jorkingIT.turn = true;
                socket.turn = false;

                socket.emit('green', { symbol: 'O', symbOl: 'X', turn: false, opponent: jorkingIT.username });
                jorkingIT.emit('green', { symbol: 'X', symbOl: 'O', turn: true, opponent: socket.username });

                jorkingIT = null;
            } else {
                jorkingIT = socket;
                socket.emit('yellow', 'SEARCHING...');
            }
        });

        socket.on('juke', ({ index, symbol }) => {
            if (socket.turn) {
                // Ensure Valid Move 
                socket.turn = false;
                socket.opponent.turn = true;
                socket.opponent.emit('mOve', { index, symbol });
            } else {
                socket.emit('fluke', 'CHILLAX!');
            }
        });

        socket.on('red', ({ winner }) => {
            if (winner !== null) {
                if (winner === socket.symbol) {
                    // Current Player WIN
                    socket.emit('red', { result: 'win' });
                    socket.opponent.emit('red', { result: 'lose' });
                } else {
                    // Opponent WIN
                    socket.emit('red', { result: 'lose' });
                    socket.opponent.emit('red', { result: 'win' });
                }
            } else {
                // DRAW
                socket.emit('red', { result: 'draw' });
                socket.opponent.emit('red', { result: 'draw' });
            }
        });

        socket.on('refresh', ({ time, nunya }) => {
            // Broadcast Timer Update TO BOTH Player(s)
            socket.emit('refresh', { time, nunya });
            socket.opponent.emit('refresh', { time, nunya: !nunya });
        });

        socket.on('forfeit', () => {
            socket.opponent.emit('discOnnected');
        });

        socket.on('disconnect', () => {
            if (jorkingIT === socket) {
                jorkingIT = null;
            } else if (socket.opponent) {
                socket.opponent.emit('discOnnected');
            }
        });
    });

    expression.all('*', (req, res) => {
        const parsed = parse(req.url, true);
        handle(req, res, parsed);
    });

    server.listen(port, (err) => {
        if (err) throw err;
        console.log(`http://localhost:${port}`);
    });
});
