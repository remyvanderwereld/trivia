exports = typeof window !== "undefined" && window !== null ? window : global;

const categories = {
  POP: "Pop",
  SCIENCE: "Science",
  SPORTS: "Sports",
  ROCK: "Rock",
};

const MIN_PLAYERS = 2;
const COINS_TO_WIN_GAME = 6;

const Game = function () {
  let currentPlayer = 0;

  const players = [];
  const places = [];
  const purses = [];

  const popQuestions = [];
  const scienceQuestions = [];
  const sportsQuestions = [];
  const rockQuestions = [];

  const inPenaltyBox = [];
  let isOutOfPenaltyBox = false;

  // Fill questions
  // TODO: What if there are no questions left? Really small risk.
  for (let i = 1; i < 50; i += 1) {
    popQuestions.push(`Pop Question ${i}`);
    scienceQuestions.push(`Science Question ${i}`);
    sportsQuestions.push(`Sports Question ${i}`);
    rockQuestions.push(`Rock Question ${i}`);
  }

  this.add = function (playerName) {
    players.push(playerName);
    const index = players.length - 1;
    places[index] = 0;
    purses[index] = 0;
    inPenaltyBox[index] = false;

    console.log(`${playerName} was added.`);
    console.log(`This is player number ${players.length}.`);
  };

  const getCurrentCategory = function () {
    switch (places[currentPlayer]) {
      case 0:
        return categories.POP;
      case 1:
        return categories.SCIENCE;
      case 2:
        return categories.SPORTS;
      case 3:
        return categories.ROCK;
      case 4:
        return categories.POP;
      case 5:
        return categories.SCIENCE;
      case 6:
        return categories.SPORTS;
      case 7:
        return categories.ROCK;
      case 8:
        return categories.POP;
      case 9:
        return categories.SCIENCE;
      case 10:
        return categories.SPORTS;
      default:
        return categories.ROCK;
    }
  };

  // Check minimum number of players.
  this.isMinimumPlayers = function () {
    return players.length >= MIN_PLAYERS;
  };

  const askQuestion = function () {
    const currentCategory = getCurrentCategory();
    switch (currentCategory) {
      case categories.POP:
        console.log(popQuestions.shift());
        break;
      case categories.SCIENCE:
        console.log(scienceQuestions.shift());
        break;
      case categories.SPORTS:
        console.log(sportsQuestions.shift());
        break;
      default:
        console.log(rockQuestions.shift());
    }
  };

  this.roll = function (roll) {
    const currentPlayerName = players[currentPlayer];
    const currentCategory = getCurrentCategory();

    console.log(`${currentPlayerName} is the current player.`);
    console.log(`${currentPlayerName} has rolled ${roll}.`);

    if (inPenaltyBox[currentPlayer]) {
      if (roll % 2 === 0) {
        console.log(
          `${currentPlayerName} is not getting out of the penalty box.`
        );
        isOutOfPenaltyBox = false;
        return;
      } else {
        isOutOfPenaltyBox = true;
        console.log(`${currentPlayerName} is getting out of the penalty box.`);
      }
    }

    // Maximum place is 11
    places[currentPlayer] = places[currentPlayer] + roll;
    if (places[currentPlayer] > 11) {
      places[currentPlayer] = places[currentPlayer] - 12;
    }
    console.log(
      `${currentPlayerName}'s new location is ${places[currentPlayer]}.`
    );
    console.log(`The category is ${currentCategory}.`);
    askQuestion();
  };

  const nextPlayer = function () {
    currentPlayer += 1;
    if (currentPlayer === players.length) {
      currentPlayer = 0;
    }
  };

  const hasPlayerWonGame = function () {
    return purses[currentPlayer] < COINS_TO_WIN_GAME;
  };

  this.isAnsweredCorrectly = function () {
    if (inPenaltyBox[currentPlayer] && !isOutOfPenaltyBox) {
      nextPlayer();
      return true;
    }
    console.log("Answer was correct!!!!");
    purses[currentPlayer] += 1;
    console.log(
      `${players[currentPlayer]} now has ${purses[currentPlayer]} Gold Coins.`
    );
    const winner = hasPlayerWonGame();
    nextPlayer();
    return winner;
  };

  this.isAnsweredWrong = function () {
    console.log("Question was incorrectly answered!");
    console.log(`${players[currentPlayer]} has been sent to the penalty box.`);
    inPenaltyBox[currentPlayer] = true;
    nextPlayer();
    return true;
  };
};

let noWinner = true;
const game = new Game();

// TODO: Firts player has a higher chance to win the game than the last.
// Roll the dice to decide which player will start.
game.add("Chet");
game.add("Pat");
game.add("Sue");

// Minimum players is 2.
if (game.isMinimumPlayers) {
  do {
    // Random integer from 1 to 6.
    game.roll(Math.floor(Math.random() * 6) + 1);
    // Chance of 1 out of 10 to answer wrong.
    if (Math.floor(Math.random() * 10) === 7) {
      noWinner = game.isAnsweredWrong();
    } else {
      noWinner = game.isAnsweredCorrectly();
    }
  } while (noWinner);
} else {
  console.log("There are not enough players! Can not start the game!");
}
