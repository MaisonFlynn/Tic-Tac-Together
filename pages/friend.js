import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import io from 'socket.io-client';

let socket;

export default function Friend() {
    const [board, boarded] = useState(Array(9).fill(null));
    const [turn, turned] = useState(false);
    const [symbol, symbolized] = useState(null);
    const [symbOl, symbOlized] = useState(null);
    const [announcer, announced] = useState('LOITERIN\'');
    const [username, usernamed] = useState('');
    const [opponent, opponented] = useState('');
    const [code, coded] = useState('');
    const [input, inputted] = useState('');
    const [timer, timed] = useState(30); // Player's Timer
    const [clock, clocked] = useState(30); // Opponent's Timer
    const [skip, skipped] = useState(0);
    const [connect, connected] = useState(false);

    const router = useRouter();
    const reference = useRef(null);

    useEffect(() => {
        socket = io();

        socket.on('connect', () => {
            connected(true);
        });

        const saved = localStorage.getItem('username');
        if (saved) {
            usernamed(saved);
            socket.emit('generate', saved);
        }

        socket.on('generated', (code) => {
            coded(code.toUpperCase());
        });

        socket.on('blast', ({ symbol, symbOl, turn, opponent }) => {
            symbolized(symbol);
            symbOlized(symbOl);
            opponented(opponent);
            turned(turn);
            announced(`PAGAN: ${opponent}`);
            green(turn);
        });

        socket.on('mOve', ({ index, symbol }) => {
            boarded((soggy) => {
                const crisp = [...soggy];
                crisp[index] = symbol;

                peep(crisp, symbol);

                return crisp;
            });

            turned(true);
            ticktock();
        });

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

        socket.on('refresh', ({ time, nunya }) => {
            if (nunya) {
                clocked(time);
            } else {
                timed(time);
            }
        });

        return () => {
            socket.disconnect();
            clearInterval(reference.current);
        };
    }, []);

    const linkup = () => {
        socket.emit('join', { code: input, username });
    };

    const green = (gamer) => {
        boarded(Array(9).fill(null));
        announced(null);
        timed(30);
        clocked(30);
        skipped(0);
        clearInterval(reference.current);
        if (gamer) ticktock();
    };

    const ticktock = () => {
        clearInterval(reference.current);
        timed(30);
        clocked(30);
        reference.current = setInterval(() => {
            timed((soggy) => {
                const crisp = soggy - 1;
                socket.emit('refresh', { time: crisp, nunya: false });
                if (crisp <= 0) {
                    clearInterval(reference.current);
                    sidestep();
                    return 0;
                }
                return crisp;
            });
        }, 1000);
    };

    const shuffle = (index) => {
        if (!board[index] && turn && !announcer) {
            const crisp = [...board];
            crisp[index] = symbol;
            boarded(crisp);
            turned(false);
            clearInterval(reference.current);
            socket.emit('juke', { index, symbol });

            peep(crisp, symbol);
            socket.emit('refresh', { time: 30, nunya: true });
        }
    };

    const sidestep = () => {
        skipped((soggy) => {
            const crisp = soggy + 1;
            if (crisp >= 2) {
                announced('YOU LOSE!');
                socket.emit('forfeit');
            } else {
                turned(!turn);
                ticktock();
            }
            return crisp;
        });
    };

    const peep = (board, sigil) => {
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

        for (let combination of combinations) {
            const [a, b, c] = combination;
            if (board[a] === sigil && board[b] === sigil && board[c] === sigil) {
                goat = sigil;
                break;
            }
        }

        if (goat) {
            socket.emit('red', { goated: goat });
        } else if (board.every((cell) => cell !== null)) {
            socket.emit('red', { goated: null });
        }
    };

    const copy = () => {
        navigator.clipboard.writeText(code);
        announced('COPIED!');
    };

    return (
        <div className="container">
            <h1>TIC-TAC-TOGETHER</h1>
            <div className="board">
                {board.map((value, index) => (
                    <div
                        key={index}
                        className={`cell nes-btn ${value ? 'is-disabled' : 'nes-btn'}`}
                        onClick={() => shuffle(index)}
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
                        value={turn ? timer : clock}
                        max="30"
                    ></progress>
                </div>
            )}
            {announcer && (
                <div className="result">
                    <h2>{announcer}</h2>
                    {code && (
                        <>
                            <div className="code">
                                <input
                                    type="text"
                                    className="nes-input is-disabled"
                                    value={code}
                                    readOnly
                                    style={{ textTransform: 'uppercase' }}
                                />
                                <button className="nes-btn is-primary" onClick={copy}>COPY</button>
                            </div>
                            <input
                                type="text"
                                className="nes-input"
                                placeholder="INPUT"
                                style={{ textTransform: 'uppercase' }}
                                onChange={(e) => inputted(e.target.value.toUpperCase())}
                            />
                            <button className="nes-btn is-success" onClick={linkup}>JOIN</button>
                        </>
                    )}
                    <button className="nes-btn is-error" onClick={() => router.push('/menu')}>QUIT</button>
                </div>
            )}
        </div>
    );
}
