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

  const playerArr = [makePlayer("X"), makePlayer("O")];
  let activePlayer = playerArr[0];

  const setPlayerName = (name, index) => {
    return (playerArr[index].name = name);
  };

  const setActivePlayer = (player) => {
    return (activePlayer = playerArr[player]);
  };

  const getActivePlayer = () => {
    return activePlayer;
  };
  const switchActivePlayer = () => {
    activePlayer === playerArr[0] ? (activePlayer = playerArr[1]) : (activePlayer = playerArr[0]);
    return activePlayer;
  };

  return {
    makePlayer,
    playerArr,
    activePlayer,
    getActivePlayer,
    switchActivePlayer,
    setActivePlayer,
    setPlayerName,
  };
}

function GameController() {
  const board = GameBoard();
  const players = GamePlayers();
  let result = false;
  let winner = false;
  let draw = false;

  const getTurn = () => {
    return players.getActivePlayer();
  };
  const getPlayers = () => {
    return players.playerArr;
  };
  const setName = (name, index) => {
    players.setPlayerName(name, index);
  };

  const startRound = () => {
    console.log(board.playBoard);
    console.log(`It\'s ${players.getActivePlayer().name}\'s turn.`);
  };
  const playRound = (row, column) => {
    if (winner) {
      return console.log(`${players.getActivePlayer().name} has already won!`);
    }
    if (board.playBoard[row - 1][column - 1] !== " ") {
      return console.log("Invalid square! Try again.");
    }
    board.playBoard[row - 1].splice(column - 1, 1, players.getActivePlayer().token);

    console.log(`Placing ${players.activePlayer === players.playerArr[0] ? "Cross" : "Nought"}...`);
    checkWinner();
  };
  const endRound = () => {
    players.switchActivePlayer();
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
  const getWinner = () => {
    return winner;
  };
  const getDraw = () => {
    return draw;
  };
  const sortArr = (arr, n) => {
    const colArr = arr.map((index) => getFlatBoard()[index - 1]);
    for (let l = 0; l < colArr.length; l += n) {
      combinedArr.push(colArr.slice(l, l + n));
    }
  };

  const checkWinner = () => {
    if (!getFlatBoard().includes(" ")) {
      console.log("We have a draw!");
      draw = true;
    }
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
    console.log(`We have a winner! ${players.getActivePlayer().name} wins!`);
    console.log(board.playBoard);
    console.log("Would you like to play again?");
    winner = true;
  };
  const newGame = () => {
    result = false;
    winner = false;
    draw = false;
    board.resetBoard();
    players.setActivePlayer(0);
    startRound();
  };
  board.resetBoard();
  startRound();
  return { playRound, newGame, getTurn, getFlatBoard, getWinner, getPlayers, setName, getDraw };
}

function DOMController() {
  const game = GameController();
  const dialog = document.querySelector("dialog");
  const curPlayer = document.querySelector(".current-player");
  let target;
  let gameActive;
  const toggleHidden = () => {
    const input = document.querySelectorAll("input");
    const restartBtn = document.querySelector(".restart");
    gameActive ? restartBtn.classList.remove("hidden") : restartBtn.classList.add("hidden");
    gameActive
      ? input.forEach((el) => el.classList.add("hidden"))
      : input.forEach((el) => el.classList.remove("hidden"));
  };
  const updateBoard = () => {
    for (let k = 1; k <= game.getFlatBoard().length; k++) {
      const selectSquare = document.querySelector(`.square:nth-child(${k})`);
      selectSquare.textContent = game.getFlatBoard()[k - 1];
    }
  };
  const updateHeader = () => {
    const player1 = document.querySelector(".player-1");
    const player2 = document.querySelector(".player-2");
    player1.textContent = `X : ${game.getPlayers()[0].name}`;
    player2.textContent = `O : ${game.getPlayers()[1].name}`;
    curPlayer.textContent = `It\'s ${game.getTurn().name}\'s turn.`;
  };

  const updateNames = () => {
    const input = document.querySelectorAll(".input");
    input.forEach((input) =>
      input.addEventListener("keypress", function (e) {
        if (e.key === "Enter" && !gameActive) {
          game.setName(e.target.value, e.target.dataset.player);
          e.target.value = "";
          updateHeader();
        }
      })
    );
  };

  const listenBoard = (player) => {
    const square = document.querySelectorAll(".square");
    square.forEach((square) =>
      square.addEventListener("click", function (e) {
        target = e.target;
        game.playRound(target.dataset.row, target.dataset.column);
        gameActive = true;
        updateBoard();
        updateHeader();
        updateDialog();
        toggleHidden();
      })
    );
  };
  const updateDialog = () => {
    const result = document.querySelector(".result");
    const winner = document.querySelector(".winner");
    if (game.getWinner() || game.getDraw()) {
      dialog.show();
      curPlayer.textContent = "";
      result.textContent = `We have a ${game.getWinner() ? "Winner!" : "Draw!"}`;
      winner.textContent = `${game.getWinner() ? ` ${game.getTurn().name} wins!` : ""}`;
    }
  };
  const playAgain = () => {
    const newButton = document.querySelectorAll(".new-game");
    newButton.forEach((btn) =>
      btn.addEventListener("click", function (e) {
        dialog.close();
        gameActive = false;
        game.newGame();
        updateBoard();
        updateHeader();
        toggleHidden();
      })
    );
  };

  updateBoard();
  updateHeader();
  listenBoard(game.getTurn());
  playAgain();
  updateNames();
}
DOMController();
