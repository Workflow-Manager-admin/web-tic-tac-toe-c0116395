import React, { useState, useEffect } from 'react';
import './App.css';

/**
 * Minimalistic Tic Tac Toe App - 2 Player, Responsive, Light Theme
 * Features: 3x3 board, status, winner/draw, restart, minimal modern style
 */

// The 3x3 grid, with squares numbered 0—8
const initialBoard = () => Array(9).fill(null);

const PLAYER_X = 'X';
const PLAYER_O = 'O';

// PUBLIC_INTERFACE
function App() {
  // State: board (array of 9), true for X's turn, null for winner, false for draw
  const [board, setBoard] = useState(initialBoard());
  const [isXTurn, setIsXTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  // Animations: for cell highlighting
  const [winLine, setWinLine] = useState([]);

  // Calculate winner/draw after every move
  useEffect(() => {
    const result = calculateWinner(board);
    if (result.winner) {
      setWinner(result.winner);
      setWinLine(result.line);
      setGameOver(true);
    } else if (board.every(cell => cell !== null)) {
      setWinner(null);
      setWinLine([]);
      setGameOver(true);
    } else {
      setWinner(null);
      setWinLine([]);
      setGameOver(false);
    }
  }, [board]);

  // PUBLIC_INTERFACE
  function handleSquareClick(idx) {
    if (board[idx] !== null || gameOver) return; // No move if not empty/ended
    const nextBoard = [...board];
    nextBoard[idx] = isXTurn ? PLAYER_X : PLAYER_O;
    setBoard(nextBoard);
    setIsXTurn((t) => !t);
  }

  // PUBLIC_INTERFACE
  function handleRestart() {
    setBoard(initialBoard());
    setIsXTurn(true);
    setWinner(null);
    setGameOver(false);
    setWinLine([]);
  }

  function getStatusMessage() {
    if (winner) {
      return `Winner: ${winner}`;
    }
    if (gameOver) {
      return "It's a draw!";
    }
    return `Turn: ${isXTurn ? PLAYER_X : PLAYER_O}`;
  }

  return (
    <div className="ttt-app-bg">
      <div className="ttt-container">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <div className="ttt-status" data-status={winner ? 'winner' : gameOver ? 'draw' : 'ongoing'}>
          {getStatusMessage()}
        </div>

        <div className="ttt-board" role="grid" aria-label="Tic Tac Toe Board">
          {board.map((cell, i) => {
            const isWinningCell = winLine.includes(i);
            return (
              <button
                key={i}
                className={`ttt-cell${cell ? ' occupied' : ''}${isWinningCell ? ' ttt-cell-win' : ''}`}
                onClick={() => handleSquareClick(i)}
                disabled={!!cell || !!winner || gameOver}
                aria-label={`Cell ${i+1}: ${cell ? cell : 'empty'}`}
                style={{
                  animation: isWinningCell ? 'ttt-pop 0.25s forwards' : undefined,
                }}
              >
                <span className={`ttt-mark ttt-mark-${cell}`}>
                  {cell}
                </span>
              </button>
            );
          })}
        </div>

        <button
          className="ttt-restart"
          onClick={handleRestart}
          aria-label="Restart game"
        >
          Restart
        </button>
      </div>
      <footer className="ttt-footer">
        {/* minimal footer or credits, if desired */}
      </footer>
    </div>
  );
}

/**
 * Calculates the winner.
 * @param {Array} board The 9-cell board
 * @returns {Object} { winner: 'X' or 'O' or null, line: array of winning indices }
 */
function calculateWinner(board) {
  // All winning combos
  const lines = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // columns
    [0,4,8],[2,4,6]          // diagonals
  ];
  for (let line of lines) {
    const [a,b,c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }
  return { winner: null, line: [] };
}

export default App;
