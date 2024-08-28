import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

export default function Roboto() {
  const [board, boarded] = useState(Array(9).fill(null));
  const [turn, turned] = useState(true);
  const [symbol, symbolized] = useState(null);
  const [compute, computed] = useState(null);
  const [announcer, announced] = useState(null);
  const [username, usernamed] = useState('');
  const [timer, timed] = useState(30); // 30 Seconds PER Turn
  const [skip, skipped] = useState(0); // Track Skipped Turn(s)
  const [difficulty, difficulted] = useState(null); // Track Difficulty Level

  const router = useRouter();
  const refernece = useRef(null); // Timer Reference

  useEffect(() => {
    const saved = localStorage.getItem('username');
    if (saved) {
      usernamed(saved);
    }
  }, []);

  useEffect(() => {
    if (!turn && !announcer && difficulty) {
      setTimeout(() => {
        if (difficulty === 'EASY') {
          easy();
        } else if (difficulty === 'HARD') {
          hard();
        }
      }, 2500); // Simulate Thinking
    }
  }, [turn, announcer, difficulty]);

  useEffect(() => {
    if (!announcer && difficulty) {
      timeroo();
    }
    return () => clearInterval(refernece.current);
  }, [turn, announcer, difficulty]);

  // Start Game
  const kickoff = () => {
    const innit = Math.random() < 0.5;
    symbolized(innit ? 'X' : 'O'); // User's Symbol
    computed(innit ? 'O' : 'X'); // Computer's Symbol
    turned(innit); // SET Initial Turn
    boarded(Array(9).fill(null));
    announced(null);
    timed(30); // Reset Timer
    skipped(0); // Reset Skips
    clearInterval(refernece.current); // Clear ANY Existing Timer(s)
    timeroo(); // Start AFTER Difficulty 
  };

  // Timer
  const timeroo = () => {
    clearInterval(refernece.current);
    timed(30); // Start w/ 30 Seconds
    refernece.current = setInterval(() => {
      timed((idk) => {
        if (idk <= 1) {
          clearInterval(refernece.current);
          skipperoo();
          return 0;
        }
        return idk - 1;
      });
    }, 1000);
  };

  // Player's Move
  const player = (index) => {
    if (!board[index] && !announcer && turn) {
      clearInterval(refernece.current); // Stop Timer WHEN User Picks
      const crisp = [...board];
      crisp[index] = symbol;
      boarded(crisp);
      peep(crisp, symbol); // Check IF Win
      turned(false);
      timed(30); // Reset Timer FOR Roboto
    }
  };

  // EASY Computer's Move
  const easy = () => {
    const openings = board
      .map((val, idx) => (val === null ? idx : null))
      .filter((val) => val !== null);
    if (openings.length === 0 || announcer) return;

    const fluke = openings[Math.floor(Math.random() * openings.length)];
    const crisp = [...board];
    crisp[fluke] = compute;
    boarded(crisp);
    peep(crisp, compute);
    turned(true);
    timed(30); // Reset Timer FOR User
  };

  // HARD Computer's Move
  const hard = () => {
    // Find BEST Move
    const best = bested(board, compute, symbol);
    if (best === null || announcer) return;

    const crisp = [...board];
    crisp[best] = compute;
    boarded(crisp);
    peep(crisp, compute);
    turned(true);
    timed(30); // Reset Timer FOR User
  };

  const bested = (board, bot, gamer) => {
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

    // First, Check IF CAN Win
    for (let combination of combinations) {
      const [a, b, c] = combination;
      if (board[a] === bot && board[b] === bot && !board[c]) return c;
      if (board[a] === bot && !board[b] && board[c] === bot) return b;
      if (!board[a] && board[b] === bot && board[c] === bot) return a;
    }

    // Block Player's Win
    for (let combination of combinations) {
      const [a, b, c] = combination;
      if (board[a] === gamer && board[b] === gamer && !board[c]) return c;
      if (board[a] === gamer && !board[b] && board[c] === gamer) return b;
      if (!board[a] && board[b] === gamer && board[c] === gamer) return a;
    }

    // Set UP Win
    for (let combination of combinations) {
      const [a, b, c] = combination;
      if (board[a] === bot && !board[b] && board[c] === null) return b;
      if (board[b] === bot && !board[a] && board[c] === null) return a;
      if (board[c] === bot && !board[b] && board[a] === null) return b;
    }

    // Otherwise, Pick FIRST Available Move
    const openings = board
      .map((val, idx) => (val === null ? idx : null))
      .filter((val) => val !== null);
    return openings[Math.floor(Math.random() * openings.length)];
  };

  const skipperoo = () => {
    skipped((previously) => {
      const nifty = previously + 1;
      if (nifty >= 2) {
        announced(turn ? 'YOU LOSE!' : 'YOU WIN!'); // Two Skips = Loss
      } else {
        turned(!turn);
        timeroo(); // Restart Timer FOR Next Turn
      }
      return nifty;
    });
  };

  const peep = (crisp, dialed) => {
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

    for (let combination of combinations) {
      const [a, b, c] = combination;
      if (crisp[a] === dialed && crisp[b] === dialed && crisp[c] === dialed) {
        announced(dialed === symbol ? 'YOU WIN!' : 'YOU LOSE!');
        clearInterval(refernece.current); // Stop Timer IF Win
        return;
      }
    }

    if (crisp.every((cell) => cell !== null)) {
      announced('DRAW!');
      clearInterval(refernece.current); // Stop Timer IF Draw
    }
  };

  const reboot = () => {
    kickoff();
  };

  const difficult = (level) => {
    difficulted(level);
    kickoff();
  };

  return (
    <div className="container">
      <h1>TIC-TAC-TOGETHER</h1>
      {!difficulty && ( // ASK Difficulty BEFORE Game
        <div className="difficulty">
          <h2>DIFFICULTY:</h2>
          <div className='knobhead'>
            <button className="nes-btn is-primary" onClick={() => difficult('EASY')}>
              EASY
            </button>
            <button className="nes-btn is-error" onClick={() => difficult('HARD')}>
              HARD
            </button>
          </div>
        </div>
      )}
      {difficulty && (
        <>
          <div className="board">
            {board.map((value, index) => (
              <div
                key={index}
                className={`cell nes-btn ${value ? 'is-disabled' : 'nes-btn'}`}
                onClick={() => player(index)}
              >
                {value}
              </div>
            ))}
          </div>
          {!announcer && ( // ONLY Show IF NO Bruce Buffer
            <div className="informant">
              <h3>{turn ? `${username}'S TURN: ${symbol}` : `ROBOTO'S TURN: ${compute}`}</h3>
              <progress
                className={`nes-progress ${turn ? 'is-success' : 'is-error'}`}
                value={timer}
                max="30"
              ></progress>
            </div>
          )}
          {announcer && (
            <div className="result">
              <h2>{announcer}</h2>
              <button className="nes-btn is-success" onClick={reboot}>
                AGAIN
              </button>
              <button className="nes-btn is-error" onClick={() => router.push('/menu')}>
                LEAVE
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
