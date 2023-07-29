const restartGameButton = document.getElementById("start-game");

const Gameboard = (() => {

  let boardSize = "150px";
  let gameboard = [["","",""],["","",""],["","",""]];
  let placedTiles = 0;
  const gameGrid = document.getElementById("game-grid");

  const _editBoard = (tile, row, col) => {
    if (tile.textContent === "") {
      let mark = Gameflow.playRound();
      tile.textContent = mark;
      gameboard[row][col] = mark;
      placedTiles++;
      Gameflow.checkTiles(gameboard, row, col, placedTiles);
    }
  };

  const renderBoard = (gameRunning) => {

    gameGrid.innerHTML = "";
    gameGrid.style.gridTemplateColumns = `repeat(3, min(30vw,${boardSize}))`;
    gameGrid.style.gridTemplateRows = `repeat(3, min(30vw,${boardSize}))`;
    
    for (let row = 1; row < 4; row++){
      for (let col = 1; col < 4; col++){
        const gameTile = document.createElement("button");
        gameTile.id = `tile-${row}-${col}`;
        gameTile.classList.add("game-tile");
        gameTile.textContent = gameboard[row-1][col-1];
        gameTile.addEventListener("click", (e) => _editBoard(e.target, row-1, col-1));
        gameGrid.appendChild(gameTile)
      }
    }
    if(!gameRunning || (gameRunning && placedTiles > 0)){
      _clearBoard()
    }
  };

  const _clearBoard = () => {
    Array.from(gameGrid.childNodes).forEach((tile)=> {
      tile.setAttribute("disabled", "");
      placedTiles = 0;
      gameboard = [["","",""],["","",""],["","",""]];
    })
  }

  return {
    renderBoard,
    boardSize,
  };

})();

const Player = (name, mark) => {
  return {
    name,
    mark
  }
}


const player1 = Player(1,"X");
const player2 = Player(2,"O");

const Gameflow = (() => {

  let turn = true;
  let activePlayer = player1;
  let nextPlayer = player2;
  const turnDisplay = document.getElementById("turn-display");

  const playRound = () => {
    if (turn) {
      activePlayer = player1;
      nextPlayer = player2;
      turn = false;
    }
    else {
      activePlayer = player2;
      nextPlayer = player1;
      turn = true;
    }
    return activePlayer.mark
  }

  const _updateTurn = (player) => {
    turnDisplay.textContent = `${player.name}'s turn (${player.mark})`;
  }

  const _gameOver = (display) => {
    turnDisplay.textContent = display;
    Gameboard.renderBoard(false);
  }

  const checkTiles = (board, markedRow, markedCol, placedTiles) => {

    let winningPattern = [activePlayer.mark, activePlayer.mark, activePlayer.mark];
    let patterns = [board[markedRow], [board[0][markedCol], board[1][markedCol], board[2][markedCol]], [board[0][0], board[1][1], board[2][2]], [board[0][2], board[1][1], board[2][0]]];

    let patternExists = patterns.some(pattern => {
        
      let i = 0;
      let patternDetected = true;

      pattern.forEach(tile => {
        if (tile !== winningPattern[i]){
          patternDetected = false;
          return
        }
      });
      return patternDetected
    });

    // all tiles are occupied with no winner
    if(patternExists){
      _gameOver(`${activePlayer.name} wins`);

    }
    else {
      // tie
      if (placedTiles == 9) {
        _gameOver("Tie");
      }
      // continue
      else {
        _updateTurn(nextPlayer);
      }
      
    }
  };


  const startGame = () => {
    _getPlayerNames();
    _randomizeTurn();
    _updateTurn(activePlayer);
    Gameboard.renderBoard(true);
    restartGameButton.textContent = "RESTART";
  };

  const _randomizeTurn = () => {
    const randomizer = Math.round(Math.random() * 101);
    turn =  randomizer > 50 ? true: false;
    activePlayer = randomizer > 50 ? player1: player2;
    nextPlayer = randomizer > 50 ? player2: player1;
  }

  const _getPlayerNames = () => {
    const player1Name = document.getElementById("player-one").value;
    const player2Name = document.getElementById("player-two").value;
    player1.name = player1Name != "" ? player1Name: player1.name;
    player2.name = player2Name != "" ? player2Name: player2.name;
  }

  return {
    startGame,
    playRound,
    checkTiles
  };

})();


restartGameButton.addEventListener("click", Gameflow.startGame)

window.onload = () => {
  Gameboard.renderBoard(false);
}