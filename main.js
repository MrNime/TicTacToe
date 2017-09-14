var origBoard;
var huPlayer = "X";
var aiPlayer = "O";
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
];

const cells = document.querySelectorAll(".cell > div");
const chooseX = document.querySelector("#playerX");
const chooseO = document.querySelector("#playerO");
chooseX.addEventListener("click", choosePlayer, false);
chooseO.addEventListener("click", choosePlayer, false);
startGame();

function choosePlayer(e) {
    chooseX.classList.remove("active-player");
    chooseO.classList.remove("active-player");
    if (e.target.id == "playerX") {
        huPlayer = "X";
        aiPlayer = "O";
        chooseX.classList.add("active-player");
    } else if (e.target.id == "playerO") {
        huPlayer = "O";
        aiPlayer = "X";
        chooseO.classList.add("active-player");
    }
    startGame();
}

function startGame() {
    document.querySelector(".endgame").style.display = "none";
    //create array from 0 to 8
    origBoard = Array.from(Array(9).keys());
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = "";
        cells[i].parentElement.style.removeProperty("background-color");
        cells[i].classList.remove("O-play");
        cells[i].classList.remove("X-play");
        //boolean captures event in bubbling phase (standard is false)
        cells[i].parentElement.addEventListener("click", turnClick, false);
    }
    if (aiPlayer === "X") {
        turn(4, aiPlayer);
    }
}

function turnClick(e) {
    console.log(e);
    console.log('target:');
    console.log(e.target);
    console.log('currentTarget:');
    console.log(e.currentTarget);
    //e.target is what you click (including children)
    //e.currentTarget is what the even listener is attached to (the parent here)
    if (typeof origBoard[e.currentTarget.children[0].id] == "number") {
        turn(e.currentTarget.children[0].id, huPlayer);
        if (!checkWin(origBoard, huPlayer) && !checkTie()) {
            turn(bestSpot(), aiPlayer);
        }
    }
}

function turn(squareId, player) {
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    document.getElementById(squareId).classList.add(player + "-play");
    let gameWon = checkWin(origBoard, player);
    if (gameWon) {
        gameOver(gameWon);
    }
}

function checkWin(board, player) {
    //only take indexes the player has played in
    let plays = board.reduce((acc, curr, idx) =>
        (curr === player) ? acc.concat(idx) : acc, []);
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
        document.getElementById(index).parentElement.style.backgroundColor =
                "#64d8cb";
    }
    for (let i = 0; i < cells.length; i++) {
        cells[i].parentElement.removeEventListener("click", turnClick, false);
    }
    declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose!");
}

function declareWinner(who) {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
    return origBoard.filter(elem => typeof elem == "number");
}
function bestSpot() {
    return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
    if (emptySquares().length == 0) {
        for (let i = 0; i < cells.length; i++) {
            cells[i].parentElement.style.backgroundColor = "#64d8cb";
            cells[i].parentElement.removeEventListener("click", turnClick, false);
        }
        declareWinner("Tie Game!");
        return true;
    }
    return false;
}

function minimax(newBoard, player) {
    var availSpots = emptySquares(newBoard);

    if (checkWin(newBoard, huPlayer)) {
        return {score: -10};
    } else if (checkWin(newBoard, aiPlayer)) {
        return {score: 10};
    } else if (availSpots.length === 0) {
        return {score: 0};
    }
    var moves = [];
    for (var i = 0; i < availSpots.length; i++) {
        var move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;
        var result;

        if (player == aiPlayer) {
            result = minimax(newBoard, huPlayer);
            move.score = result.score;
        } else {
            result = minimax(newBoard, aiPlayer);
            move.score = result.score;
        }
        //reset newboard to state before
        newBoard[availSpots[i]] = move.index;
        moves.push(move);
    }
    var bestMove;
    var bestScore;
    if (player === aiPlayer) {
        bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}
