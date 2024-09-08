const player = "O";
const computer = "X";

// Variables to keep track of the game state
let board_full = false;  // Will be set to true when the board is full
let play_board = ["", "", "", "", "", "", "", "", ""];  // The 3x3 game board represented as an array

// Accessing the HTML elements for displaying the board and the winner
const board_container = document.querySelector(".play-area");
const winner_statement = document.getElementById("winner");

// Function to check if the board is full
check_board_complete = () => {
    let flag = true;
    // Check each element on the board to see if it's filled by either player or computer
    play_board.forEach(element => {
        if (element != player && element != computer) {
            flag = false;  // If any spot is empty, the board isn't full
        }
    });
    board_full = flag;  // Set board_full based on the result
};

// Function to check if a specific line (row, column, or diagonal) contains the same value
const check_line = (a, b, c) => {
    return (
        play_board[a] == play_board[b] &&  // Check if three positions have the same value
        play_board[b] == play_board[c] &&
        (play_board[a] == player || play_board[a] == computer)  // Ensure it's either player or computer's mark
    );
};

// Function to check all possible winning combinations
const check_match = () => {
    // Check each row for a win
    for (i = 0; i < 9; i += 3) {
        if (check_line(i, i + 1, i + 2)) {
            // Highlight winning combination
            document.querySelector(`#block_${i}`).classList.add("win");
            document.querySelector(`#block_${i + 1}`).classList.add("win");
            document.querySelector(`#block_${i + 2}`).classList.add("win");
            return play_board[i];  // Return the winner ("O" or "X")
        }
    }
    // Check each column for a win
    for (i = 0; i < 3; i++) {
        if (check_line(i, i + 3, i + 6)) {
            document.querySelector(`#block_${i}`).classList.add("win");
            document.querySelector(`#block_${i + 3}`).classList.add("win");
            document.querySelector(`#block_${i + 6}`).classList.add("win");
            return play_board[i];
        }
    }
    // Check diagonal from top-left to bottom-right
    if (check_line(0, 4, 8)) {
        document.querySelector("#block_0").classList.add("win");
        document.querySelector("#block_4").classList.add("win");
        document.querySelector("#block_8").classList.add("win");
        return play_board[0];
    }
    // Check diagonal from top-right to bottom-left
    if (check_line(2, 4, 6)) {
        document.querySelector("#block_2").classList.add("win");
        document.querySelector("#block_4").classList.add("win");
        document.querySelector("#block_6").classList.add("win");
        return play_board[2];
    }
    return "";  // Return empty string if there's no winner yet
};

// Function to determine if there is a winner or if the game ended in a draw
const check_for_winner = () => {
    let res = check_match();  // Get the result from check_match()
    if (res == player) {  // If player wins
        winner.innerText = "Winner is player!!";
        winner.classList.add("playerWin");
        board_full = true;  // Set board as full to prevent further moves
    } else if (res == computer) {  // If computer wins
        winner.innerText = "Winner is computer";
        winner.classList.add("computerWin");
        board_full = true;
    } else if (board_full) {  // If board is full and no winner
        winner.innerText = "Draw!";
        winner.classList.add("draw");
    }
};

// Function to render the game board in the HTML
const render_board = () => {
    board_container.innerHTML = "";  // Clear the current board
    // Loop through each spot on the board and create a clickable div
    play_board.forEach((e, i) => {
        board_container.innerHTML += `<div id="block_${i}" class="block" onclick="addPlayerMove(${i})">${play_board[i]}</div>`;
        // If the spot is already occupied, add an "occupied" class to prevent further clicks
        if (e == player || e == computer) {
            document.querySelector(`#block_${i}`).classList.add("occupied");
        }
    });
};

// Main game loop, checks for completion and winner after every move
const game_loop = () => {
    render_board();  // Display the updated board
    check_board_complete();  // Check if the board is full
    check_for_winner();  // Check if there's a winner
};

// Function to handle player's move
const addPlayerMove = e => {
    if (!board_full && play_board[e] == "") {  // Check if the spot is empty and the game isn't over
        play_board[e] = player;  // Mark the spot with the player's symbol
        game_loop();  // Update the game state
        addComputerMove();  // Let the computer make its move
    } else if (play_board[e] != "") {  // If the spot is already occupied
        winner.innerText = "This spot is already taken!";  // Show message
        document.querySelector(`#block_${e}`).classList.add("error");  // Highlight the clicked block
        setTimeout(() => {
            winner.innerText = "";  // Clear the message after a short delay
            document.querySelector(`#block_${e}`).classList.remove("error");  // Remove highlight
        }, 1000);  // Timeout for 1 second
    }
};

// Function to handle the computer's move
const addComputerMove = () => {
    if (!board_full) {
        // Try to find a winning move for the computer
        for (let i = 0; i < 9; i++) {
            if (play_board[i] == "") {
                play_board[i] = computer;
                if (check_match() == computer) {
                    game_loop();  // If the computer can win, take the move and end the game
                    return;
                }
                play_board[i] = "";  // Undo if it's not a winning move
            }
        }

        // Try to block the player's winning move
        for (let i = 0; i < 9; i++) {
            if (play_board[i] == "") {
                play_board[i] = player;
                if (check_match() == player) {
                    play_board[i] = computer;  // Block the player from winning
                    game_loop();
                    return;
                }
                play_board[i] = "";  // Undo if it's not a block
            }
        }

        // If no immediate win or block, choose a random spot
        do {
            selected = Math.floor(Math.random() * 9);
        } while (play_board[selected] != "");
        play_board[selected] = computer;  // Random move by the computer
        game_loop();
    }
};

// Function to reset the board for a new game
const reset_board = () => {
    play_board = ["", "", "", "", "", "", "", "", ""];  // Clear the board array
    board_full = false;  // Reset the full-board flag
    winner.classList.remove("playerWin", "computerWin", "draw");  // Remove winner styles
    winner.innerText = "";  // Clear the winner statement
    render_board();  // Re-render the empty board
};

// Rendering of the game board
render_board();
