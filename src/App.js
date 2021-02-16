import "./Stylesheets/App.css";
import React, { Component, useState, useEffect } from "react";
import Player from "./Components/Player";
import Card from "./Components/Card";
import Deck from "./Components/Deck";
import Header from "./Components/Header";
import MainMenu from "./Components/MainMenu";
import PlayerSeat from "./Components/PlayerSeat";
import reactDOM from "react-dom";

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
