let time = 0;
let moveCount = 0;
let timer;

// Initialize the tiles
let tiles = Array.from(document.querySelectorAll('.tile')); // Get all tile elements directly

// Function to start the game
function startGame() {
    resetGame();
    shuffleTiles();
    startTimer();
}

// Function to reset the game (clear moves, time, and layout)
function resetGame() {
    moveCount = 0;
    time = 0;
    document.getElementById('moveCount').innerText = moveCount;
    document.getElementById('time').innerText = "00:00";
    stopTimer();
    shuffleTiles();
}

// Timer logic
function startTimer() {
    timer = setInterval(() => {
        time++;
        document.getElementById('time').innerText = formatTime(time);
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`;
}

// Shuffle the tiles randomly
function shuffleTiles() {
    let order = [];
    for (let i = 1; i <= 15; i++) {
        order.push(i);
    }
    order.push(16);  // 16 is the empty space (tile16)
    order = order.sort(() => Math.random() - 0.5); // Randomize the order

    // Set the shuffled classes to tiles
    for (let i = 0; i < 16; i++) {
        tiles[i].className = `tile tile${order[i]}`; // Assign the shuffled class names
        // Assign row and column based on the shuffled position
        tiles[i].setAttribute('data-row', Math.floor(i / 4));
        tiles[i].setAttribute('data-column', i % 4);
    }
}

// Check for valid tile click and swap tiles
function clickTile(row, column) {
    const clickedTile = document.querySelector(`.tile[data-row='${row}'][data-column='${column}']`);
    const clickedTileClass = clickedTile.className;

    // Don't allow clicking on the empty tile (tile 16)
    if (clickedTileClass.includes('tile16')) return;

    const emptyTile = document.querySelector('.tile16');
    const emptyRow = parseInt(emptyTile.getAttribute('data-row'));
    const emptyColumn = parseInt(emptyTile.getAttribute('data-column'));

    // Check if the clicked tile is adjacent to the empty tile (either vertically or horizontally)
    if (Math.abs(emptyRow - row) + Math.abs(emptyColumn - column) === 1) {
        swapTiles(row, column, emptyRow, emptyColumn);
        moveCount++;
        document.getElementById('moveCount').innerText = moveCount;
        setTimeout(() => {
            if (checkWin()) {
                alert(`Congratulations!!\nAmount spent on current game in seconds: ${time}\nNumber of moves so far: ${moveCount}\nTo play again, click OK`);
                resetGame();
            }
        }, 100);
    }
}

// Swap the tiles
function swapTiles(row1, column1, row2, column2) {
    const tile1 = document.querySelector(`.tile[data-row='${row1}'][data-column='${column1}']`);
    const tile2 = document.querySelector(`.tile[data-row='${row2}'][data-column='${column2}']`);

    const tempClass = tile1.className;
    tile1.className = tile2.className;
    tile2.className = tempClass;

    // Update the data attributes after swap
    tile1.setAttribute('data-row', row2);
    tile1.setAttribute('data-column', column2);
    tile2.setAttribute('data-row', row1);
    tile2.setAttribute('data-column', column1);
}

// Check if the player has won
function checkWin() {
    for (let i = 0; i < 15; i++) {
        if (tiles[i].className !== `tile tile${i + 1}`) {
            return false;
        }
    }
    // Ensure the empty tile (tile16) is in the last position
    if (tiles[15].className !== "tile tile16") {
        return false;
    }
    return true;
}

// Event listeners for starting a new game
document.getElementById('startGame').addEventListener('click', startGame);
document.getElementById('newGame').addEventListener('click', resetGame);

// Add click events to each tile
tiles.forEach(tile => {
    tile.addEventListener('click', function() {
        const row = parseInt(tile.getAttribute('data-row'));
        const column = parseInt(tile.getAttribute('data-column'));
        clickTile(row, column);
    });
});
