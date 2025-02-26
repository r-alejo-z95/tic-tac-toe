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

  const reset = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = "";
    }
  };

  return { getBoard, makeMove, reset };
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
      const winningPattern = checkWin();
      if (winningPattern) {
        DisplayController.updateMessage(`${currentPlayer.name} wins!`);
        DisplayController.highlightWinningCells(winningPattern);
        DisplayController.disableBoard();
        DisplayController.showRestartButton();
        return;
      }
      if (checkTie()) {
        DisplayController.updateMessage("It's a tie!");
        DisplayController.disableBoard();
        DisplayController.showRestartButton();
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

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return pattern;
      }
    }
    return null;
  };

  const checkTie = () => {
    return Gameboard.getBoard().every((cell) => cell !== "");
  };

  return { playRound };
})();

// Display Controller module
const DisplayController = (function () {
  const cells = document.querySelectorAll(".cell");

  const messageContainer = document.createElement("div");
  messageContainer.id = "message-cont";
  document.body.appendChild(messageContainer);

  const messageElement = document.createElement("div");
  messageElement.id = "message";
  messageElement.textContent = "Click on a cell to start";
  messageContainer.appendChild(messageElement);

  const restartBtn = document.createElement("button");
  restartBtn.id = "restart-btn";
  restartBtn.textContent = "⟳";

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

  const disableBoard = () => {
    cells.forEach((cell) => {
      cell.style.pointerEvents = "none";
    });
  };

  const highlightWinningCells = (pattern) => {
    pattern.forEach((index) => {
      cells[index].style.backgroundColor = "#2e8b57";
    });
  };

  const updateMessage = (message) => {
    messageElement.textContent = message;
  };

  const showRestartButton = () => {
    messageContainer.appendChild(restartBtn);
    restartBtn.addEventListener("click", () => {
      Gameboard.reset();
      updateBoard();
      updateMessage("Click on a cell to start");
      cells.forEach((cell) => {
        cell.style.pointerEvents = "auto";
        cell.style.backgroundColor = "#fff";
      });
      hideRestartButton();
    });
  };

  const hideRestartButton = () => {
    if (messageContainer.contains(restartBtn)) {
      messageContainer.removeChild(restartBtn);
    }
  };

  return {
    updateBoard,
    updateMessage,
    disableBoard,
    highlightWinningCells,
    showRestartButton,
    hideRestartButton,
  };
})();
