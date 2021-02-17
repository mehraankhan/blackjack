import React, { Component, useState, useEffect } from "react";
export default function Header(props) {
  return (
    <header className="App-header game-header">
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
