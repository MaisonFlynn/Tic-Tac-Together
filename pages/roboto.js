import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

export default function Roboto() {
  const [board, boarded] = useState(Array(9).fill(null));
  const [turn, turned] = useState(true);
  const [symbol, symbolized] = useState(null);
  const [compute, computed] = useState(null);
  const [announcer, announced] = useState(null);
  const [username, setUsername] = useState('');
  const [timer, timed] = useState(30); // 30 Seconds PER Turn
  const [skip, skipped] = useState(0); // Track Skipped Turn(s)

  const router = useRouter();
  const refernece = useRef(null); // Timer Reference

  useEffect(() => {
    const saved = localStorage.getItem('username');
    if (saved) {
      setUsername(saved);
    }
    kickoff(); // Start Game
  }, []);

  useEffect(() => {
    if (!turn && !announcer) {
      setTimeout(() => {
        computer();
      }, 2500); // Simulate Thinkin'
    }
  }, [turn, announcer]);

  useEffect(() => {
    if (!announcer) {
      timeroo();
    }
    return () => clearInterval(refernece.current);
  }, [turn, announcer]);

  // Start Game
  const kickoff = () => {
    const innit = Math.random() < 0.5;
    symbolized(innit ? 'X' : 'O'); // User's Symbol
    computed(innit ? 'O' : 'X'); // Computer's Symbol
    turned(innit); // SET Initial TUrn
    boarded(Array(9).fill(null));
    announced(null);
    timed(30); // Reset Timer
    skipped(0); // Reset Skips
    clearInterval(refernece.current); // Clear ANY Existing Timer(s)
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

  // Computer's Move
  const computer = () => {
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

  const skipperoo = () => {
    skipped((prevSkips) => {
      const nifty = prevSkips + 1;
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

  return (
    <div className="container">
      <h1>TIC-TAC-TOGETHER</h1>
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
      <div className="informant">
        <h3>{turn ? `${username}'S TURN: ${symbol}` : `ROBOTO'S TURN: ${compute}`}</h3>
        <progress
          className={`nes-progress ${turn ? 'is-success' : 'is-error'}`}
          value={timer}
          max="30"
        ></progress>
      </div>
      {announcer && (
        <div className="result">
          <h2>{announcer}</h2>
          {announcer === 'YOU WIN!' && <i className="nes-icon trophy size"></i>}
          <button className="nes-btn is-success" onClick={reboot}>AGAIN</button>
          <button className="nes-btn is-error" onClick={() => router.push('/menu')}>LEAVE</button>
        </div>
      )}
    </div>
  );
}
