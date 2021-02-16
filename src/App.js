import "./App.css";
import React, { Component, useState, useEffect } from "react";
import reactDOM from "react-dom";

function Header(props) {
  return (
    <header className="App-header">
      <h1 className="heading game">Blackjack</h1>
      <h2 className="sub-heading game">By Mehraan Ahmed Khan</h2>
      <div>
        <button className="menu-btn" onClick={props.onMenuClick}>
          Main menu
        </button>
        <button
          className="menu-btn"
          onClick={() => props.onClick(props.players)}
        >
          New Round
        </button>
      </div>
    </header>
  );
}
function MainMenu(props) {
  let [playerNames, setPlayerNames] = useState(() => {
    if (props.players)
      return props.players.map((player) => {
        return player.playerName;
      });
    else return [];
  });
  let [newPlayer, setNewPlayer] = useState("");
  let inputRef = React.createRef();

  useEffect(() => {
    inputRef.current.focus();
  }, [newPlayer]);

  function addPlayerName(playerName) {
    let newPlayerNames = [...playerNames];
    newPlayerNames.push(playerName);
    setPlayerNames(newPlayerNames);
    setNewPlayer("");
  }

  function handleChange(event) {
    setNewPlayer(event.target.value);
  }
  function removePlayerName(indexToRemove) {
    let newPlayerNames = playerNames
      .filter((playerName, index) => {
        if (index !== indexToRemove) {
          return playerName;
        }
      })
      .map((playerName) => {
        return playerName;
      });
    setPlayerNames(newPlayerNames);
  }
  return (
    <div>
      <header className="App-header">
        <h1 className="heading">Blackjack</h1>
        <h2 className="sub-heading">By Mehraan Ahmed Khan</h2>
        <button
          className="start-btn"
          onClick={() => props.onNewGame(playerNames)}
          disabled={playerNames.length === 0 ? true : false}
        >
          Start Game
        </button>
      </header>
      <body>
        <table className="main-menu">
          <tbody>
            <tr>
              <td>
                <div className="add-player">
                  <form onSubmit={() => addPlayerName(newPlayer)}>
                    <input
                      placeholder="New player name"
                      onChange={handleChange}
                      className="player-input"
                      value={newPlayer}
                      ref={inputRef}
                    />

                    <button
                      className="add-btn"
                      onClick={() => addPlayerName(newPlayer)}
                      disabled={newPlayer ? false : true}
                    >
                      Add
                    </button>
                  </form>
                </div>
                <h6 className="list-heading">Players</h6>
                <ol className="player-list">
                  {playerNames.length === 0 ? (
                    <div style={{ textAlign: "center", color: "red" }}>
                      Please add a player
                    </div>
                  ) : (
                    playerNames.map((playerName, index) => {
                      return (
                        <li>
                          {playerName}
                          <button
                            className="remove-btn"
                            onClick={() => {
                              removePlayerName(index);
                            }}
                          >
                            X
                          </button>
                        </li>
                      );
                    })
                  )}
                </ol>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </div>
  );
}

function Card(props) {
  let [suit, setSuit] = useState(props.suit);
  let [value, setValue] = useState(props.value);

  //suit useEffect
  useEffect(() => {
    if (props.suit !== suit) {
      setSuit(props.suit);
    }
  }, [props.suit]);
  //value useEffect
  useEffect(() => {
    if (props.value !== value) {
      setValue(props.value);
    }
  }, [props.value]);
  return (
    <div
      className={
        !suit || !value
          ? "card card-flipped"
          : suit === "♥" || suit === "♦"
          ? "card color-red"
          : "card color-black"
      }
    >
      <table className="card-main-container">
        <tbody>
          <tr className="card-top">
            <td>{value}</td>
          </tr>
          <tr className="card-middle">
            <td>{suit}</td>
          </tr>
          <tr className="card-bottom">
            <td>{value}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
function PlayerSeat(props) {
  let [players, setPlayers] = useState(props.players);
  let focusElem = React.createRef();
  //players useEffect
  useEffect(() => {
    if (props.players !== players) {
      setPlayers(props.players);
      props.players.forEach((player) => {
        if (player.currentPlayer) {
          document
            .getElementById(`player-block-${player.key}`)
            .scrollIntoView({ behavior: "smooth" });
        }
      });
    }
  }, [props.players]);

  let renderPlayers = players.map((player, index) => {
    let labelClass = "";
    if (player.status === "W") labelClass = "color-green";
    else if (player.status === "S") labelClass = "color-yellow";
    else if (player.status === "L") labelClass = "color-red";

    return (
      <div id={`player-block-${player.key}`} className="player-block">
        <div className={player.currentPlayer ? "hand current-player" : "hand"}>
          {player.type === "D" ? (
            <div className="player-label">
              {player.playerName}
              {!player.currentPlayer ? null : ` - ${player.score}`}
            </div>
          ) : (
            <div className={`player-label ${labelClass}`}>
              {player.playerName} - {player.score} -{" "}
              {player.statusMessage === "0" ? "Playing" : player.statusMessage}
            </div>
          )}
          <div className="card-container">
            {player.cards.map((card, index) => {
              if (player.type === "D" && !player.currentPlayer && index === 1) {
                return <Card />;
              } else {
                return <Card suit={card.suit} value={card.value} />;
              }
            })}
          </div>
        </div>
        <div className={player.type === "D" ? "hidden" : ""}>
          <button
            className="hit-btn"
            onClick={() => {
              props.onHitMe(player);
            }}
            disabled={
              player.currentPlayer && player.type === "P" ? false : true
            }
          >
            Hit me!
          </button>
          <button
            className="stand-btn"
            onClick={() => {
              props.onStand(player);
            }}
            disabled={
              player.currentPlayer && player.type === "P" ? false : true
            }
          >
            Stand
          </button>
        </div>
      </div>
    );
  });
  let tempPlayers = [];
  let finalPlayers = [];

  renderPlayers.forEach((player, index) => {
    tempPlayers.push(<td className="col-2">{player}</td>);
    //for every 2nd element
    if ((index + 1) % 2 === 0 || index === renderPlayers.length - 1) {
      finalPlayers.push(<tr className="player-row">{tempPlayers}</tr>);
      tempPlayers = [];
    }
  });
  return finalPlayers;
}

class Deck {
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
class Player {
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
export default function App() {
  let [players, setPlayers] = useState([]);
  let [dealer, setDealer] = useState("");
  let [status, setStatus] = useState("MENU");
  let [deck, setDeck] = useState("");

  useEffect(() => {
    //If the dealers turn then deal to dealer
    if (dealer.currentPlayer) {
      playDealer();
    }
  }, [dealer.currentPlayer]);

  useEffect(() => {
    if (deck) {
      if (deck.cards.length < 5) {
        setDeck(addDeck(deck));
      }
    }
  }, [deck]);

  function drawCard() {
    let newDeck = { ...deck };
    let cardToReturn = newDeck.cards.pop();
    setDeck(newDeck);
    return cardToReturn;
  }

  function newGame(playerNames) {
    //create deck
    let deck = new Deck();

    //Create players and dealer
    let newPlayers = playerNames.map((playerName, index) => {
      return new Player(playerName, "P", index);
    });
    let newDealer = new Player("Dealer", "D", -1);

    //deal initial cards
    for (let i = 0; i < 2; i++) {
      //deal 1 card to players
      newPlayers.forEach((player) => {
        //If running out of cards, add another deck
        if (deck.cards.length < 5) {
          deck = addDeck(deck);
        }
        player.hit(deck.cards.pop());
      });
      //then deal 1 card to dealer
      newDealer.hit(deck.cards.pop());
    }

    //Check if first player is a winner
    newPlayers[0].currentPlayer = true;
    if (newPlayers[0].status === "W") {
      let ret = nextPlayer(newPlayers[0].key + 1, newPlayers, newDealer);
      newPlayers = ret.players;
      newDealer = ret.dealer;
    }
    setPlayers(newPlayers);
    setDealer(newDealer);
    setStatus("NEW GAME");
    setDeck(deck);
  }

  function hitMe(player) {
    player.hit(drawCard());
    let newStatusMessage = player.statusMessage;
    //If players turn is over, focus on next player
    if (newStatusMessage !== "0") {
      let ret = nextPlayer(player.key + 1, players, dealer);
      setPlayers(ret.players);
      setDealer(ret.dealer);
    }
  }
  function stand(player) {
    player.stand();
    //focus on next player
    let ret = nextPlayer(player.key + 1, players, dealer);
    setPlayers(ret.players);
    setDealer(ret.dealer);
  }
  function playDealer() {
    let newDealer = dealer;
    //pull out only those players whose state is STAND
    let standingPlayers = players
      .filter((player) => {
        return player.statusMessage === "STAND";
      })
      .map((player) => {
        return player;
      });
    if (standingPlayers.length !== 0) {
      //dealer must play because at least one person is standing

      //While dealer has less than 17, he MUST hit
      while (newDealer.score < 17) {
        dealer.hit(drawCard());
      }
      //Finally check each player above to see who wins
      let newPlayers = [...players];
      newPlayers.forEach((player) => {
        //only check the standing players
        if (player.statusMessage === "STAND") {
          if (newDealer.score > 21) {
            player.statusMessage = "WIN! Dealer bust";
            player.status = "W";
          } else if (player.score >= newDealer.score) {
            player.statusMessage = "WIN! You beat the dealer";
            player.status = "W";
          } else {
            player.statusMessage = "Lose! The dealer has a higher score";
            player.status = "L";
          }
        }
      });
      setPlayers(newPlayers);
      setDealer(newDealer);
    }
  }
  function nextPlayer(nextPlayerId, pPlayers, pDealer) {
    let newPlayers = [...pPlayers];
    let newDealer = pDealer;
    if (nextPlayerId === newPlayers.length) {
      newPlayers.forEach((player) => {
        player.currentPlayer = false;
      });
      newDealer.currentPlayer = true;
    } else {
      for (let i = 0; i < newPlayers.length; i++) {
        if (newPlayers[i].key === nextPlayerId) {
          if (newPlayers[i].status === "W") {
            nextPlayer(nextPlayerId + 1, newPlayers, newDealer);
            break;
          } else {
            newPlayers[i].currentPlayer = true;
          }
        } else {
          newPlayers[i].currentPlayer = false;
        }
      }
    }
    return { players: newPlayers, dealer: newDealer };
  }
  function addDeck(pDeck) {
    let newDeck = new Deck();
    pDeck.cards.forEach((card) => {
      newDeck.cards.push(card);
    });

    return newDeck;
  }
  function toMenu() {
    setStatus("MENU");
  }
  return (
    <div className="App">
      {status === "MENU" ? (
        <MainMenu onNewGame={newGame} players={players} />
      ) : (
        <div>
          <Header
            onClick={newGame}
            onMenuClick={toMenu}
            players={players.map((player) => {
              return player.playerName;
            })}
          />
          <div className="App-body">
            <table>
              <tbody>
                <PlayerSeat
                  players={[dealer]}
                  onHitMe={hitMe}
                  onStand={stand}
                />
                <PlayerSeat players={players} onHitMe={hitMe} onStand={stand} />
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
