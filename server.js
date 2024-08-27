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

    let jorkingIT = null; // Player Waitin'

    io.on('connection', (socket) => {
        console.log('User Connected');

        // Random Matchmaking
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

        // Move
        socket.on('juke', ({ index, symbol }) => {
            if (socket.turn) {
                socket.turn = false;
                socket.opponent.turn = true;
                socket.opponent.emit('mOve', { index, symbol });
            } else {
                socket.emit('fluke', 'CHILLAX!');
            }
        });

        // Result
        socket.on('red', ({ goated }) => {
            if (goated !== null) {
                if (goated === socket.symbol) {
                    socket.emit('red', { result: 'win' });
                    socket.opponent.emit('red', { result: 'lose' });
                } else {
                    socket.emit('red', { result: 'lose' });
                    socket.opponent.emit('red', { result: 'win' });
                }
            } else {
                socket.emit('red', { result: 'draw' });
                socket.opponent.emit('red', { result: 'draw' });
            }
        });

        // Timer Refresh
        socket.on('refresh', ({ time, nunya }) => {
            socket.emit('refresh', { time, nunya });
            socket.opponent.emit('refresh', { time, nunya: !nunya });
        });

        // Forfeit
        socket.on('forfeit', () => {
            socket.opponent.emit('discOnnected');
        });

        // Disconnect
        socket.on('disconnect', () => {
            if (jorkingIT === socket) {
                jorkingIT = null;
            } else if (socket.opponent) {
                socket.opponent.emit('discOnnected');
            }
        });

        // Generate Code
        socket.on('generate', (username) => {
            socket.username = username;
            const code = Math.random().toString(36).substr(2, 6).toUpperCase();
            socket.code = code;
            socket.emit('generated', code);
        });

        // Join
        socket.on('join', ({ code, username }) => {
            const game = Array.from(io.sockets.sockets.values()).find(s => s.code === code);
            
            // CAN'T Join Self
            if (game && game.id === socket.id) {
                socket.emit('fluke', 'INVALID!');
                return;
            }

            if (game) {
                socket.username = username;
                socket.symbol = 'O';
                game.symbol = 'X';
                game.opponent = socket;
                socket.opponent = game;
                game.turn = true;
                socket.turn = false;

                socket.emit('blast', { symbol: 'O', symbOl: 'X', turn: false, opponent: game.username });
                game.emit('blast', { symbol: 'X', symbOl: 'O', turn: true, opponent: socket.username });
            } else {
                socket.emit('fluke', 'INVALID CODE');
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
