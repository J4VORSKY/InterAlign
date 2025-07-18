import React from 'react';
import './App.css';

const LabelsBox = ({
  id,
  labels,
  selectedLabel,
  onLabelClick,
  selectedBox,
  selectedPhraseAlignment,
  selectedIndicesA,
  selectedIndicesB,
}) => {
  const isPhraseLabelBox = id === 2;
  const isWordLabelBox = id === 3;

  const isSelectionEmpty = selectedIndicesA.length === 0 || selectedIndicesB.length === 0;

  const getLabelClassName = (label, index) => {
    const classes = ['label'];

    if (selectedLabel === index) classes.push('selected-label');

    if (isWordLabelBox && selectedPhraseAlignment === null) {
      classes.push('not-selected');
    }

    if (isPhraseLabelBox && selectedPhraseAlignment !== null) {
      classes.push('not-selected');
    }

    if (
      isPhraseLabelBox &&
      (
        (isSelectionEmpty && !label.includes('addition')) ||
        (!isSelectionEmpty && label.includes('addition')) ||
        (selectedIndicesA.length === 0 && selectedIndicesB.length === 0)
      )
    ) {
      classes.push('not-selected');
    }

    return classes.join(' ');
  };

  return (
    <>
      <h3>{isPhraseLabelBox ? 'Phrase-level labels' : 'Word-level labels'}</h3>
      <div className={`labels-box ${selectedBox === id ? 'selected-box' : ''}`}>
        {labels.map((label, index) => (
          <span
            key={label}
            className={getLabelClassName(label, index)}
            onClick={() => onLabelClick(index)}
          >
            {label}
          </span>
        ))}
      </div>
    </>
  );
};

export default LabelsBox;
