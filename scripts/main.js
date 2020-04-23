/* Initialize Classes */
class Card {
  constructor(suit, rank, value) {
    this.suit = suit;
    this.rank = rank;
    this.value = value;
    this.id = this.rank + "_of_" + this.suit
  }
}

class Deck {
  constructor() {
      this.cards = [];    

      const suits = ['clubs', 'diamonds', 'hearts', 'spades'];
     const ranks = ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'];
      const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]; 

      for (let i = 0; i < suits.length; i++) {
        for (let j = 0; j < ranks.length; j++) {
            this.cards.push(new Card(suits[i], ranks[j], values[j]));
        }
    }
  }
  shuffleDeck() {
      for (let i = this.cards.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
      }
      return(this.cards)
  }

  dealCards(size) {
    let hand = this.cards.splice(0, size);
    return hand;
  }
}

class Player {
  constructor(name, player) {
    this.name = name;
    this.cards = [];
    this.score = 0;
    this.playedCard = new PlayedCard(blankCard, "");
    this.playedCardDisplay = document.querySelector("#" + player + "Played");
    this.handDisplay = document.querySelector("#" + player + "Hand");
  }
}

class PlayedCard {
  constructor(card, face) {
    this.card = card;
    this.face = face;
  }
}

const blankCard = new Card("", "", "");



/* Display Functions */
function displayCard(card, face, displayElement) {

  const li = document.createElement("li");
  const image = document.createElement("img");

  if (face === "up") {
    image.onclick = function() {
      playCard(image);
    }

    image.src = "images/cards/" + card.id + ".svg";
    image.alt = card.id;
  } else {
    image.src = "images/cards/red_joker.svg";
    image.alt = "card_back";
  }
  
  image.height = 72.6;
  image.width = 50;
  
  displayElement.append(li);

  li.append(image);
}


function displayPlayerOneHand() {
  playerOne.handDisplay.textContent = "";
  playerOne.cards.forEach(card => displayCard(card, "up", playerOne.handDisplay))
}

function displayPlayerTwoHand() {
  playerTwo.handDisplay.textContent = "";
  playerTwo.cards.forEach(card => displayCard(card, "down", playerTwo.handDisplay));
}


function playedCardText(playedCard) {
  let text = "";

  if (playedCard.face == "up") {
    text = playedCard.card.id + " (" + playedCard.face + ")";
  } else if (playedCard.face == "down") {
    text = "?? (" + playedCard.face + ")";
  }
  return(text);
}

function displayPlayedCard(player) {
  if (player.playedCard.card.rank != "") {
    player.playedCardDisplay.textContent = "";
    displayCard(player.playedCard.card, player.playedCard.face, player.playedCardDisplay,);
  }
}

function displayAction() {
  actionDisplay.textContent = actions[gameState];
}

function relationshipButtonVisibility(status) {
  relationshipButtons.style.visibility = status;
}

function displayComparison(guess, truth) {
  let message = "";

  if (guess === truth) {
    if (guess === "equal") {
      message = "Correct. +5 points";
    } else{
      message = "Correct. +1 point";
    }
  } else {
    message = "Incorrect.";
  }

  actionDisplay.textContent = message;
}

function displayGame() {
  displayPlayerOneHand();
  displayPlayerTwoHand();

  displayPlayedCard(playerOne);
  displayPlayedCard(playerTwo);
  
  console.log(playerOne.score.toString() + " - " + playerTwo.score.toString());
  scoreDisplay.textContent = "(You) " + playerOne.score.toString() + " - " + playerTwo.score.toString() + " (CPU)";
  
  displayAction();

  if (gameState === 2) {
    relationshipButtonVisibility("visible");
  } else {
    relationshipButtonVisibility("hidden");
  }

}


/* Game Functions */
function computerPlaysCard(face) {
  playerTwo.playedCard.card = playerTwo.cards[Math.floor(Math.random() * playerTwo.cards.length)];
  playerTwo.playedCard.face = face;
  playerTwo.cards = playerTwo.cards.filter(c => c.id != playerTwo.playedCard.card.id);

  console.log("Player Two played " + playedCardText(playerTwo.playedCard));

  if (face === "down") {
    gameState = 2;
  } else if (face === "up") {
    gameState = 3;
  }

  displayGame();
}

function computerGuessesRelationship() {
  const guessOptions = ["higher", "higher", "higher", "higher", "equal", "lower", "lower", "lower", "lower"];
  const guess = guessOptions[Math.floor(Math.random() * guessOptions.length)];

  return(guess)
}

async function playCard(cardImage) {
  
  if (gameState === 1 || gameState === 3) {

    const playedCard = playerOne.cards.filter(c => c.id === cardImage.alt)[0];
    playerOne.playedCard.card = playedCard;
    playerOne.cards = playerOne.cards.filter(c => c.id != cardImage.alt);

    if (gameState === 1) {
      playerOne.playedCard.face = "up";

      displayPlayerOneHand();
      displayPlayedCard(playerOne);

      console.log("Player One played " + playedCardText(playerOne.playedCard));

      gameState = 0;
      displayAction();

      await sleep(1000);
      computerPlaysCard("down");

    } else if (gameState === 3) {
      
      playerOne.playedCard.face = "down";

      displayPlayerOneHand();
      displayPlayedCard(playerOne);

      gameState = 0;
      displayAction();

      console.log("Player One played " + playedCardText(playerOne.playedCard));

      await sleep(1000);

      let guess = computerGuessesRelationship();

      console.log("Player Two guessed " + guess);
      actionDisplay.textContent = "Opponent guesses " + guess;

      await sleep(1000);

      playerOne.playedCard.face = "up";
      console.log("Player One played " + playedCardText(playerOne.playedCard));
      displayPlayedCard(playerOne);

      await sleep(1000);

      const truth = compareCards(playerTwo.playedCard.card, playerOne.playedCard.card);

      console.log("Actual is " + truth);
      displayComparison(guess, truth);

      await sleep(1000);

      changeScore(playerTwo, playerOne, guess, truth);

      gameState = 1;

      endTurn();
    }

    displayGame();
  }
}


async function guessRelationship(relationshipButton) {
  if (gameState === 2) {
    
    gameState = 0;
    displayAction();
    relationshipButtonVisibility("hidden");

    const guess = relationshipButton.id;

    console.log("Player One guessed " + guess);

    await sleep(1000);

    playerTwo.playedCard.face = "up";
    console.log("Player Two played " + playedCardText(playerTwo.playedCard));
    displayGame();

    await sleep(1000);

    const truth = compareCards(playerOne.playedCard.card, playerTwo.playedCard.card);

    console.log("Actual is " + truth);
    displayComparison(guess, truth);

    changeScore(playerOne, playerTwo, guess, truth);

    await sleep(1000);

    endTurn();

    /* Only play card if gameState is 0, otherwise game has ended */
    if (gameState === 0) {
      computerPlaysCard("up");
    }


    displayGame();
  }
}


function changeScore(guesser, player, guess, truth) {
  if (guess === truth) {
      if (guess === "equal") {
        console.log(guesser.name + " gains 5 points");
        guesser.score += 5;
      } else {
        console.log(guesser.name + " gains 1 point");
        guesser.score += 1;
      }
    } else {
      console.log(player.name + " gains 1 point");
      player.score += 1;    
    }
}


function compareCards(guesserCard, playerCard) {
  if (playerCard.value > guesserCard.value) {
    return "higher";
  } else if (playerCard.value < guesserCard.value) {
    return "lower";
  } else {
    return "equal";
  }
}

function resetPlayedCards() {
  playerOne.playedCard = new PlayedCard(new Card("", "", ""), "");
  playerTwo.playedCard = new PlayedCard(new Card("", "", ""), "");

  playerOne.playedCardDisplay.textContent = "";
  playerTwo.playedCardDisplay.textContent = "";
}

function endTurn() {
  resetPlayedCards();

  if (playerOne.cards.length === 0) {
    playerOne.cards = deck.dealCards(5);
    playerTwo.cards = deck.dealCards(5);
    console.log("New hands are dealt");
  }
console.log(playerOne.score);
  if (playerOne.score >= 5) {
    gameState = 4; 
  } else if (playerTwo.score >= 5) {
    gameState = 5;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


/* Initialize Objects */
let actions = [
  "...",
  "Choose a card to play face up.",
  "Opponent's card is:",
  "Choose a card to play face down.",
  "YOU WIN!",
  "YOU LOSE!"
]
let gameState = 1;

let deck = new Deck;
let playerOne = new Player("You", "playerOne");
let playerTwo = new Player("Computer", "playerTwo");

deck.shuffleDeck();

playerOne.cards = deck.dealCards(5);
playerTwo.cards = deck.dealCards(5);

const scoreDisplay = document.querySelector("#score");
const actionDisplay = document.querySelector("div.action p");

/** @type {HTMLElement} */
const relationshipButtons = document.querySelector("#relationshipButtons");

const higherButton = document.getElementById("higher");
const equalButton = document.getElementById("equal");
const lowerButton = document.getElementById("lower");

higherButton.onclick = function() {
  guessRelationship(higherButton);
}
equalButton.onclick = function() {
  guessRelationship(equalButton);
}
lowerButton.onclick = function() {
  guessRelationship(lowerButton);
}

displayGame();
