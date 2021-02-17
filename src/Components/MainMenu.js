import React, { Component, useState, useEffect } from "react";
export default function MainMenu(props) {
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
        <h2 className="sub-heading">by Mehraan Ahmed Khan</h2>
      </header>
      <body>
        <table className="main-menu">
          <tbody>
            <tr>
              {" "}
              <button
                className="start-btn"
                onClick={() => props.onNewGame(playerNames)}
                disabled={playerNames.length === 0 ? true : false}
              >
                Start Game
              </button>
            </tr>
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
                    <div style={{ textAlign: "center" }}>
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
