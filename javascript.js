function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }
  const gameReset = () => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        board[i][j].addMark(0);
      }
    }
  };
  const getBoard = () => board;
  const markSpot = (row, column, player) => {
    if (board[row][column].getValue() !== 0) {
      return false; // cell is already marked
    }
    board[row][column].addMark(player);
    return true; // successful mark
  };
  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithCellValues);
  };
  return { getBoard, markSpot, printBoard, gameReset };
}

// Cell factory function
function Cell() {
  let value = 0;
  const addMark = (player) => {
    value = player;
  };
  const getValue = () => value;
  return {
    addMark,
    getValue,
  };
}

// Game controller function
function GameController(
  playerOneName = 'Player One',
  playerTwoName = 'Player Two'
) {
  const board = Gameboard();
  const players = [
    {
      name: playerOneName,
      token: 1,
      score: 0,
    },
    {
      name: playerTwoName,
      token: 2,
      score: 0,
    },
  ];
  let activePlayer = players[0];
  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;
  const printNewRound = () => {
    board.printBoard();
    if ((!checkWinner() && !isVacant()) || checkWinner()) {
      return;
    }
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const checkWinner = () => {
    let winner = false;
    // Horizontal check
    for (let i = 0; i < 3; i++) {
      if (board.getBoard()[i][0].getValue() !== 0) {
        if (
          board.getBoard()[i][0].getValue() ===
            board.getBoard()[i][1].getValue() &&
          board.getBoard()[i][0].getValue() ===
            board.getBoard()[i][2].getValue()
        )
          winner = board.getBoard()[i][0].getValue();
      }
    }
    // Vertical check
    for (let i = 0; i < 3; i++) {
      if (board.getBoard()[0][i].getValue() !== 0) {
        if (
          board.getBoard()[0][i].getValue() ===
            board.getBoard()[1][i].getValue() &&
          board.getBoard()[0][i].getValue() ===
            board.getBoard()[2][i].getValue()
        )
          winner = board.getBoard()[0][i].getValue();
      }
    }
    // Diagonal check
    if (board.getBoard()[0][0].getValue() !== 0) {
      if (
        board.getBoard()[0][0].getValue() ===
          board.getBoard()[1][1].getValue() &&
        board.getBoard()[0][0].getValue() === board.getBoard()[2][2].getValue()
      )
        winner = board.getBoard()[0][0].getValue();
    }
    if (board.getBoard()[2][0].getValue() !== 0) {
      if (
        board.getBoard()[2][0].getValue() ===
          board.getBoard()[1][1].getValue() &&
        board.getBoard()[2][0].getValue() === board.getBoard()[0][2].getValue()
      )
        winner = board.getBoard()[2][0].getValue();
    }
    return winner;
  };

  const isVacant = () => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board.getBoard()[i][j].getValue() === 0) {
          return true;
        }
      }
    }
    return false;
  };

  const reset = () => {
    board.gameReset();
    printNewRound();
  };

  const isGameover = () => {
    const winner = checkWinner();
    if (winner) {
      console.log(`${players[winner - 1].name} won the game!`);
      return true;
    }
    if (!winner && !isVacant()) {
      console.log("It's a Tie");
      return true;
    }
    return false;
  };

  const playRound = (row, column) => {
    if (isGameover()) {
      console.log('Gameover!');
      return;
    }
    const markSuccess = board.markSpot(row, column, getActivePlayer().token);
    // run your check winner function here
    const gameOver = isGameover();
    if (markSuccess && !gameOver) {
      switchPlayerTurn();
    }
    printNewRound();
  };

  printNewRound();
  return {
    playRound,
    getActivePlayer,
    reset,
  };
}

const game = GameController();
