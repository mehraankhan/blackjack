export default class Player {
  constructor(playerName, type, key) {
    this.props = {
      key: key,
      playerName: playerName,
      cards: [], //array of cards
      type: type,
      statusMessage: "0", //0 means game in progress
      status: "P", //(P)rogress, (W)in, (L)ose
      currentPlayer: false,
    };
  }
  //getters
  get key() {
    return this.props.key;
  }
  get cards() {
    return this.props.cards;
  }
  //score is derived
  get score() {
    let score = 0;
    let numberOfA = 0;
    for (let i = 0; i < this.cards.length; i++) {
      let val = 0;
      switch (this.cards[i].value) {
        case "A":
          val = 11;
          numberOfA++;
          break;
        case "J":
          val = 10;
          break;
        case "Q":
          val = 10;
          break;
        case "K":
          val = 10;
          break;
        default:
          val = parseInt(this.cards[i].value);
      }
      score += val;
    }
    if (score > 21) {
      while (score > 21 && numberOfA > 0) {
        score = score - 10;
        numberOfA--;
      }
    }
    return score;
  }
  get playerName() {
    return this.props.playerName;
  }
  get type() {
    return this.props.type;
  }
  get status() {
    return this.props.status;
  }
  get statusMessage() {
    return this.props.statusMessage;
  }
  get currentPlayer() {
    return this.props.currentPlayer;
  }
  set status(status) {
    this.props.status = status;
  }
  set statusMessage(statusMessage) {
    this.props.statusMessage = statusMessage;
  }
  set currentPlayer(currentPlayer) {
    this.props.currentPlayer = currentPlayer;
  }
  //deal card to player hand
  hit(card) {
    this.cards.push(card);
    this.statusMessage = this.determineStatusMessage();
  }
  stand() {
    this.statusMessage = "STAND";
    this.status = "S";
  }
  //determine status of player
  determineStatusMessage() {
    let score = this.score;
    let newStatus;
    if (score > 21) {
      newStatus = "LOSE! You bust.";
      this.status = "L";
    } else if (score === 21) {
      newStatus = "WIN";
      this.status = "W";
    } else if (score < 21 && this.cards.length >= 5) {
      newStatus = "WIN! You have 5 cards and less than 21 score";
      this.status = "W";
    } else {
      newStatus = "0";
      this.status = "P";
    }
    return newStatus;
  }
}
