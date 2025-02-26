// Gameboard module
const Gameboard = (function () {
  const board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const makeMove = (index, marker) => {
    if (board[index] === "") {
      board[index] = marker;
      return true;
    }
    return false;
  };

  return { getBoard, makeMove };
})();

// Player factory
const createPlayer = (name, marker) => {
  return { name, marker };
};

// Game module
const Game = (function () {
  const player1 = createPlayer("Player 1", "X");
  const player2 = createPlayer("Player 2", "O");
  let currentPlayer = player1;

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const playRound = (index) => {
    if (Gameboard.makeMove(index, currentPlayer.marker)) {
      if (checkWin()) {
        console.log(`${currentPlayer.name} wins!`);
        return;
      }
      if (checkTie()) {
        console.log("It's a tie!");
        return;
      }
      switchPlayer();
    }
  };

  const checkWin = () => {
    const board = Gameboard.getBoard();
    console.log(board);
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return winPatterns.some((pattern) => {
      const [a, b, c] = pattern;
      return board[a] && board[a] === board[b] && board[a] === board[c];
    });
  };

  const checkTie = () => {
    return Gameboard.getBoard().every((cell) => cell !== "");
  };

  return { playRound };
})();

// Example usage in the console
// Game.playRound(0); Player 1 makes a move at index 0
// Game.playRound(1); Player 2 makes a move at index 1
// Continue playing rounds...
