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
  constructor(name, index) {
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
/* let blankCard = new Card("", "", "");
let blankPlayedCard = new PlayedCard(blankCard, "");
 */
let action = "Choose a card to play face up."
let playerOneCard = new PlayedCard(new Card("", "", ""), "");;
let playerTwoCard = new PlayedCard(new Card("", "", ""), "");;

let deck = new Deck;
deck.shuffleDeck();
let playerOne = new Player("You");
let playerTwo = new Player("Computer");
let players = [playerOne, playerTwo];


playerOne.cards = deck.dealCards(5);
playerTwo.cards = deck.dealCards(5);


const higherButton = document.getElementById("higher");
const equalButton = document.getElementById("equal");
const lowerButton = document.getElementById("lower");
higherButton.onclick = function() {
  playCard(higherButton);
}
equalButton.onclick = function() {
  playCard(equalButton);
}
lowerButton.onclick = function() {
  playCard(lowerButton);
}




/* Display Hand */
const cardDisplay = document.querySelector("div.playerOneHand ol")
function displayCard(card) {

  const li = document.createElement("li");
  const button = document.createElement("button");

  button.innerText = card.id;
  button.onclick = function() {
    playCard(button);
  }
  
  cardDisplay.append(li);
  li.append(button);
}

function displayHand() {
  cardDisplay.textContent = "";
  playerOne.cards.forEach(card => displayCard(card));
}






/* Display action description */
const actionDisplay = document.querySelector("div.action p");
const playerOneCardDisplay = document.querySelector("div.playerOnePlayed");
const playerTwoCardDisplay = document.querySelector("div.playerTwoPlayed");
const playerOneScoreDisplay = document.querySelector("div.playerOneScore");
const playerTwoScoreDisplay = document.querySelector("div.playerTwoScore");

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
  
  actionDisplay.textContent = action;

}
displayGame();


/* Game Functions */
function playCard(cardButton) {
  const playedCard = playerOne.cards.filter(c => c.id === cardButton.innerHTML)[0];
  
  if (action === "Choose a card to play face up.") {
    playerOneCard.card = playedCard;
    playerOneCard.face = "up";
    playerOne.cards = playerOne.cards.filter(c => c.id != cardButton.innerHTML);

    console.log("Player One played " + playedCardText(playerOneCard));



    playerTwoCard.card = playerTwo.cards[Math.floor(Math.random() * playerTwo.cards.length)];
    playerTwoCard.face = "down";
    playerTwo.cards = playerTwo.cards.filter(c => c.id != playerTwoCard.card.id);

    console.log("Player Two played " + playedCardText(playerTwoCard));

    action = "Choose higher, equal, or lower."

  } else if (action === "Choose a card to play face down.") {
    playerOneCard.card = playedCard;
    playerOneCard.face = "down";
    playerOne.cards = playerOne.cards.filter(c => c.id != cardButton.innerHTML);

    console.log("Player One played " + playedCardText(playerOneCard));




    const playerTwoGuessOptions = ["higher", "higher", "higher", "higher", "equal", "lower", "lower", "lower", "lower"];
    const guess = playerTwoGuessOptions[Math.floor(Math.random() * playerTwoGuessOptions.length)];

    console.log("Player Two guessed " + guess);

    playerOneCard.face = "up";
    console.log("Player One played " + playedCardText(playerOneCard));

    const truth = compareCards(playerOneCard.card, playerTwoCard.card);

    console.log("Actual is " + truth);

    if (guess === truth) {
      if (guess === "equal") {
        console.log("Player 2 gains 5 points");
        playerTwo.score += 5;
      } else {
        console.log("Player 2 gains 1 point");
        playerTwo.score += 1;
      }
    } else {
      console.log("Player 1 gains 1 point");
      playerOne.score += 1;    
    }

    playerOneCard = new PlayedCard(new Card("", "", ""), "");;
    playerTwoCard = new PlayedCard(new Card("", "", ""), "");;

    action = "Choose a card to play face up."


  } else if (action === "Choose higher, equal, or lower.") {
    
    const guess = cardButton.id;

    console.log("Player One guessed " + guess);

    playerTwoCard.face = "up";
    console.log("Player Two played " + playedCardText(playerTwoCard));

    const truth = compareCards(playerTwoCard.card, playerOneCard.card);

    console.log("Actual is " + truth);

    if (guess === truth) {
      if (guess === "equal") {
        console.log("Player 1 gains 5 points");
        playerOne.score += 5;
      } else {
        console.log("Player 1 gains 1 point");
        playerOne.score += 1;
      }
    } else {
      console.log("Player 2 gains 1 point");
      playerTwo.score += 1;    
    }

    playerOneCard = new PlayedCard(new Card("", "", ""), "");;
    playerTwoCard = new PlayedCard(new Card("", "", ""), "");;


    playerTwoCard.card = playerTwo.cards[Math.floor(Math.random() * playerTwo.cards.length)];

    playerTwoCard.face = "up";
    playerTwo.cards = playerTwo.cards.filter(c => c.id != playerTwoCard.card.id);

    console.log("Player Two played " + playedCardText(playerTwoCard));



    action = "Choose a card to play face down."
  }

  if (playerOne.cards.length === 0) {
    playerOne.cards = deck.dealCards(5);
    playerTwo.cards = deck.dealCards(5);
    console.log("New hands are dealt");
  }

  if (playerOne.score >= 11) {
    action = "YOU WIN!";
  } else if (playerTwo.score >= 11) {
    action = "YOU LOSE!";
  }

  displayGame();
}



function compareCards(playerCard, guesserCard) {
  if (playerCard.value > guesserCard.value) {
    return "higher";
  } else if (playerCard.value < guesserCard.value) {
    return "lower";
  } else {
    return "equal";
  }
}

