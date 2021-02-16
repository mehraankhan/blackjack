import React, { Component, useState, useEffect } from "react";
export default function Card(props) {
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
