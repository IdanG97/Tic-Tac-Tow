const player1 = "O";
const player2 = "X";
let currentPlayer = player1;
let board_full = false;
let play_board = ["", "", "", "", "", "", "", "", ""];
const board_container = document.querySelector(".play-area");
const winner_statement = document.getElementById("winner");

let vsComputer = true; // Default game mode is vs Computer

// Add event listeners to radio buttons to change game mode
document.querySelectorAll('input[name="game-mode"]').forEach(input => {
    input.addEventListener('change', () => {
        vsComputer = input.value === 'computer'; // Toggle between modes
        reset_board(); // Reset the board whenever the mode is changed
    });
});

// Check if the board is full
check_board_complete = () => {
    let flag = true;
    play_board.forEach(element => {
        if (element != player1 && element != player2) {
            flag = false;
        }
    });
    board_full = flag;
};

// Check winning lines
const check_line = (a, b, c) => {
    return (
        play_board[a] == play_board[b] &&
        play_board[b] == play_board[c] &&
        (play_board[a] == player1 || play_board[a] == player2)
    );
};

// Check for winner
const check_match = () => {
    for (i = 0; i < 9; i += 3) {
        if (check_line(i, i + 1, i + 2)) return play_board[i];
    }
    for (i = 0; i < 3; i++) {
        if (check_line(i, i + 3, i + 6)) return play_board[i];
    }
    if (check_line(0, 4, 8)) return play_board[0];
    if (check_line(2, 4, 6)) return play_board[2];
    return "";
};

// Handle moves
const game_loop = () => {
    render_board();
    check_board_complete();
    check_for_winner();
};

// Render the board
const render_board = () => {
    board_container.innerHTML = "";
    play_board.forEach((e, i) => {
        board_container.innerHTML += `<div id="block_${i}" class="block" onclick="addPlayerMove(${i})">${play_board[i]}</div>`;
        if (e == player1 || e == player2) {
            document.querySelector(`#block_${i}`).classList.add("occupied");
        }
    });
};

// Add player move
const addPlayerMove = e => {
    if (!board_full && play_board[e] == "") {
        play_board[e] = currentPlayer;
        game_loop();

        if (vsComputer && currentPlayer === player1) {
            addComputerMove();
        } else {
            currentPlayer = currentPlayer === player1 ? player2 : player1;
        }
    } else if (play_board[e] != "") {
        winner_statement.innerText = "This spot is already taken!";
        document.querySelector(`#block_${e}`).classList.add("error");
        setTimeout(() => {
            winner_statement.innerText = "";
            document.querySelector(`#block_${e}`).classList.remove("error");
        }, 1000);
    }
};

// Computer move logic
const addComputerMove = () => {
    if (!board_full) {
        do {
            selected = Math.floor(Math.random() * 9);
        } while (play_board[selected] != "");
        play_board[selected] = player2;
        game_loop();
    }
};

// Check for winner
const check_for_winner = () => {
    let res = check_match();
    if (res == player1) {
        winner_statement.innerText = "Player 1 wins!";
        winner_statement.classList.add("playerWin");
        board_full = true;
    } else if (res == player2) {
        winner_statement.innerText = vsComputer ? "Computer wins!" : "Player 2 wins!";
        winner_statement.classList.add("computerWin");
        board_full = true;
    } else if (board_full) {
        winner_statement.innerText = "It's a draw!";
        winner_statement.classList.add("draw");
    }
};

// Reset the board
const reset_board = () => {
    play_board = ["", "", "", "", "", "", "", "", ""];
    board_full = false;
    winner_statement.classList.remove("playerWin", "computerWin", "draw");
    winner_statement.innerText = "";
    currentPlayer = player1;
    render_board();
};

// Initial render
render_board();
