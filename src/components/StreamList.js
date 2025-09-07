/*
  Course: INT-499 Capstone in Information Technology
  Instructor: John Russel
  Joshua Coman
*/

import React, { useState } from "react";
import { FaFilm } from "react-icons/fa"; // Film icon
import "../styles/StreamList.css";

const StreamList = () => {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");

  const addItem = () => {
    if (input.trim() !== "") {
      setItems([...items, input]);
      console.log(input);
      setInput("");
    }
  };

  return (
    <div className="streamlist-container">
      <h2>My Streaming List</h2>
      <div className="input-group">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a movie or show"
        />
        <button onClick={addItem}>Add</button>
      </div>

      <ul className="horizontal-list">
        {items.map((item, index) => (
          <li key={index}>
            <FaFilm className="item-icon" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StreamList;
