const cells = document.querySelectorAll(".cell");
const statusMessage = document.getElementById("statusMessage");
const restartButton = document.getElementById("restart");
const onePlayerButton = document.getElementById("onePlayer");
const twoPlayerButton = document.getElementById("twoPlayer");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = false;
let onePlayerMode = false;

// Winning combinations
const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Start the game in selected mode
onePlayerButton.addEventListener("click", () => startGame(true));
twoPlayerButton.addEventListener("click", () => startGame(false));
restartButton.addEventListener("click", restartGame);

function startGame(isOnePlayer) {
  onePlayerMode = isOnePlayer;
  gameActive = true;
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  statusMessage.textContent = `Player ${currentPlayer}'s turn`;
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("taken");
    cell.addEventListener("click", handleCellClick);
  });
}

function handleCellClick(event) {
  const cell = event.target;
  const index = cell.dataset.index;

  if (board[index] !== "" || !gameActive) return;

  board[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add("taken");

  if (checkWinner()) {
    statusMessage.textContent = `Player ${currentPlayer} wins!`;
    gameActive = false;
    return;
  }

  if (board.every((cell) => cell !== "")) {
    statusMessage.textContent = "It's a tie!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusMessage.textContent = `Player ${currentPlayer}'s turn`;

  if (onePlayerMode && currentPlayer === "O") {
    setTimeout(computerMove, 500);
  }
}

function computerMove() {
  let availableIndices = board
    .map((value, index) => (value === "" ? index : null))
    .filter((value) => value !== null);

  const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
  board[randomIndex] = currentPlayer;

  const cell = document.querySelector(`.cell[data-index="${randomIndex}"]`);
  cell.textContent = currentPlayer;
  cell.classList.add("taken");

  if (checkWinner()) {
    statusMessage.textContent = `Player ${currentPlayer} wins!`;
    gameActive = false;
    return;
  }

  if (board.every((cell) => cell !== "")) {
    statusMessage.textContent = "It's a tie!";
    gameActive = false;
    return;
  }

  currentPlayer = "X";
  statusMessage.textContent = `Player ${currentPlayer}'s turn`;
}

function checkWinner() {
  return winningConditions.some((combination) => {
    const [a, b, c] = combination;
    return board[a] === currentPlayer && board[b] === currentPlayer && board[c] === currentPlayer;
  });
}

function restartGame() {
  startGame(onePlayerMode);
}
