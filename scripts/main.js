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
  constructor(name) {
    this.name = name;
    this.cards = [];
    this.score = 0;
  }
}

class PlayedCard {
  constructor(card, face) {
    this.card = card;
    this.face = face;
  }
}





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
  playerOneHandDisplay.textContent = "";
  playerOne.cards.forEach(card => displayCard(card, "up", playerOneHandDisplay))
}

function displayPlayerTwoHand() {
  playerTwoHandDisplay.textContent = "";
  playerTwo.cards.forEach(card => displayCard(card, "down", playerTwoHandDisplay));
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


function displayGame() {
  displayPlayerOneHand();
  displayPlayerTwoHand();

  if (playerOneCard.card.rank != "") {
    displayCard(playerOneCard.card, playerOneCard.face, playerOneCardDisplay,);
  }
  if (playerTwoCard.card.rank != "") {
    displayCard(playerTwoCard.card, playerTwoCard.face, playerTwoCardDisplay);
  }
  
  console.log(playerOne.score.toString() + " - " + playerTwo.score.toString());
  scoreDisplay.textContent = "(You) " + playerOne.score.toString() + " - " + playerTwo.score.toString() + " (CPU)";
  
  actionDisplay.innerText = actions[gameState];

  if (gameState === 1) {
    relationshipButtons.style.visibility = "visible";
  } else {
    relationshipButtons.style.visibility = "hidden";
  }

}


/* Game Functions */
function computerPlaysCard(face) {
  playerTwoCard.card = playerTwo.cards[Math.floor(Math.random() * playerTwo.cards.length)];
  playerTwoCard.face = face;
  playerTwo.cards = playerTwo.cards.filter(c => c.id != playerTwoCard.card.id);

  console.log("Player Two played " + playedCardText(playerTwoCard));
}

function computerGuessesRelationship() {
  const guessOptions = ["higher", "higher", "higher", "higher", "equal", "lower", "lower", "lower", "lower"];
  const guess = guessOptions[Math.floor(Math.random() * guessOptions.length)];

  return(guess)
}

function playCard(cardImage) {
  
  if (gameState === 0 || gameState === 2) {

    const playedCard = playerOne.cards.filter(c => c.id === cardImage.alt)[0];
    playerOneCard.card = playedCard;
    playerOne.cards = playerOne.cards.filter(c => c.id != cardImage.alt);

    if (gameState === 0) {
      playerOneCard.face = "up";

      console.log("Player One played " + playedCardText(playerOneCard));

      computerPlaysCard("down");

      gameState = 1;

    } else if (gameState === 2) {
      
      playerOneCard.face = "down";

      console.log("Player One played " + playedCardText(playerOneCard));

      let guess = computerGuessesRelationship();

      console.log("Player Two guessed " + guess);

      playerOneCard.face = "up";
      console.log("Player One played " + playedCardText(playerOneCard));

      const truth = compareCards(playerTwoCard.card, playerOneCard.card);

      console.log("Actual is " + truth);

      changeScore(playerTwo, playerOne, guess, truth);

      gameState = 0;

      endTurn();
    }

    displayGame();
  }
}


function guessRelationship(relationshipButton) {
  if (gameState === 1) {
    
    const guess = relationshipButton.id;

    console.log("Player One guessed " + guess);

    playerTwoCard.face = "up";
    console.log("Player Two played " + playedCardText(playerTwoCard));

    const truth = compareCards(playerOneCard.card, playerTwoCard.card);

    console.log("Actual is " + truth);

    changeScore(playerOne, playerTwo, guess, truth);

    gameState = 2;

    endTurn();

    computerPlaysCard("up");

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
  playerOneCard = new PlayedCard(new Card("", "", ""), "");
  playerTwoCard = new PlayedCard(new Card("", "", ""), "");

  playerOneCardDisplay.textContent = "";
  playerTwoCardDisplay.textContent = "";
}

function endTurn() {
  resetPlayedCards();

  if (playerOne.cards.length === 0) {
    playerOne.cards = deck.dealCards(5);
    playerTwo.cards = deck.dealCards(5);
    console.log("New hands are dealt");
  }

  if (playerOne.score >= 5) {
    gameState = 3;
  } else if (playerTwo.score >= 5) {
    gameState = 4;
  }
}


/* Initialize Objects */
let actions = [
  "Choose a card to play face up.",
  "Opponent's card is:",
  "Choose a card to play face down.",
  "YOU WIN!",
  "YOU LOSE!"
]
let gameState = 0;

let deck = new Deck;
let playerOne = new Player("You");
let playerTwo = new Player("Computer");

let playerOneCard = new PlayedCard(new Card("", "", ""), "");
let playerTwoCard = new PlayedCard(new Card("", "", ""), "");

deck.shuffleDeck();

playerOne.cards = deck.dealCards(5);
playerTwo.cards = deck.dealCards(5);


const playerOneHandDisplay = document.querySelector("#playerOneHand");
const playerOneCardDisplay = document.querySelector("#playerOnePlayed");

const playerTwoHandDisplay = document.querySelector("#playerTwoHand");
const playerTwoCardDisplay = document.querySelector("#playerTwoPlayed");

const scoreDisplay = document.querySelector("#score");
const actionDisplay = document.querySelector("div.action p");
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