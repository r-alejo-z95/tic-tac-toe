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
        DisplayController.updateMessage(`${currentPlayer.name} wins!`);
        return;
      }
      if (checkTie()) {
        DisplayController.updateMessage("It's a tie!");
        return;
      }
      switchPlayer();
      DisplayController.updateMessage(`${currentPlayer.name}'s turn`);
    }
  };

  const checkWin = () => {
    const board = Gameboard.getBoard();
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

// Display Controller module
const DisplayController = (function () {
  const cells = document.querySelectorAll(".cell");
  const messageElement = document.createElement("div");
  messageElement.id = "message";
  messageElement.textContent = "Click on a cell to start";
  document.body.appendChild(messageElement);

  cells.forEach((cell) => {
    cell.addEventListener("click", (e) => {
      const index = e.target.dataset.index;
      Game.playRound(index);
      updateBoard();
    });
  });

  const updateBoard = () => {
    const board = Gameboard.getBoard();
    cells.forEach((cell, index) => {
      cell.textContent = board[index];
      cell.classList.remove("X", "O");
      if (board[index]) {
        cell.classList.add(board[index]);
      }
    });
  };

  const updateMessage = (message) => {
    messageElement.textContent = message;
  };

  return { updateBoard, updateMessage };
})();

// Example usage in the console
// Game.playRound(0); Player 1 makes a move at index 0
// Game.playRound(1); Player 2 makes a move at index 1
// Continue playing rounds...
