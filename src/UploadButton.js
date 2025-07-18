import React, { useRef } from 'react';

const UploadButton = ({
  setTextA,
  setTextB,
  setSelectedWordsA,
  setSelectedWordsB,
  setSelectedWordAlignment,
  setSelectedPhraseAlignment,
  setAlignedPairs,
  setSelectedPhraseLabel,
  setSelectedWordLabel,
  setFocusedWordA,
  setFocusedWordB,
  setAlignmentIndex,
}) => {
  const inputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const jsonData = JSON.parse(event.target.result);

        // Apply state setters if data exists
        setTextA?.(jsonData.textA);
        setTextB?.(jsonData.textB);
        setSelectedWordsA?.(jsonData.selectedWordsA);
        setSelectedWordsB?.(jsonData.selectedWordsB);
        setSelectedWordAlignment?.(jsonData.selectedWordAlignment);
        setSelectedPhraseAlignment?.(jsonData.selectedPhraseAlignment);
        setAlignedPairs?.(jsonData.alignedPairs);
        setSelectedPhraseLabel?.(jsonData.selectedPhraseLabel);
        setSelectedWordLabel?.(jsonData.selectedWordLabel);
        setFocusedWordA?.(jsonData.focusedWordA);
        setFocusedWordB?.(jsonData.focusedWordB);
        setAlignmentIndex?.(jsonData.alignmentIndex);

      } catch (error) {
        console.error('Failed to parse JSON:', error);
        alert('Error: Could not load alignment data. Please upload a valid .json file.');
      }
    };

    reader.readAsText(file);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <>
      <button className="btn-upload" onClick={handleClick}>
        Upload alignment
      </button>
      <input
        type="file"
        accept=".json"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        ref={inputRef}
      />
    </>
  );
};

export default UploadButton;
