/* Initialize Classes */
class Card {
  constructor(suit, rank, value) {
    this.suit = suit;
    this.rank = rank;
    this.value = value;
    this.id = this.rank + " " + this.suit
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


/* Initialize Objects */
let actions = [
  "Choose a card to play face up.",
  "Choose higher, equal, or lower.",
  "Choose a card to play face down.",
  "YOU WIN!",
  "YOU LOSE!"
]
let gameState = 0;

let deck = new Deck;
let playerOne = new Player("You");
let playerTwo = new Player("Computer");

let playerOneCard = new PlayedCard(new Card("", "", ""), "");;
let playerTwoCard = new PlayedCard(new Card("", "", ""), "");;

deck.shuffleDeck();

playerOne.cards = deck.dealCards(5);
playerTwo.cards = deck.dealCards(5);


const actionDisplay = document.querySelector("div.action p");

const playerOneScoreDisplay = document.querySelector("div.playerOneScore");
const playerOneHandDisplay = document.querySelector("div.playerOneHand ol");
const playerOneCardDisplay = document.querySelector("div.playerOnePlayed");

const playerTwoScoreDisplay = document.querySelector("div.playerTwoScore");
const playerTwoHandDisplay = document.querySelector("div.playerTwoHand ol");
const playerTwoCardDisplay = document.querySelector("div.playerTwoPlayed");

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


/* Display Functions */
function displayCard(card) {

  const li = document.createElement("li");
  const button = document.createElement("button");

  button.innerText = card.id;
  button.onclick = function() {
    playCard(button);
  }
  
  playerOneHandDisplay.append(li);
  li.append(button);
}

function displayHand() {
  playerOneHandDisplay.textContent = "";
  playerOne.cards.forEach(card => displayCard(card));
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
  displayHand();
  playerOneCardDisplay.textContent = playedCardText(playerOneCard);
  playerTwoCardDisplay.textContent = playedCardText(playerTwoCard);

  playerOneScoreDisplay.textContent = playerOne.score.toString();
  playerTwoScoreDisplay.textContent = playerTwo.score.toString();
  
  actionDisplay.textContent = actions[gameState];

}
displayGame();


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

function playCard(cardButton) {
  
  if (gameState === 0 || gameState === 2) {

    const playedCard = playerOne.cards.filter(c => c.id === cardButton.innerHTML)[0];
    playerOneCard.card = playedCard;
    playerOne.cards = playerOne.cards.filter(c => c.id != cardButton.innerHTML);

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

      playerOneCard = new PlayedCard(new Card("", "", ""), "");;
      playerTwoCard = new PlayedCard(new Card("", "", ""), "");;

      gameState = 0;
    }

    if (playerOne.cards.length === 0) {
      playerOne.cards = deck.dealCards(5);
      playerTwo.cards = deck.dealCards(5);
      console.log("New hands are dealt");
    }

    if (playerOne.score >= 11) {
      gameState = 3;
    } else if (playerTwo.score >= 11) {
      gameState = 4;
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

    playerOneCard = new PlayedCard(new Card("", "", ""), "");;
    playerTwoCard = new PlayedCard(new Card("", "", ""), "");;

    computerPlaysCard("up");

    gameState = 2;
  }

  displayGame();
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

