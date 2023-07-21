const open = document.querySelector('button');
const dialog = document.querySelector('dialog');
const submit = document.querySelector('[type="submit"]');
const p1 = document.querySelector('#p1');
const p2 = document.querySelector('#p2');
open.addEventListener('click', () => {
  dialog.showModal();
});
submit.addEventListener('click', (e) => {
  e.preventDefault();
  if (!p1.value || !p2.value) return;
  dialog.close();
  game = GameController(p1.value, p2.value);
});
let game;
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
        board[i][j].markSpot(0);
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
function GameController(playerOneName, playerTwoName) {
  const board = Gameboard();
  function createPlayer(playerName, playerMark) {
    const name = playerName;
    const mark = playerMark;
    let score = 0;
    const getName = () => name;
    const getScore = () => score;
    const getMark = () => mark;
    const won = () => ++score;
    return { getName, won, getScore, getMark };
  }
  const players = [
    createPlayer(playerOneName, 1),
    createPlayer(playerTwoName, 2),
  ];
  let activePlayer = players[0];
  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;
  const printNewRound = () => {
    board.printBoard();
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

  const rematch = () => {
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
    const markSuccess = board.markSpot(
      row,
      column,
      getActivePlayer().getMark()
    );
    // run your check winner function here
    switchPlayerTurn();
    printNewRound();
  };
  printNewRound();
  return {
    playRound,
    getActivePlayer,
    rematch,
  };
}
