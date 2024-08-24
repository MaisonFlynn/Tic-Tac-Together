import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Roboto() {
  const [board, boarded] = useState(Array(9).fill(null));
  const [turn, turned] = useState(true);
  const [symbol, symbolized] = useState(null);
  const [computer, computerized] = useState(null);
  const [announcer, announced] = useState(null);
  const [username, usernamed] = useState('');

  const router = useRouter();

  useEffect(() => {
    // GET Username FROM Local Storage
    const yoink = localStorage.getItem('username');
    if (yoink) {
      usernamed(yoink);
    }
    innit(); // Start Game
  }, []);

  useEffect(() => {
    if (!turn && !announcer) {
      setTimeout(compute, 500); // Delay TO Simulate Thonkin'
    }
  }, [turn, announcer]);

  // Start Game
  const innit = () => {
    const pluck = Math.random() < 0.5; 
    symbolized(pluck ? 'X' : 'O'); // User's Symbol
    computerized(pluck ? 'O' : 'X'); // Computer's Symbol
    turned(pluck); // Turn
    boarded(Array(9).fill(null));
    announced(null);
  };

  const maneuver = (index) => {
    if (!board[index] && !announcer && turn) {
      const crisp = [...board];
      crisp[index] = symbol;
      boarded(crisp);
      peep(crisp, symbol); // Check IF Win
      turned(false);
    }
  };

  // Check FOR Available Cell(s)
  const compute = () => {
    const free = board
      .map((val, idx) => (val === null ? idx : null))
      .filter((val) => val !== null);
    if (free.length === 0 || announcer) return;

    const haphazard = free[Math.floor(Math.random() * free.length)];
    const crisp = [...board];
    crisp[haphazard] = computer;
    boarded(crisp);
    peep(crisp, computer);
    turned(true);
  };

  // Check IF Win
  const peep = (crisp, active) => {
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
      if (crisp[a] === active && crisp[b] === active && crisp[c] === active) {
        if (active === symbol) {
          announced('YOU WIN!');
        } else {
          announced('YOU LOSE!');
        }
        return;
      }
    }

    if (crisp.every((cell) => cell !== null)) {
      announced('DRAW!');
    }
  };

  const restart = () => {
    innit();
  };

  return (
    <div className="container">
      <h1>{username}'S {symbol}</h1>
      <div className="board">
        {board.map((value, index) => (
          <div
            key={index}
            className={`cell nes-btn ${value ? 'is-disabled' : 'nes-btn'}`}
            onClick={() => maneuver(index)}
          >
            {value}
          </div>
        ))}
      </div>
      {announcer && (
        <div className="result">
          {announcer === 'DRAW!' ? (
            <h2>DRAW!</h2>
          ) : (
            <h2>
              {announcer}
              {announcer === 'YOU WIN!' && <i className="nes-icon trophy size"></i>}
            </h2>
          )}
          <button className="nes-btn is-success" onClick={restart}>AGAIN</button>
          <button className="nes-btn is-error" onClick={() => router.push('/menu')}>LEAVE</button>
        </div>
      )}
    </div>
  );
}
