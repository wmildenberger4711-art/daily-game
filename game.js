const SIZE = 5;

// --------------------
// DAILY STATE
// --------------------
let boards = [];
let originalBoards = [];
let currentBoardIndex = 0;

let selected = null;
let kingCaptured = false;

let startTime = Date.now();
let timerInterval = null;
let elapsedSeconds = 0;

let boardAttempts = [0,0,0,0,0];
let boardCompleted = [false,false,false,false,false];
let boardUsedReset = [false,false,false,false,false];

let gameFinished = false;

// --------------------
// INIT
// --------------------
function initGame(){
    const seed = getDailySeed();
    const pool = getBoardPool();

    const selectedBoards = pickDailyBoards(pool, seed, 5);

    originalBoards = selectedBoards;

    boards = originalBoards.map(board =>
        board.map(row =>
            row.map(cell => cell ? {...cell} : null)
        )
    );

    startTimer();
    drawBoard();
}



// --------------------
// TIMER
// --------------------
function startTimer(){
    startTime = Date.now();

    timerInterval = setInterval(() => {
        elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        const timerEl = document.getElementById("timer");
        if (timerEl){
            timerEl.textContent = `Time: ${formatTime(elapsedSeconds)}`;
        }
    }, 1000);
}

function stopTimer(){
    clearInterval(timerInterval);
}

function formatTime(seconds){
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// --------------------
// BOARD DRAW
// --------------------
const boardDiv = document.getElementById("board");

function drawBoard(){
    boardDiv.innerHTML = "";

    if (!boards[currentBoardIndex]) return;
    const board = boards[currentBoardIndex];

    for (let y = 0; y < SIZE; y++){
        for (let x = 0; x < SIZE; x++){
            const cell = document.createElement("div");
            cell.classList.add("cell");

            if (selected && selected.x === x && selected.y === y){
                cell.classList.add("selected");
            }

            const piece = board[y][x];

            if (piece){
                switch(piece.type){
                    case "rook": cell.textContent = "♖"; break;
                    case "bishop": cell.textContent = "♗"; break;
                    case "queen": cell.textContent = "♕"; break;
                    case "king": cell.textContent = "♔"; break;
                    case "knight": cell.textContent = "♘"; break;
                    case "pawn": cell.textContent = "♙"; break;
                }
            }

            if (piece && piece.moves >= 2){
                cell.style.opacity = "0.4";
            }

            cell.onclick = () => handleClick(x,y);

            boardDiv.appendChild(cell);
        }
    }

    updateStatus();
}

// --------------------
// STATUS
// --------------------
function updateStatus(){
    const statusDiv = document.getElementById("status");
    const shareBtn = document.getElementById("shareBtn");
    const resetBtn = document.getElementById("resetBtn");

    if (!statusDiv) return;

    if (gameFinished){
        statusDiv.textContent = "🎉 Daily Complete!";

        if (shareBtn) shareBtn.style.display = "inline-block";

        if (resetBtn){
            resetBtn.disabled = true;
            resetBtn.style.opacity = "0.5";
            resetBtn.style.cursor = "not-allowed";
        }

        return;
    }

    if (shareBtn) shareBtn.style.display = "none";

    if (resetBtn){
        resetBtn.disabled = false;
        resetBtn.style.opacity = "1";
        resetBtn.style.cursor = "pointer";
    }

    statusDiv.textContent =
        `Board ${currentBoardIndex+1}/5 | Attempts: ${boardAttempts[currentBoardIndex]}`;
}

// --------------------
// CLICK HANDLER
// --------------------
function handleClick(x, y){
    if (gameFinished) return;

    const board = boards[currentBoardIndex];
    const clickedPiece = board[y][x];

    // ignore empty clicks if nothing selected
    if (!selected && !clickedPiece) return;

    // deselect if clicking empty square
    if (selected && !clickedPiece){
        selected = null;
        drawBoard();
        return;
    }

    if (selected){

        // prevent clicking same square
        if (selected.x === x && selected.y === y) return;

        const piece = board[selected.y][selected.x];
        const targetPiece = board[y][x];

        // must capture something
        if (!targetPiece) return;

        if (isValidMove(selected.x, selected.y, x, y)){

            // enforce move limit
            if (piece.moves >= 2) return;

            // 🔥 apply move ONCE
            board[y][x] = piece;
            board[selected.y][selected.x] = null;
            piece.moves++;

            const capturedKing = targetPiece.type === "king";

            selected = null;

            // 🎯 WIN CONDITION
            if (capturedKing){

                boardCompleted[currentBoardIndex] = true;

                drawBoard(); // show final capture visually

                // move to next board or finish game
                if (currentBoardIndex < 4){
                    setTimeout(() => {
                        currentBoardIndex++;
                        selected = null;
                        drawBoard();
                    }, 400);
                } else {
                    setTimeout(() => {
                        gameFinished = true;
                        stopTimer();
                        drawBoard();
                    }, 400);
                }

                return;
            }

            // normal move redraw
            drawBoard();
            return;
        }
    }

    // select a piece
    if (clickedPiece){
        selected = { x, y };
        drawBoard();
    }
}

// --------------------
// COUNT PIECES
// --------------------
function countNonKings(board){
    let count = 0;
    for (let row of board){
        for (let cell of row){
            if (cell && cell.type !== "king") count++;
        }
    }
    return count;
}

// --------------------
// MOVE VALIDATION
// --------------------
function isValidMove(fromX, fromY, toX, toY){
    const board = boards[currentBoardIndex];
    const piece = board[fromY][fromX];
    const dx = toX - fromX;
    const dy = toY - fromY;

    switch(piece.type){

        case "rook":
            if (dx !== 0 && dy !== 0) return false;
            return isPathClear(board, fromX, fromY, toX, toY);

        case "bishop":
            if (Math.abs(dx) !== Math.abs(dy)) return false;
            return isPathClear(board, fromX, fromY, toX, toY);

        case "queen":
            if (dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy)){
                return isPathClear(board, fromX, fromY, toX, toY);
            }
            return false;

        case "king":
            return Math.abs(dx) <= 1 && Math.abs(dy) <= 1;

        case "knight":
            return (Math.abs(dx) === 2 && Math.abs(dy) === 1) ||
                   (Math.abs(dx) === 1 && Math.abs(dy) === 2);

        case "pawn":
            return Math.abs(dx) === 1 && dy === -1;

        default:
            return false;
    }
}

// --------------------
// PATH CHECK
// --------------------
function isPathClear(board, fromX, fromY, toX, toY){
    let dx = Math.sign(toX - fromX);
    let dy = Math.sign(toY - fromY);

    let x = fromX + dx;
    let y = fromY + dy;

    while (x !== toX || y !== toY){
        if (board[y][x] !== null) return false;
        x += dx;
        y += dy;
    }

    return true;
}

// --------------------
// RESET
// --------------------
function resetCurrentBoard(){
    console.log("Reset clicked");

    boards[currentBoardIndex] = originalBoards[currentBoardIndex].map(row =>
        row.map(cell => cell ? { ...cell, moves: 0 } : null)
    );

    boardUsedReset[currentBoardIndex] = true;
    boardAttempts[currentBoardIndex]++;

    selected = null;

    drawBoard();
}

// --------------------
// SHARE
// --------------------
function shareResult(){
    let blocks = boardCompleted.map((completed, i) => {
        if (completed && !boardUsedReset[i]) return "🟩";
        if (completed && boardUsedReset[i]) return "🟨";
        return "🟥";
    }).join("");

    const text =
`🟩 Pepe Capture Daily
${blocks}
Time: ${formatTime(elapsedSeconds)}`;

    navigator.clipboard.writeText(text).then(() => {
        alert("Copied to clipboard!");
    });
}

// --------------------
// BUTTON WIRING
// --------------------
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("resetBtn")?.addEventListener("click", resetCurrentBoard);
    document.getElementById("shareBtn")?.addEventListener("click", shareResult);
});

function getDailySeed(){
    const today = new Date();
    return today.getFullYear()*10000 + (today.getMonth()+1)*100 + today.getDate();
}

function pickDailyBoards(pool, seed, count){
    const rng = mulberry32(seed);

    let indices = pool.map((_, i) => i);

    // shuffle indices deterministically
    for (let i = indices.length - 1; i > 0; i--){
        const j = Math.floor(rng() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    // take first N boards
    return indices.slice(0, count).map(i => cloneBoard(pool[i]));
}

function mulberry32(a){
    return function(){
        let t = a += 0x6D2B79F5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
}

function cloneBoard(board){
    return board.map(row =>
        row.map(cell => cell ? {...cell} : null)
    );
}

// --------------------
// START
// --------------------
initGame();