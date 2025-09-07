/*
  Course: INT-499 Capstone in Information Technology
  Instructor: John Russel
  Joshua Coman
*/

import React, { useState, useEffect } from "react";  // ⬅️ add useEffect here
import { FaTrash, FaEdit, FaCheck } from "react-icons/fa";
import './StreamList.css';

export default function StreamList() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  // ⬇️ NEW: Load from LocalStorage when the component first mounts
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("streamlist"));
    if (stored) setItems(stored);
  }, []);

  // ⬇️ NEW: Save items to LocalStorage whenever they change
  useEffect(() => {
    localStorage.setItem("streamlist", JSON.stringify(items));
  }, [items]);

  // Handle adding a new item
  const handleAdd = () => {
    if (input.trim() === "") return;
    if (editingIndex !== null) {
      const updatedItems = [...items];
      updatedItems[editingIndex].text = input;
      setItems(updatedItems);
      setEditingIndex(null);
    } else {
      setItems([...items, { text: input, completed: false }]);
    }
    setInput("");
  };

  const handleDelete = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleEdit = (index) => {
    setInput(items[index].text);
    setEditingIndex(index);
  };

  const handleComplete = (index) => {
    const updatedItems = [...items];
    updatedItems[index].completed = !updatedItems[index].completed;
    setItems(updatedItems);
  };

  return (
    <div className="streamlist-container">
      <h2>StreamList</h2>
      <div className="input-group">
        <input
          type="text"
          value={input}
          placeholder="Enter item..."
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleAdd}>
          {editingIndex !== null ? "Update" : "Add"}
        </button>
      </div>

      <ul className="items-list">
        {items.map((item, index) => (
          <li key={index} className={item.completed ? "completed" : ""}>
            <span>{item.text}</span>
            <div className="item-buttons">
              <button onClick={() => handleComplete(index)} title="Complete">
                <FaCheck />
              </button>
              <button onClick={() => handleEdit(index)} title="Edit">
                <FaEdit />
              </button>
              <button onClick={() => handleDelete(index)} title="Delete">
                <FaTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
