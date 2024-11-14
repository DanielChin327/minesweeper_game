const gameContainer = document.getElementById("gameContainer");
const startButton = document.getElementById("startButton");
const gridSizeInput = document.getElementById("gridSize");
const difficultySelect = document.getElementById("difficulty");

let gridSize, numMines, grid;

startButton.addEventListener("click", startGame);

function startGame() {
  gridSize = parseInt(gridSizeInput.value);
  const difficulty = difficultySelect.value;
  numMines = calculateMines(difficulty);
  createGrid();
  placeMines();
  updateNumbers();
}

function calculateMines(difficulty) {
  if (difficulty === "easy") return Math.floor(gridSize * gridSize * 0.1);
  if (difficulty === "medium") return Math.floor(gridSize * gridSize * 0.15);
  if (difficulty === "hard") return Math.floor(gridSize * gridSize * 0.2);
}

function createGrid() {
  gameContainer.style.gridTemplateColumns = `repeat(${gridSize}, 30px)`;
  gameContainer.innerHTML = ""; // Clear previous grid
  grid = [];
  for (let row = 0; row < gridSize; row++) {
    const rowArray = [];
    for (let col = 0; col < gridSize; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener("click", () => revealCell(row, col));
      cell.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        toggleFlag(cell);
      });
      rowArray.push({ cell, isMine: false, isRevealed: false, isFlagged: false, adjacentMines: 0 });
      gameContainer.appendChild(cell);
    }
    grid.push(rowArray);
  }
}

function placeMines() {
  let minesPlaced = 0;
  while (minesPlaced < numMines) {
    const row = Math.floor(Math.random() * gridSize);
    const col = Math.floor(Math.random() * gridSize);
    if (!grid[row][col].isMine) {
      grid[row][col].isMine = true;
      minesPlaced++;
    }
  }
}

function updateNumbers() {
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (!grid[row][col].isMine) {
        const mines = countAdjacentMines(row, col);
        grid[row][col].adjacentMines = mines;
      }
    }
  }
}

function countAdjacentMines(row, col) {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const newRow = row + i;
      const newCol = col + j;
      if (isInBounds(newRow, newCol) && grid[newRow][newCol].isMine) {
        count++;
      }
    }
  }
  return count;
}

function revealCell(row, col) {
  const cellObj = grid[row][col];
  if (cellObj.isRevealed || cellObj.isFlagged) return;

  cellObj.isRevealed = true;
  cellObj.cell.classList.add("revealed");

  if (cellObj.isMine) {
    cellObj.cell.classList.add("mine");
    alert("Game Over!");
    return;
  }

  if (cellObj.adjacentMines > 0) {
    cellObj.cell.textContent = cellObj.adjacentMines;
  } else {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const newRow = row + i;
        const newCol = col + j;
        if (isInBounds(newRow, newCol)) {
          revealCell(newRow, newCol);
        }
      }
    }
  }
}

function toggleFlag(cell) {
  const row = cell.dataset.row;
  const col = cell.dataset.col;
  const cellObj = grid[row][col];
  if (!cellObj.isRevealed) {
    cellObj.isFlagged = !cellObj.isFlagged;
    cell.classList.toggle("flag");
  }
}

function isInBounds(row, col) {
  return row >= 0 && row < gridSize && col >= 0 && col < gridSize;
}
