// Rock Paper Scissors - first to 10 wins

console.log("game is working!");

//  GETTING THE ELEMENTS
let choiceButtons = document.querySelectorAll(".choice-btn");
let resetBtn = document.getElementById("reset-btn");
let choiceArea = document.getElementById("choice-area");

let playerPic = document.getElementById("player-pic");
let computerPic = document.getElementById("computer-pic");
let playerPlaceholder = document.getElementById("player-placeholder");
let computerPlaceholder = document.getElementById("computer-placeholder");

let resultText = document.getElementById("result");
let roundInfo = document.getElementById("round-info");
let playerScoreText = document.getElementById("player-score");
let drawScoreText = document.getElementById("draw-score");
let computerScoreText = document.getElementById("computer-score");

// variables to keep track of the score and rounds
let playerScore = 0;
let computerScore = 0;
let drawScore = 0;
let rounds = 0;

let winningScore = 10;
let gameOver = false;

// the 3 possible moves
let choices = ["rock", "paper", "scissors"];

// counts how many times the player played each move
// the computer uses this to guess what you'll play next
let moveCounts = {
  rock: 0,
  paper: 0,
  scissors: 0
};

// key = the move, value = the move that BEATS it
let whatBeats = {
  rock: "paper",
  paper: "scissors",
  scissors: "rock"
};

// the computer picks a random move (used for the first 3 rounds and 30% of the time after that)

function getRandomChoice() {
  // Math.random gives 0 to 0.99, times 3 and floor gives 0, 1 or 2
  let randomNumber = Math.floor(Math.random() * 3);
  return choices[randomNumber];
}

// finds the move the player plays the most (null if no moves yet)
function getMostPlayed() {
  let mostPlayed = null;
  let highest = 0;

  for (let i = 0; i < choices.length; i++) {
    let move = choices[i];

    if (moveCounts[move] > highest) {
      highest = moveCounts[move];
      mostPlayed = move;
    }
  }

  return mostPlayed;
}

// the computer picks its move based on the prediction of what the player will play
function getComputerChoice(prediction) {
  // not enough rounds yet so just pick randomly
  if (prediction === null) {
    return getRandomChoice();
  }

  // 70% of the time the computer will pick the move that beats your most played move
  // the other 30% is random to keep it from being too predictable
  if (Math.random() < 0.7) {
    return whatBeats[prediction];
  } else {
    return getRandomChoice();
  }
}

// who won the round? returns "player", "computer" or "draw"

function getWinner(player, computer) {
  if (player === computer) {
    return "draw";
  } else if (whatBeats[computer] === player) {
    return "player";
  } else {
    return "computer";
  }
}

// show the picture for the player or computer and hide the placeholder

function showPicture(picElement, placeholderElement, choice) {
  picElement.src = "Images/" + choice + ".svg";
  picElement.classList.remove("hidden");
  placeholderElement.classList.add("hidden");

  // restart the pop animation
  picElement.classList.remove("pop");
  void picElement.offsetWidth; // (this line makes the animation restart, found it online)
  picElement.classList.add("pop");
}

// PLAY ONE ROUND  - this is the main function that runs when you click a button

// this is the main function that runs when you click a button
function playRound(playerChoice) {
  // dont let the player keep playing after someone won
  if (gameOver === true) {
    return;
  }

  // the computer guesses before it sees your pick (needs 3 rounds of data)
  let prediction = null;
  if (rounds >= 3) {
    prediction = getMostPlayed();
  }

  // the computer picks its move based on the prediction
  let computerChoice = getComputerChoice(prediction);
  let winner = getWinner(playerChoice, computerChoice);

  console.log("Prediction: " + prediction + " | You: " + playerChoice + " | Computer: " + computerChoice + " | Winner: " + winner);

  // the computer learns from this move
  moveCounts[playerChoice] = moveCounts[playerChoice] + 1;
  rounds = rounds + 1;

  // show the pictures for the player and computer
  showPicture(playerPic, playerPlaceholder, playerChoice);
  showPicture(computerPic, computerPlaceholder, computerChoice);

  // reset the colours first
  resultText.classList.remove("text-[#7C9473]", "text-[#E8646F]", "text-[#D9A441]");
  // then add the colour for the winner

  // update the score and show a message for the winner
  if (winner === "player") {
    playerScore = playerScore + 1;
    resultText.textContent = "You win this round!";
    resultText.classList.add("text-[#7C9473]");
  } else if (winner === "computer") {
    computerScore = computerScore + 1;

    // if the computer guessed right it gets a fun message
    if (prediction === playerChoice) {
      resultText.textContent = "Computer wins. It saw that coming.";
    } else {
      resultText.textContent = "Computer wins this round.";
    }
    resultText.classList.add("text-[#E8646F]");
  } else {
    drawScore = drawScore + 1;
    resultText.textContent = "It's a draw!";
    resultText.classList.add("text-[#D9A441]");
  }

  checkGameOver();
  updateScores();
}

// check if the game is over and show a message if it is and fade the buttons
function checkGameOver() {
  if (playerScore === winningScore) {
    gameOver = true;
    resultText.textContent = "You won the game! 🎉 Press reset to play again.";
    choiceArea.classList.add("opacity-40");
  } else if (computerScore === winningScore) {
    gameOver = true;
    resultText.textContent = "The computer won the game. Press reset to try again.";
    choiceArea.classList.add("opacity-40");
  }
}

//update the score text on the page
function updateScores() {
  playerScoreText.textContent = playerScore;
  drawScoreText.textContent = drawScore;
  computerScoreText.textContent = computerScore;
  roundInfo.textContent = "Round " + rounds + " · first to " + winningScore + " wins";
}

// reset the game to 0-0 and show the placeholders again

function resetGame() {
  playerScore = 0;
  computerScore = 0;
  drawScore = 0;
  rounds = 0;
  gameOver = false;

  moveCounts.rock = 0;
  moveCounts.paper = 0;
  moveCounts.scissors = 0;

  // reset the score text and round info
  updateScores();
  roundInfo.textContent = "First to " + winningScore + " wins!";

  // hide the pictures and show the placeholders again
  playerPic.classList.add("hidden");
  computerPic.classList.add("hidden");
  playerPlaceholder.classList.remove("hidden");
  computerPlaceholder.classList.remove("hidden");

  // reset the result text and remove the faded buttons
  choiceArea.classList.remove("opacity-40");
  resultText.classList.remove("text-[#7C9473]", "text-[#E8646F]", "text-[#D9A441]");
  resultText.textContent = "Make your move!";
}

// EVENTS 

// add a click to each of the 3 buttons 
for (let i = 0; i < choiceButtons.length; i++) {
  choiceButtons[i].addEventListener("click", function () {
    // "this" is the button that was clicked
    let choice = this.getAttribute("data-choice");
    playRound(choice);
  });
}

resetBtn.addEventListener("click", resetGame);