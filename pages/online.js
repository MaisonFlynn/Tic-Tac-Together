import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import io from 'socket.io-client';

let socket;

export default function Online() {
    const [board, boarded] = useState(Array(9).fill(null));
    const [turn, turned] = useState(false); // DON'T Start w/o Connection Established
    const [symbol, symbolized] = useState(null);
    const [symbOl, symbOlized] = useState(null); // Opponent's Symbol
    const [announcer, announced] = useState('SEARCHING...');
    const [username, usernamed] = useState('');
    const [opponent, opponented] = useState('');
    const [timer, timed] = useState(30); // 30 Seconds PER Turn
    const [clOck, clOcked] = useState(30); // Opponent's Timer
    const [skip, skipped] = useState(0);
    const [connect, connected] = useState(false);

    const router = useRouter();
    const reference = useRef(null); // Timer Reference

    useEffect(() => {
        socket = io(); // Connect TO NextJS Port

        socket.on('connect', () => {
            connected(true);
        });

        const saved = localStorage.getItem('username');
        if (saved) {
            usernamed(saved);
            socket.emit('boop', saved);
        }

        // Waitin'
        socket.on('yellow', (message) => {
            announced(message);
        });

        // Startin'
        socket.on('green', ({ symbol, symbOl, turn, opponent }) => {
            symbolized(symbol);
            symbOlized(symbOl);
            opponented(opponent);
            turned(turn);
            announced(`PAGAN: ${opponent}`);
            green(turn); // Start Game
        });

        // Opponent's Move
        socket.on('mOve', ({ index, symbol }) => {
            boarded((soggy) => {
                const crisp = [...soggy];
                crisp[index] = symbol;

                peep(crisp, symbol); // Check IF Win

                return crisp;
            });

            turned(true);
            tick(); // Start Timer
        });

        // Invalid Move
        socket.on('fluke', (message) => {
            console.log(message);
        });

        // Opponent Disconnected
        socket.on('discOnnected', () => {
            announced('RAGEQUIT!');
            clearInterval(reference.current);
        });

        // Kaput
        socket.on('red', ({ result }) => {
            if (result === 'win') {
                announced('YOU WIN!');
            } else if (result === 'lose') {
                announced('YOU LOSE!');
            } else if (result === 'draw') {
                announced('DRAW!');
            }
            clearInterval(reference.current);
        });

        // Update Timer(s)
        socket.on('refresh', ({ time, nunya }) => {
            if (nunya) {
                clOcked(time); // Update Opponent's Timer
            } else {
                timed(time); // Update Player's Timer
            }
        });

        return () => {
            socket.disconnect();
            clearInterval(reference.current);
        };
    }, []);

    useEffect(() => {
        if (!turn) return; // ONLY Check IF Player's Turn

        peep(board, symbol);
    }, [board]);

    // Start Game
    const green = (playerTurn) => {
        boarded(Array(9).fill(null));
        announced(null);
        timed(30);
        clOcked(30);
        skipped(0);
        clearInterval(reference.current);
        if (playerTurn) tick();
    };

    // Timer
    const tick = () => {
        clearInterval(reference.current);
        timed(30);
        clOcked(30);
        reference.current = setInterval(() => {
            timed((idek) => {
                const reboot = idek - 1;
                socket.emit('refresh', { time: reboot, nunya: false });
                if (reboot <= 0) {
                    clearInterval(reference.current);
                    swerve(); // Skip Turn
                    return 0;
                }
                return reboot;
            });
        }, 1000);
    };

    // Make Move
    const juke = (index) => {
        if (!board[index] && turn && !announcer) {
            const crisp = [...board];
            crisp[index] = symbol;
            boarded(crisp);
            turned(false);
            clearInterval(reference.current);
            socket.emit('juke', { index, symbol });

            // Check FOR Win OR Draw
            peep(crisp, symbol);

            socket.emit('refresh', { time: 30, nunya: true }); // Reset Opponent's Timer
        }
    };

    // Skip Turn
    const swerve = () => {
        skipped((idek) => {
            const recount = idek + 1;
            if (recount >= 2) {
                announced('YOU LOSE!');
                socket.emit('forfeit');
            } else {
                turned(!turn);
                tick();
            }
            return recount;
        });
    };

    // Check IF Win
    const peep = (slate, sigil) => {
        const combinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        let goat = null;

        // Check FOR Win
        for (let combination of combinations) {
            const [a, b, c] = combination;
            if (slate[a] === sigil && slate[b] === sigil && slate[c] === sigil) {
                goat = sigil;
                break;
            }
        }

        // IF NO Win, Check FOR Draw
        if (goat) {
            socket.emit('red', { goat });
        } else if (slate.every(cell => cell !== null)) {
            // IF NO Win AND Board is FULL, THEN Draw
            socket.emit('red', { goat: null });
        }
    };

    const reboot = () => {
        socket.emit('boop', username); // Play Again
    };

    return (
        <div className="container">
            <h1>TIC-TAC-TOGETHER</h1>
            <div className="board">
                {board.map((value, index) => (
                    <div
                        key={index}
                        className={`cell nes-btn ${value ? 'is-disabled' : 'nes-btn'}`}
                        onClick={() => juke(index)}
                    >
                        {value}
                    </div>
                ))}
            </div>
            {!announcer && (
                <div className="informant">
                    <h3>{turn ? `${username}'S TURN: ${symbol}` : `${opponent}'S TURN: ${symbOl}`}</h3>
                    <progress
                        className={`nes-progress ${turn ? 'is-success' : 'is-error'}`}
                        value={turn ? timer : clOck}
                        max="30"
                    ></progress>
                </div>
            )}
            {announcer && (
                <div className="result">
                    <h2>{announcer}</h2>
                    <button className="nes-btn is-success" onClick={reboot}>AGAIN</button>
                    <button className="nes-btn is-error" onClick={() => router.push('/menu')}>LEAVE</button>
                </div>
            )}
        </div>
    );
}
