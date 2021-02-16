import React, { Component, useState, useEffect } from "react";
import Card from "./Card";
export default function PlayerSeat(props) {
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
