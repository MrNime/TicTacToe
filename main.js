var origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const cells = document.querySelectorAll('.cell');
startGame();

function startGame() {
    document.querySelector(".endgame").style.display = "none";
    //create array from 0 to 8
    origBoard = Array.from(Array(9).keys());
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = "";
        cells[i].style.removeProperty("background-color");
        //boolean captures event in bubbling phase (standard is false)
        cells[i].addEventListener("click", turnClick, false);
    }
}

function turnClick(e) {
    turn(e.target.id, huPlayer)
}

function turn(squareId, player) {
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(origBoard, player);
    if (gameWon) {
        gameOver(gameWon)
    }
}

function checkWin(board, player) {
    //only take indexes the player has played in
    let plays = board.reduce((acc, curr, idx) =>
        (curr === player) ? acc.concat(idx) : acc, [])
    let gameWon = null;
    // .entries() like python enumerate, index and array element
    for (let [index, win] of winCombos.entries()) {
        //if player played in every cell of a win-combo
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = {index: index, player: player};
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon) {
    for (let index of winCombos[gameWon.index]) {
        document.getElementById(index).style.backgroundColor =
                gameWon.player == huPlayer ? "blue" : "red";
    }
    for (let i = 0; i < cells.length; i++) {
        cells[i].removeEventListener("click", turnClick, false);
    }
}
