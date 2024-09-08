const player1 = "O";
const player2 = "X";
let currentPlayer = player1;  // Start with player1

// Variables to keep track of the game state
let board_full = false;  // Will be set to true when the board is full
let play_board = ["", "", "", "", "", "", "", "", ""];  // The 3x3 game board represented as an array
let gameMode = "computer";  // Default game mode

// Accessing the HTML elements for displaying the board and the winner
const board_container = document.querySelector(".play-area");
const winner_statement = document.getElementById("winner");

// Function to check if the board is full
const check_board_complete = () => {
    let flag = true;
    play_board.forEach(element => {
        if (element != player1 && element != player2) {
            flag = false;
        }
    });
    board_full = flag;
};

// Function to check if a specific line (row, column, or diagonal) contains the same value
const check_line = (a, b, c) => {
    return (
        play_board[a] == play_board[b] &&
        play_board[b] == play_board[c] &&
        (play_board[a] == player1 || play_board[a] == player2)
    );
};

// Function to check all possible winning combinations
const check_match = () => {
    for (let i = 0; i < 9; i += 3) {
        if (check_line(i, i + 1, i + 2)) {
            document.querySelector(`#block_${i}`).classList.add("win");
            document.querySelector(`#block_${i + 1}`).classList.add("win");
            document.querySelector(`#block_${i + 2}`).classList.add("win");
            return play_board[i];
        }
    }
    for (let i = 0; i < 3; i++) {
        if (check_line(i, i + 3, i + 6)) {
            document.querySelector(`#block_${i}`).classList.add("win");
            document.querySelector(`#block_${i + 3}`).classList.add("win");
            document.querySelector(`#block_${i + 6}`).classList.add("win");
            return play_board[i];
        }
    }
    if (check_line(0, 4, 8)) {
        document.querySelector("#block_0").classList.add("win");
        document.querySelector("#block_4").classList.add("win");
        document.querySelector("#block_8").classList.add("win");
        return play_board[0];
    }
    if (check_line(2, 4, 6)) {
        document.querySelector("#block_2").classList.add("win");
        document.querySelector("#block_4").classList.add("win");
        document.querySelector("#block_6").classList.add("win");
        return play_board[2];
    }
    return "";
};

// Function to determine if there is a winner or if the game ended in a draw
const check_for_winner = () => {
    let res = check_match();
    if (res === player1) {
        if (gameMode === "player") {
            winner_statement.innerText = "Player 1 wins!";
        } else {
            winner_statement.innerText = "Winner is Player 1!";
        }
        winner_statement.classList.add("playerWin");
        board_full = true;
    } else if (res === player2) {
        if (gameMode === "player") {
            winner_statement.innerText = "Player 2 wins!";
        } else {
            winner_statement.innerText = "Computer won!";
        }
        winner_statement.classList.add("computerWin");
        board_full = true;
    } else if (board_full) {
        winner_statement.innerText = "Draw!";
        winner_statement.classList.add("draw");
    }
};



// Function to render the game board in the HTML
const render_board = () => {
    board_container.innerHTML = "";
    play_board.forEach((e, i) => {
        board_container.innerHTML += `<div id="block_${i}" class="block" onclick="addMove(${i})">${play_board[i]}</div>`;
        if (e == player1 || e == player2) {
            document.querySelector(`#block_${i}`).classList.add("occupied");
        }
    });
};

// Main game loop, checks for completion and winner after every move
const game_loop = () => {
    render_board();
    check_board_complete();
    check_for_winner();
};

// Function to handle a player's move
const addMove = i => {
    if (!board_full && play_board[i] === "") {
        play_board[i] = currentPlayer;
        game_loop();
        // Switch player if in player vs. player mode
        if (gameMode === "player") {
            currentPlayer = (currentPlayer === player1) ? player2 : player1;
        } else if (gameMode === "computer" && !board_full) {
            addComputerMove();  // Let the computer make its move
        }
    } else if (play_board[i] !== "") {
        showErrorMessage(i);
    }
};

// Function to show error message
const showErrorMessage = (i) => {
    winner_statement.innerText = "This spot is already taken!";
    document.querySelector(`#block_${i}`).classList.add("error");
    setTimeout(() => {
        winner_statement.innerText = "";
        document.querySelector(`#block_${i}`).classList.remove("error");
    }, 1000);
};


// Function to handle the computer's move
const addComputerMove = () => {
    if (!board_full) {
        for (let i = 0; i < 9; i++) {
            if (play_board[i] == "") {
                play_board[i] = player2;
                if (check_match() == player2) {
                    game_loop();
                    return;
                }
                play_board[i] = "";
            }
        }
        for (let i = 0; i < 9; i++) {
            if (play_board[i] == "") {
                play_board[i] = player1;
                if (check_match() == player1) {
                    play_board[i] = player2;
                    game_loop();
                    return;
                }
                play_board[i] = "";
            }
        }
        let selected;
        do {
            selected = Math.floor(Math.random() * 9);
        } while (play_board[selected] != "");
        play_board[selected] = player2;
        game_loop();
    }
};

// Function to reset the board for a new game
const reset_board = () => {
    play_board = ["", "", "", "", "", "", "", "", ""];
    board_full = false;
    winner_statement.classList.remove("playerWin", "computerWin", "draw");
    winner_statement.innerText = "";
    render_board();
};

// Function to set the game mode based on user selection
const setGameMode = () => {
    const mode = document.querySelector('input[name="game-mode"]:checked').value;
    gameMode = mode;
    currentPlayer = player1;  // Reset to player 1 for a new game
    reset_board();  // Reset the board for a new game based on selected mode
};

// Add event listener to handle mode changes
document.querySelectorAll('input[name="game-mode"]').forEach(input => {
    input.addEventListener('change', setGameMode);
});

// Initial render
render_board();
