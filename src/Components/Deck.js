export default class Deck {
  constructor() {
    this.cards = this.generateDeck();
    this.shuffle();
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      //get a random integer between 0 and i
      const newIndex = Math.floor(Math.random() * (i + 1));
      const oldValue = this.cards[newIndex];
      this.cards[newIndex] = this.cards[i];
      this.cards[i] = oldValue;
    }
  }
  generateDeck() {
    const Suits = ["♠", "♣", "♥", "♦"];
    const Values = [
      "A",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
    ];
    return Suits.flatMap((suit) => {
      return Values.map((value) => {
        return { suit, value };
      });
    });
  }
}
