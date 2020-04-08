class Card {
  constructor(suit, rank, value) {
    this.suit = suit;
    this.rank = rank;
    this.value = value;
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
}



