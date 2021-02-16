import "./App.css";
import React, { Component } from "react";
import reactDOM from "react-dom";

function generateDeck() {
  console.log("generating deck");
  const Suits = ["♠", "♣", "♥", "♦"];
  //const Suits = ["spades", "clubs", "hearts", "diamonds"];
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
      // return new Card(suit, value);
      return <Card suit={suit} value={value} />;
    });
  });
}
class Card extends Component {
  constructor(props) {
    super();
    this.state = {
      suit: props.suit,
      value: props.value,
    };
  }
  get suit() {
    return this.suit;
  }
  get value() {
    return this.value;
  }
  get suitName() {
    switch (this.suit) {
      //  ["♠", "♣", "♥", "♦"];
      case "♠":
        return "Spades";
        break;
      case "♣":
        return "Clubs";
        break;
      case "♥":
        return "Hearts";
        break;
      case "♦":
        return "Diamonds";
        break;
    }
  }
  render() {
    return (
      <div
        className={
          this.state.suit === "♥" || this.state.suit === "♦"
            ? "card card-red"
            : "card card-black"
        }
      >
        <table className="card-main-container">
          <tbody>
            <tr className="card-top">
              <td>{this.state.value}</td>
            </tr>
            <tr className="card-middle">
              <td>{this.state.suit}</td>
            </tr>
            <tr className="card-bottom">
              <td>{this.state.value}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
class Deck {
  constructor(cards = generateDeck()) {
    console.log("In deck constructor", cards);
    this.cards = cards;
  }

  get numberOfCards() {
    return this.cards.length;
  }
  shuffle() {
    for (let i = this.numberOfCards - 1; i > 0; i--) {
      //get a random integer between 0 and i
      const newIndex = Math.floor(Math.random() * (i + 1));
      const oldValue = this.cards[newIndex];
      this.cards[newIndex] = this.cards[i];
      this.cards[i] = oldValue;
    }
  }
}
class Player {
  constructor(playerName, type) {
    this.props = {
      playerName: playerName,
      hand: [],
      type: type,
      state: "0", //0 means game in progress
      currentPlayer: false,
    };
  }

  //getters
  get hand() {
    return this.props.hand;
  }
  get handStr() {
    let ret = "";
    for (let i = 0; i < this.hand.length; i++) {
      ret += `${this.hand[i].value} of ${this.hand[i].suit} | `;
    }
    return ret;
  }
  //score is derived
  get score() {
    //console.log(`about to calculate score for hand `, hand);
    let score = 0;
    let numberOfA = 0;
    for (let i = 0; i < this.hand.length; i++) {
      let val = 0;
      //console.log(hand[i].value);
      switch (this.hand[i].value) {
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
          val = parseInt(this.hand[i].value);
      }
      score += val;
    }
    if (score > 21) {
      while (score > 21 && numberOfA > 0) {
        score = score - 10;
        numberOfA--;
      }
    }
    //console.log("new score is ", score);
    return score;
  }
  get playerName() {
    return this.props.playerName;
  }
  get type() {
    return this.props.type;
  }
  get state() {
    return this.props.state;
  }
  set state(state) {
    this.props.state = state;
  }
  set currentPlayer(currentPlayer) {
    this.setState({ currentPlayer: currentPlayer });
  }

  //deal card to player hand
  addCard(card) {
    this.hand.push(card);
    this.state = this.determineState();
  }
  stand() {
    this.state = "STAND";
  }
  //determine state of player
  determineState() {
    let newState;
    if (this.score > 21) {
      newState = "LOSE! You bust.";
    } else if (this.score === 21) {
      newState = "WIN! You have 21.";
    } else if (this.score < 21 && this.hand.length >= 5) {
      newState = "WIN! You have 5 cards and less than 21 score";
    } else {
      newState = "0";
    }
    return newState;
  }
}
class Blackjack {
  constructor(playerNames) {
    //create and shuffle
    let deck = new Deck();
    deck.shuffle();

    //Create player profiles - map new player objects to the players array
    let players = playerNames.map((playerName) => {
      return new Player(playerName, "P");
    });
    let dealer = new Player("Dealer", "D");
    this.props = {
      players: players,
      dealer: dealer,
      state: 0,
      deck: deck,
    };
    this.dealInitial();
  }
  get players() {
    return this.props.players;
  }
  get dealer() {
    return this.props.dealer;
  }
  get deck() {
    return this.props.deck;
  }
  get drawCard() {
    return this.props.deck.cards.pop();
  }
  get summary() {
    let summary = `Dealers score is ${this.dealer.score} with hand ${this.dealer.handStr}`;

    this.players.forEach((player, index) => {
      summary += `
${player.playerName} score is ${player.score} with hand ${player.handStr} - ${player.state}`;
    });
    return summary;
  }
  dealInitial() {
    //Deal two cards to each player
    this.props.players.forEach((player) => {
      player.addCard(this.drawCard);
    });
    //then deal card to dealer
    this.dealer.addCard(this.drawCard);
    //then players again
    this.props.players.forEach((player) => {
      player.addCard(this.drawCard);
    });
    //lastly dealer
    this.dealer.addCard(this.drawCard);
  }
  getPlayer(index) {
    return this.players[index];
  }
  hit(player) {
    if (player.state === "0") {
      let newCard = this.drawCard;
      player.addCard(newCard);
      console.log(
        `${player.playerName} hit with ${newCard.value} of ${newCard.suit}
      New hand - ${player.hand}
      Score - ${player.score}
      Status - ${player.state}`
      );
    } else {
      console.log(`Player's game is over`);
    }
  }
  stand(player) {
    player.stand();
  }
  playDealer() {
    console.log("In play dealer");

    let dealer = this.dealer;
    console.log(dealer);
    //pull out only those players whose state is STAND
    let standingPlayers = this.players
      .filter((player) => {
        return player.state === "STAND";
      })
      .map((player) => {
        return player;
      });
    console.log(standingPlayers);
    if (standingPlayers.length === 0) {
      console.log("Dealer does not need to play");
    } else {
      //dealer must play because at least one person is standing

      console.log("dealer initial score", dealer.score);
      //While dealer has less than 17, he MUST hit
      while (dealer.score < 17) {
        this.hit(dealer);
      }
      console.log("dealer final score", dealer.score);
      //Finally check each player above to see who wins
      this.players.forEach((player) => {
        //only check the standing players
        if (player.state === "STAND") {
          if (dealer.score > 21) {
            player.state = "WIN! Dealer bust";
          } else if (player.score >= dealer.score) {
            player.state = "WIN! You beat the dealer";
          } else {
            player.state = "Lose! The dealer has a higher score";
          }
        }
      });
      console.log(this.summary);
    }
  }

  //Get the highest score that the dealer needs to be
}
function newGame(playerNames) {
  let newBlackjack = new Blackjack(playerNames);
  return newBlackjack;
}
function getPlayerList(blackjackGame) {
  let playerListHtml = '<select id="playerList" name="players">';

  //-1 for dealer
  for (let i = 0; i < blackjackGame.players.length; i++) {
    console.log(`Player 1 - ${blackjackGame.players[i].playerName}`);
    playerListHtml += `<option value="${i}">${blackjackGame.players[i].playerName}</option>`;
  }
  playerListHtml += "</select>";

  let div = document.createElement("div");
  div.innerHTML = playerListHtml.trim();

  return div;
}
/*
//Initialise player names
let playerNames = ["Billy", "Lemmy", "Andrew", "Carla"];
let blackjackGame = newGame(playerNames);

// 1. Create the button
let newGameButton = document.createElement("button");
newGameButton.innerHTML = "New game";
let hitButton = document.createElement("button");
hitButton.innerHTML = "Hit ";

let standButton = document.createElement("button");
standButton.innerHTML = "Stand";

// 2. Append somewhere
var body = document.getElementById("game");
body.appendChild(newGameButton);
body.appendChild(hitButton);
body.appendChild(standButton);
body.appendChild(getPlayerList(blackjackGame));

// 3. Add event handler
let index = 0;
let currentPlayer = blackjackGame.getPlayer(index);

hitButton.addEventListener("click", function () {
  blackjackGame.hit(currentPlayer);
  if (currentPlayer.state !== "0") {
    index++;
    currentPlayer = blackjackGame.getPlayer(index);
  }
  if (index === blackjackGame.players.length) {
    hitButton.disabled = true;
    console.log("Dealers turn");
    console.log("Dealers turn");
    blackjackGame.playDealer();
  }
});
standButton.addEventListener("click", function () {
  blackjackGame.stand(currentPlayer);
  if (currentPlayer.state !== "0") {
    index++;
    currentPlayer = blackjackGame.getPlayer(index);
  }
  if (index === blackjackGame.players.length) {
    hitButton.disabled = true;
    standButton.disabled = true;
    console.log("Dealers turn");
    blackjackGame.playDealer();
  }
});
*/
export default class App extends Component {
  constructor() {
    super();
    this.state = {
      game: new Blackjack(["Billy", "Lemmy", "Andrew", "Carla"]),
      lastPlayerIndex: 0,
    };

    this.handleNextClick = this.handleNextClick.bind(this);
  }
  get game() {
    return this.state.game;
  }
  handleNextClick() {
    this.setState((prevState) => {
      // let game = { ...prevState.game };
      let game = JSON.parse(JSON.stringify(prevState.game));
      console.log("game is ", game);
      console.log("game players are ", game.players);
      let newPlayerIndex =
        prevState.lastPlayerIndex === game.players.length - 1
          ? 0
          : prevState.lastPlayerIndex + 1;
      game.players[newPlayerIndex].currentPlayer = true;
      return { game: game, lastPlayerIndex: newPlayerIndex };
    });
  }
  render() {
    /*  <h3>{Player.playerName}</h3>
          <div>{player.cards}</div>*/
    let Players = this.state.game.players.map((player) => {
      return (
        <div className={player.currentPlayer ? "hand current-player" : "hand"}>
          <div>{player.playerName}</div>
          <div className="card-container">{player.hand}</div>
        </div>
      );
    });
    let Dealer = (
      <div className="hand">
        <div>{this.state.game.dealer.playerName}</div>
        <div className="card-container">{this.state.game.dealer.hand}</div>
      </div>
    );
    //console.log(this.game);
    //console.log(Players);

    return (
      <div className="App">
        <header className="App-header">Blackjack</header>
        <header className="App-header">
          <button>Hit me!</button>
          <button>Stand</button>
          <button onClick={this.handleNextClick}>Next</button>
        </header>
        <div className="App-body">
          <table>
            <tbody>
              <tr>
                <div className="player-row">{Dealer}</div>
              </tr>
              <tr>
                <td>
                  <div className="player-row">{Players}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
