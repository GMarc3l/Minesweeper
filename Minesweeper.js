let board = [];
let rows = 8;
let columns = 8;
let minesCount =10;
let minesLocation = []; 
let tilesClicked = 0;
let flagEnabled = false;
let game_Over = false;

window.onload = function() {
    game();
}

function game() {
    for (let r = 0; r < rows; ++r) {
        let row = [];
        for (let c = 0; c < columns; ++c) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString(); // 0-0
            tile.addEventListener("click", clickTile);
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }
    console.log(board);
    setMines();
    document.getElementById("flag-button").addEventListener("click", setFlag);
    document.getElementById("mines-count").innerText = minesCount;
}

function setMines() {
    let minesLeft = minesCount;
    while (minesLeft > 0) { 
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + "-" + c.toString();
        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft -= 1;
        }
    }
}

function setFlag() {
    if (flagEnabled) {
        flagEnabled = false;
        document.getElementById("flag-button").style.backgroundColor = "lightgray";
    }
    else {
        flagEnabled = true;
        document.getElementById("flag-button").style.backgroundColor = "darkgray";
    }
}

function clickTile() {
    if (game_Over || this.classList.contains("tile-clicked")) {
        return;
    }
    let tile = this;
    if (flagEnabled) {
        if (tile.innerText == "") {
            tile.innerText = "🚩";
        }
        else if (tile.innerText == "🚩") {
            tile.innerText = "";
        }
        return;
    }
    if (minesLocation.includes(tile.id)) {
        game_Over = true;
        revealMines();
        gameOver();
        return;
    }
    let coords = tile.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMine(r, c);
}

function revealMines() {
    for (let r= 0; r < rows; ++r) {
        for (let c = 0; c < columns; ++c) {
            let tile = board[r][c];
            if (minesLocation.includes(tile.id)) {
                tile.innerText = "💣";
                tile.style.backgroundColor = "red";                
            }
        }
    }
}

function checkMine(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return;
    }
    if (board[r][c].classList.contains("tile-clicked")) {
        return;
    }
    board[r][c].classList.add("tile-clicked");
    tilesClicked += 1;
    let minesFound = 0;
    minesFound += checkTile(r-1, c-1);      
    minesFound += checkTile(r-1, c);        
    minesFound += checkTile(r-1, c+1);      
    minesFound += checkTile(r, c-1);       
    minesFound += checkTile(r, c+1);       
    minesFound += checkTile(r+1, c-1);      
    minesFound += checkTile(r+1, c);        
    minesFound += checkTile(r+1, c+1);     
    if (minesFound > 0) {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound.toString());
    }
    else {
        checkMine(r-1, c-1);    
        checkMine(r-1, c);      
        checkMine(r-1, c+1);    
        checkMine(r, c-1);      
        checkMine(r, c+1);    
        checkMine(r+1, c-1);    
        checkMine(r+1, c);    
        checkMine(r+1, c+1);   
    }
    if (tilesClicked == rows * columns - minesCount) {
        document.getElementById('endOfGame').innerHTML += `
        <p class="fw-bold">You won!</p>
        <button type="button" class="btn btn-primary" onclick="restart()">Play Again</button>`;
        game_Over = true;
    }
}

function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return 0;
    }
    if (minesLocation.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}

function gameOver(){
    document.getElementById('endOfGame').innerHTML += `
        <p class="fw-bold">Game over!</p>
        <button type="button" class="btn btn-primary" onclick="restart()">Play Again</button>`;
}
function restart() {
	window.location.reload();
}
