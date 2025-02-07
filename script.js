function GameBoard() {
  const playBoard = [];
  const rows = 3;
  const columns = 3;

  const resetBoard = () => {
    for (let i = 0; i < rows; i++) {
      playBoard[i] = [];
      for (let j = 0; j < columns; j++) {
        playBoard[i].push(" ");
      }
    }
  };

  return { playBoard, resetBoard };
}

function GamePlayers() {
  const makePlayer = (symbol) => {
    return { name: `Player ${symbol}`, token: `${symbol}` };
  };
  const test = function () {};

  return { makePlayer, test };
}

function GameController() {
  const board = GameBoard();
  const players = GamePlayers();
  let result = false;
  let winner = false;

  const playerArr = [players.makePlayer("X"), players.makePlayer("O")];
  let activePlayer = playerArr[0];
  const getActivePlayer = () => {
    return activePlayer;
  };
  const switchActivePlayer = () => {
    activePlayer === playerArr[0] ? (activePlayer = playerArr[1]) : (activePlayer = playerArr[0]);
  };

  const startRound = () => {
    console.log(board.playBoard);
    console.log(`It\'s ${getActivePlayer().name}\'s turn.`);
  };
  const playRound = (row, column) => {
    if (winner) return console.log(`${getActivePlayer().name} has already won!`);
    if (board.playBoard[row - 1][column - 1] !== " ") {
      return console.log("Invalid square! Try again.");
    }
    board.playBoard[row - 1].splice(column - 1, 1, getActivePlayer().token);

    console.log(`Placing ${activePlayer === playerArr[0] ? "Cross" : "Nought"}...`);
    checkWinner();
  };
  const endRound = () => {
    switchActivePlayer();
    startRound();
  };
  const checkRow = () => {
    for (let arr of combinedArr) {
      if (arr.every((square) => square === arr[0]) && arr[0] !== " ") {
        result = true;
      }
    }
  };
  const combinedArr = [];
  const colIndex = [1, 4, 7, 2, 5, 8, 3, 6, 9];
  const diagIndex = [1, 5, 9, 3, 5, 7];

  const getFlatBoard = () => {
    return board.playBoard.flat();
  };
  const sortArr = (arr, n) => {
    const colArr = arr.map((index) => getFlatBoard()[index - 1]);
    for (let l = 0; l < colArr.length; l += n) {
      combinedArr.push(colArr.slice(l, l + n));
    }
  };

  const checkWinner = () => {
    combinedArr.length = 0;
    combinedArr.push(...board.playBoard);
    sortArr(colIndex, 3);
    sortArr(diagIndex, 3);
    checkRow();

    if (result) {
      endGame();
    } else endRound();
  };
  const endGame = () => {
    console.log(`We have a winner! ${getActivePlayer().name} wins!`);
    console.log(board.playBoard);
    console.log("Would you like to play again?");
    winner = true;
  };
  const newGame = () => {
    result = false;
    winner = false;
    board.resetBoard();
    startRound();
  };
  board.resetBoard();
  startRound();
  return { playRound, getActivePlayer, newGame };
}
const game = GameController();
