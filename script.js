
const Gameboard = (() => {

  let boardSize = "150px";
  let gameboard = [["X","O","X"],["O","O","X"],["X","X","O"]];
  gameboard = [["","",""],["","",""],["","",""]];

  const _editBoard = (tile, row, col) => {
    let mark = Gameflow.playRound();
    tile.textContent = mark;
    gameboard[row][col] = mark;
    Gameflow.checkTiles(gameboard, row, col);
  };

  const renderBoard = () => {

    const gameGrid = document.getElementById("game-grid");
    gameGrid.style.gridTemplateColumns = `repeat(3, ${boardSize})`;
    gameGrid.style.gridTemplateRows = `repeat(3, ${boardSize})`;

    for (let row = 1; row < 4; row++){
      for (let col = 1; col < 4; col++){
        const gameTile = document.createElement("button");
        gameTile.id = `tile-${row}-${col}`;
        gameTile.classList.add("game-tile");
        gameTile.textContent = gameboard[row-1][col-1];
        gameTile.addEventListener("click", (e) => {

          let targetTile = e.target;
          if (targetTile.textContent === ""){
            _editBoard(targetTile, row-1, col-1)
          } 

        });  
        gameGrid.appendChild(gameTile)
      }
    }
  };


  return {
    renderBoard,
    boardSize,
  };

})();

const Player = (number, mark) => {
  return {
    number,
    mark
  }
}

const player1 = Player(1,"X");
const player2 = Player(2,"O");

const Gameflow = (() => {

  const startGameButton = document.getElementById("start-game");
  let turn = true;
  let mark = player1.mark;

  const playRound = () => {
    if (turn) {
      mark = player1.mark;
      turn = false;
    }
    else {
      mark = player2.mark;
      turn = true;
    }
    return mark
  }

  // const checkTiles = (board, row, col) => {
  //   for(let x = -1; x <= 1; x++){
  //     for(let y = -1; y <= 1; y++)

  //   }
  // };


  const startGame = () => {
    Gameboard.renderBoard();
  };

  return {
    startGame,
    playRound,
    checkTiles
  };

})();

Gameflow.startGame();