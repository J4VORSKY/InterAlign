import React, { useRef, useEffect } from 'react';
import './TextBox.css';
import './App.css';

const TextBox = ({
  id,
  title,
  wordList,
  onWordClick,
  onWordChange,
  selectedPhraseAlignment,
  selectedBox,
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    selectedBox === id ? containerRef.current.focus() : containerRef.current.blur();
  }, [selectedBox, id]);

  const getWordClassName = (word) => {
    const {
      isPhraseAligned,
      isWordAligned,
      isInSelectedAlignment,
      phrasePositionClass,
      isSelected,
      isFocused,
    } = word;

    return [
      'word',
      isPhraseAligned && 'phrase-aligned',
      isWordAligned && 'word-aligned',
      selectedPhraseAlignment !== null && !isWordAligned && !isPhraseAligned && 'not-aligned',
      isInSelectedAlignment && 'selected-alignment',
      !isInSelectedAlignment && selectedPhraseAlignment !== null && 'not-selected',
      phrasePositionClass,
      isSelected && 'selected-word',
      isFocused && 'focused-word',
    ]
      .filter(Boolean)
      .join(' ');
  };

  return (
    <div
      className={`text-box ${selectedBox === id ? 'selected-box' : ''}`}
      textBoxId={id}
    >
      <div id={`text-box-${id}`} className="scrollable-box" ref={containerRef}>
        {wordList.map(({ word, index, ...rest }) => (
          word === '<INPUT>' ? (
            <input
              key={index}
              defaultValue={word}
              onChange={(e) => onWordChange(e.target.value)}
            />
          ) : (
            <span
              id={`word-${id}-${index}`}
              key={index}
              wordId={index}
              className={getWordClassName({ word, index, ...rest })}
              onClick={() => onWordClick(index)}
            >
              {word + ' '}
            </span>
          )
        ))}
      </div>
    </div>
  );
};

export default TextBox;
