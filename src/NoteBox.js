import React, { useRef, useEffect } from 'react';
import './TextBox.css';
import './App.css';

const NoteBox = ({
  id,
  handleInputClick,
  handleInputChange,
  inputValue,
  selectedBox,
}) => {
  const inputRef = useRef(null);
  const isSelected = selectedBox === id;

  useEffect(() => {
    if (inputRef.current) {
      isSelected ? inputRef.current.focus() : inputRef.current.blur();
    }
  }, [isSelected]);

  return (
    <div className="note-box">
      <h3>Notes</h3>
      <input
        type="text"
        ref={inputRef}
        className={`text-box ${isSelected ? 'selected-box' : ''}`}
        value={inputValue}
        onChange={handleInputChange}
        onClick={handleInputClick}
        placeholder="Enter note..."
      />
    </div>
  );
};

export default NoteBox;
