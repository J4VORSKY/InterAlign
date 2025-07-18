import React, { useEffect, useState, useRef } from 'react';
import TextBox from './TextBox';
import Alignments from './Alignments';
import LabelsBox from './LabelsBox';
import NoteBox from './NoteBox';
import UploadButton from './UploadButton';
import './App.css';

class Word {
  constructor(word, index, isSelected, isInput) {
    this.word = word; // The word string
    this.index = index; // The index of the word
    this.isSelected = isSelected; // Flag indicating if the word is currently selected
    this.isInSelectedAlignment = false; // Flag indicating if the word is in a selected alignment
    this.isWordAligned = false;
    this.isPhraseAligned = false;
    this.isFocused = false;
    this.phrasePositionClass = '';
    this.isInput = isInput;
  }

  makeAligned(type) {
    this.isSelected = false;
    this.alignmentType = type;
  }

  isAligned() {
    return this.alignmentType !== null;
  }
}

class Alignment {
  constructor(indexListA, indexListB, label, labelIndex, id, parent, note) {
    this.pair = [
      indexListA.sort((a, b) => a - b),
      indexListB.sort((a, b) => a - b),
    ];
    this.label = label;
    this.labelIndex = labelIndex;
    this.parent = parent;
    this.note = note;
    this.id = id;
  }
}

const getAlignmentType = (alignment) => {
  return ['possible', 'sure'].includes(alignment.label) ? 'word' : 'phrase';
};

const canStartPhraseSelection = (currentIndex, wordList) => {
  return !wordList[currentIndex].isPhraseAligned;
};

const canAddToPhraseSelection = (currentIndex, wordList, selectedIndices) => {
  if (wordList[currentIndex].isPhraseAligned) {
    return false;
  }

  if (selectedIndices.length > 0) {
    const lastIndex = Math.max(...selectedIndices);
    const firstIndex = Math.min(...selectedIndices);

    return currentIndex === lastIndex + 1 || currentIndex === firstIndex - 1;
  }

  return false;
};

const App = () => {
  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');

  const mapToWords = (text) =>
    text.split(' ').map((token, index) => new Word(token, index, false, false));

  const [selectedWordsA, setSelectedWordsA] = useState([]);
  const [selectedWordsB, setSelectedWordsB] = useState([]);

  const [selectedWordAlignment, setSelectedWordAlignment] = useState(null);
  const [selectedPhraseAlignment, setSelectedPhraseAlignment] = useState(null);

  const [alignedPairs, setAlignedPairs] = useState([]);
  const [selectedPhraseLabel, setSelectedPhraseLabel] = useState(0);
  const [selectedWordLabel, setSelectedWordLabel] = useState(0);

  const [focusedWordA, setFocusedWordA] = useState(0);
  const [focusedWordB, setFocusedWordB] = useState(0);

  const [selectedBox, setSelectedBox] = useState(0);

  const [alignmentIndex, setAlignmentIndex] = useState(0);

  const [inputValue, setInputValue] = useState('');

  const [inputCount, setInputCount] = useState(0);
  const [wordInputValue, setWordInputValue] = useState('');

  const scrollableRefA = useRef(null);
  const scrollableRefB = useRef(null);

  let newSelectedBox = selectedBox;

  const phraseLabels = [
    'translation',
    'reformulation - generalization',
    'reformulation - summarization',
    'reformulation - paraphrase',
    'addition - extra information',
    'addition - pragmatically uninformative',
    'replacement',
  ];
  const wordLabels = ['sure', 'possible'];

  const getAlignmentOf = (index, i) => {
    let result = [];
    for (let a of alignedPairs) {
      if (a.pair[i].includes(index)) result.push(a);
    }
    return result;
  };

  const getPhraseAlignmentOf = (index, i) => {
    const alignments = getAlignmentOf(index, i).filter(
      (a) => getAlignmentType(a) === 'phrase'
    );

    return alignments.length !== 0 ? alignments[0] : null;
  };

  const setAttributesToBox = (wordList, selectedWords, focusedWord, i) => {
    wordList.forEach((word) => {
      if (selectedWords.includes(word.index)) word.isSelected = true;

      const wordAlignment = getAlignmentOf(word.index, i);
      for (const a of wordAlignment) {
        word.isWordAligned = getAlignmentType(a) === 'word' ? true : false;
        word.isPhraseAligned = getAlignmentType(a) === 'phrase' ? true : false;
      }

      if (
        selectedPhraseAlignment !== null &&
        selectedPhraseAlignment.pair[i].includes(word.index)
      )
        word.isInSelectedAlignment = true;

      if (word.index === focusedWord) {
        word.isFocused = true;
      }
    });

    alignedPairs
      .filter((a) => getAlignmentType(a) === 'phrase')
      .forEach((a) => {
        if (a.pair[i].length === 1) {
          const wordIndex = a.pair[i][0];
          if (!wordList[wordIndex]) return;
          wordList[wordIndex].phrasePositionClass = 'alone-phrase-position';
        } else {
          for (let j = 0; j < a.pair[i].length; j++) {
            const wordIndex = a.pair[i][j];
            if (!wordList[wordIndex]) break;
            if (j === 0) {
              wordList[wordIndex].phrasePositionClass = 'left-phrase-position';
            } else if (j === a.pair[i].length - 1) {
              wordList[wordIndex].phrasePositionClass = 'right-phrase-position';
            } else {
              wordList[wordIndex].phrasePositionClass = 'middle-phrase-position';
            }
          }
        }
      });
  };

  let wordListA = mapToWords(textA);
  setAttributesToBox(wordListA, selectedWordsA, focusedWordA, 0);

  let wordListB = mapToWords(textB);
  setAttributesToBox(wordListB, selectedWordsB, focusedWordB, 1);

  const scrollToAlignment = (alignmentId, word0Id, word1Id) => {
    const alignmentElement = document.getElementById(`alignment-${alignmentId}`);
    
    if (!alignmentElement) return;

    const topPos = alignmentElement.offsetTop;

    const scrollableElement = document.getElementById('alignments');

    if (!scrollableElement) return;

    scrollableElement.scrollTop = topPos - 684;

    const word0Element = document.getElementById(`word-0-${word0Id}`);
    const word1Element = document.getElementById(`word-1-${word1Id}`);

    if (!word0Element || !word1Element) return;

    const leftPos0 = word0Element.offsetLeft;
    const leftPos1 = word1Element.offsetLeft;

    const scrollableBoxA = document.getElementById('text-box-0');
    const scrollableBoxB = document.getElementById('text-box-1');

    if (!scrollableBoxA || !scrollableBoxB) return;

    console.log(leftPos0, scrollableBoxA.scrollLeft);

    if (leftPos0 < scrollableBoxA.scrollLeft || leftPos0 > scrollableBoxA.scrollLeft + scrollableBoxA.offsetWidth) {
      scrollableBoxA.scrollLeft = leftPos0 - 70;
      console.log('scrolling left');
    }

    if (leftPos1 < scrollableBoxB.scrollLeft || leftPos1 > scrollableBoxB.scrollLeft + scrollableBoxB.offsetWidth) {
      scrollableBoxB.scrollLeft = leftPos1 - 70;
      console.log('scrolling right');
    }
  };

  const handleSelectionInA = (currentIndex) => {
    handleSelection(
      currentIndex,
      focusedWordB,
      selectedWordsA,
      setSelectedWordsA,
      selectedWordsB,
      setSelectedWordsB,
      setFocusedWordA,
      setFocusedWordB,
      wordListA,
      0
    );
  };

  const handleSelectionInB = (currentIndex) => {
    handleSelection(
      currentIndex,
      focusedWordA,
      selectedWordsB,
      setSelectedWordsB,
      selectedWordsA,
      setSelectedWordsA,
      setFocusedWordB,
      setFocusedWordA,
      wordListB,
      1
    );
  };

  const handleSelection = (
    currentIndex,
    otherIndex,
    selectedIndices,
    setSelectedIndices,
    otherIndices,
    setOtherIndices,
    setFocusedWord,
    setOtherFocusedWord,
    wordList,
    boxId
  ) => {
    const wordAlignment = getPhraseAlignmentOf(currentIndex, boxId);

    if (wordAlignment !== null) {
      scrollToAlignment(wordAlignment.id, wordAlignment.pair[0][0], wordAlignment.pair[1][0]);

      setSelectedPhraseAlignment(wordAlignment);
      const indicesInOtherPhrase = wordAlignment.pair[(boxId + 1) % 2];

      if (!indicesInOtherPhrase.includes(otherIndex))
        setOtherFocusedWord(indicesInOtherPhrase[0]);

      setSelectedIndices([]);
      setOtherIndices([]);
    } else {
      setSelectedIndices(
        handlePhraseSelection(currentIndex, wordList, selectedIndices)
      );
      setSelectedPhraseAlignment(null);
    }

    setFocusedWord(currentIndex);
    setSelectedBox(boxId);
  };

  const handlePhraseSelection = (currentIndex, wordList, selectedIndices) => {
    if (canAddToPhraseSelection(currentIndex, wordList, selectedIndices)) {
      return [...selectedIndices, currentIndex].sort((a, b) => a - b);
    } else if (canStartPhraseSelection(currentIndex, wordList)) {
      return [currentIndex];
    }
  };

  const handlePhraseLabelClick = (label) => {
    if (
      selectedPhraseAlignment === null &&
      (selectedWordsA.length !== 0 || selectedWordsB.length !== 0)
    ) {
      setSelectedPhraseLabel(label);
      setSelectedBox(2);
    }
  };

  const handleWordLabelClick = (label) => {
    if (selectedPhraseAlignment !== null) {
      setSelectedWordLabel(label);
      setSelectedBox(3);
    }
  };

  const fixAlignmentIndicesA = (selectedWordsA) => {
    const newAlignedPairs = alignedPairs.map((alignment) => new Alignment(
        alignment.pair[0].map((index) => index - selectedWordsA.length * (index > selectedWordsA[0])),
        alignment.pair[1],
        alignment.label,
        alignment.labelIndex,
        alignment.id,
        alignment.parent,
        alignment.note
      )
    );
  
    setAlignedPairs(newAlignedPairs);
  };

  const fixAlignmentIndicesB = (selectedWordsB) => {
    const newAlignedPairs = alignedPairs.map((alignment) => new Alignment(
        alignment.pair[0],
        alignment.pair[1].map((index) => index - selectedWordsB.length * (index > selectedWordsB[0])),
        alignment.label,
        alignment.labelIndex,
        alignment.id,
        alignment.parent,
        alignment.note
      )
    );
  
    setAlignedPairs(newAlignedPairs);
  };

  const handleWordDelection = () => {
    fixAlignmentIndicesA(selectedWordsA);
    fixAlignmentIndicesB(selectedWordsB);
    setTextA1(textA.split(" ").filter((word, index) => !selectedWordsA.includes(index)).join(" "));
    setTextB1(textB.split(" ").filter((word, index) => !selectedWordsB.includes(index)).join(" "));
    setSelectedWordsA([]);
    setSelectedWordsB([]);
  };

  const handleWordAddition = () => {
    if (inputCount === 0) {
      const position = selectedWordsA.slice(-1)[0] + 1;
      const tokens = textA.split(" ");
      setTextA1([...tokens.slice(0, position), "<INPUT>", ...tokens.slice(position)].join(" "));
      console.log("Ahoj")
      setInputCount(1);
    }
  };

  const handleWordChange = () => {
    const newTextA = textA.split(" ").map((word, index) => word === "<INPUT>" ? wordInputValue : word).join(" ");
    setTextA1(newTextA);
    console.log(wordInputValue);
    setInputCount(0);
  };

  const nextTabSelection = () => {
    return (newSelectedBox + 1) % 6;
  };

  const canMove = (currentIndex, boundLeft, boundRight) => {
    return currentIndex >= boundLeft && currentIndex <= boundRight;
  };

  useEffect(() => {
    const jsonData = JSON.parse(localStorage.getItem('stateData'));

    if (!jsonData)
      return;

    setTextA(jsonData.textA);
    setTextB(jsonData.textB);
    setSelectedWordsA(jsonData.selectedWordsA);
    setSelectedWordsB(jsonData.selectedWordsB);
    setSelectedWordAlignment(jsonData.selectedWordAlignment);
    setSelectedPhraseAlignment(jsonData.selectedPhraseAlignment);
    setAlignedPairs(jsonData.alignedPairs);
    setSelectedPhraseLabel(jsonData.selectedPhraseLabel);
    setSelectedWordLabel(jsonData.selectedWordLabel);
    setFocusedWordA(jsonData.focusedWordA);
    setFocusedWordB(jsonData.focusedWordB);
    setAlignmentIndex(jsonData.alignmentIndex);
  }, []);

  useEffect(() => {
    const stateData = {
      textA,
      textB,
      selectedWordsA,
      selectedWordsB,
      selectedWordAlignment,
      selectedPhraseAlignment,
      alignedPairs,
      selectedPhraseLabel,
      selectedWordLabel,
      focusedWordA,
      focusedWordB,
      alignmentIndex,
    };

    if (stateData.textA === '') {
      return;
    }

    localStorage.setItem('stateData', JSON.stringify(stateData, null, 2));
  }, [textA,
    textB,
    selectedWordsA,
    selectedWordsB,
    selectedWordAlignment,
    selectedPhraseAlignment,
    alignedPairs,
    selectedPhraseLabel,
    selectedWordLabel,
    focusedWordA,
    focusedWordB,
    alignmentIndex
  ]);
    
    useEffect(() => {
    const handleKeyPress = (event) => {
      let selectedIndices =
        selectedBox === 0 ? [...selectedWordsA] : [...selectedWordsB];
      const setSelectedIndices =
        selectedBox === 0 ? setSelectedWordsA : setSelectedWordsB;

      const setOtherIndices =
        selectedBox !== 0 ? setSelectedWordsA : setSelectedWordsB;

      const wordList = selectedBox === 0 ? wordListA : wordListB;

      const focusedWord = selectedBox === 0 ? focusedWordA : focusedWordB;
      const setFocusedWord =
        selectedBox === 0 ? setFocusedWordA : setFocusedWordB;

      if (event.key === 'd') {
        handleWordDelection();
      } else if (event.key === 'a') {
        handleWordAddition();
      } else if (event.key === ' ') {
        handleWordChange();
      } else if (event.key === "Escape") {
        setSelectedIndices([]);
        setOtherIndices([]);
        setSelectedPhraseAlignment(null);
        setSelectedBox(0);
      } else if (event.key === 'Enter') {
        handleAlignment();
      } else if (event.key === 'ArrowDown') {
        setSelectedIndices([]);
        setOtherIndices([]);
        setSelectedPhraseAlignment(null);
      } else if (event.key === 'ArrowUp') {
        const phraseA = getPhraseAlignmentOf(focusedWord, selectedBox);

        setSelectedPhraseAlignment(phraseA);
      } else if (event.key === 'Tab') {
        event.preventDefault();
        setSelectedBox(nextTabSelection());
      } else if (event.shiftKey) {
        if (selectedBox !== 0 && selectedBox !== 1) {
          return;
        }

        if (canStartPhraseSelection(focusedWord, wordList)) {
          setSelectedIndices([focusedWord]);
        }

        if (event.key === 'ArrowRight') {
          event.preventDefault();
          if (newSelectedBox === 2) {
          } else if (newSelectedBox === 3) {
          } else {
            const newIndex = focusedWord + 1;

            if (canMove(newIndex, 0, wordList.length - 1)) {
              if (wordList[newIndex].isPhraseAligned) return;

              if (selectedIndices.includes(newIndex)) {
                setSelectedIndices(selectedIndices.slice(1));
              } else {
                setSelectedIndices(
                  handlePhraseSelection(newIndex, wordList, selectedIndices)
                );
              }
              setFocusedWord(newIndex);
            }
          }
        }

        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          if (newSelectedBox === 2) {
          } else if (newSelectedBox === 3) {
          } else {
            const newIndex = focusedWord - 1;

            if (canMove(newIndex, 0, wordList.length - 1)) {
              if (wordList[newIndex].isPhraseAligned) return;

              if (selectedIndices.includes(newIndex)) {
                setSelectedIndices(
                  selectedIndices.slice(0, selectedIndices.length - 1)
                );
              } else {
                setSelectedIndices(
                  handlePhraseSelection(newIndex, wordList, selectedIndices)
                );
              }
              setFocusedWord(newIndex);
            }
          }
        }
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        if (selectedBox === 0 || selectedBox === 1) {
          const newIndex = focusedWord + 1;
          if (canMove(newIndex, 0, wordList.length - 1)) {
            setFocusedWord(newIndex);
            setSelectedIndices([]);
          }
        } else if (selectedBox === 2) {
          const newIndex = selectedPhraseLabel + 1;
          if (canMove(newIndex, 0, phraseLabels.length - 1)) {
            setSelectedPhraseLabel(newIndex);
          }
        } else if (selectedBox === 3) {
          const newIndex = selectedWordLabel + 1;
          if (canMove(newIndex, 0, wordLabels.length - 1)) {
            setSelectedWordLabel(newIndex);
          }
        }
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        if (selectedBox === 0 || selectedBox === 1) {
          const newIndex = focusedWord - 1;
          if (canMove(newIndex, 0, wordList.length - 1)) {
            setFocusedWord(newIndex);
            setSelectedIndices([]);
          }
        } else if (selectedBox === 2) {
          const newIndex = selectedPhraseLabel - 1;
          if (canMove(newIndex, 0, phraseLabels.length - 1)) {
            setSelectedPhraseLabel(newIndex);
          }
        } else if (selectedBox === 3) {
          const newIndex = selectedWordLabel - 1;
          if (canMove(newIndex, 0, wordLabels.length - 1)) {
            setSelectedWordLabel(newIndex);
          }
        }
      }
    };

    // Add event listener when component mounts
    window.addEventListener('keydown', handleKeyPress);

    // Clean up event listener when component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedPhraseAlignment,
    selectedWordsA,
    selectedWordsB,
    selectedPhraseLabel,
    selectedWordLabel,
    alignedPairs,
    focusedWordA,
    focusedWordB,
    selectedBox,
    inputValue,
    wordInputValue,
  ]);

  useEffect(() => {
    // Event listener to handle text selection
    const handleMouseSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) {
        
        const startInd = selection.anchorNode.parentNode.getAttribute('wordId');
        const endInd = selection.focusNode.parentNode.getAttribute('wordId');

        const textBoxId = parseInt(selection.anchorNode.parentNode.parentNode.parentNode.getAttribute('textBoxId'));

        if (startInd !== null && endInd !== null) {
          const startIndex = Math.min(startInd, endInd);
          const endIndex = Math.max(startInd, endInd);
  
          const wordList = textBoxId === 0 ? wordListA : wordListB;

          const setFocusedWord = textBoxId === 0 ? setFocusedWordA : setFocusedWordB;
          const setSelectedIndices =
            textBoxId === 0 ? setSelectedWordsA : setSelectedWordsB;

          const isPhraseAligned = wordList.slice(startIndex, endIndex + 1).some((word) => 
            word.isPhraseAligned
          );

          if (!isPhraseAligned) {
            setFocusedWord(endIndex);
            const indexArray = [];
            for (let i = startIndex; i <= endIndex; i++) {
              indexArray.push(i);
            }
            setSelectedPhraseAlignment(null);
            setSelectedIndices(indexArray);
            setSelectedBox(textBoxId);
          }
        }
      }
    };

    // Attach event listener to the document
    document.addEventListener('mouseup', handleMouseSelection);

    // Cleanup by removing event listener when component unmounts
    return () => {
      document.removeEventListener('mouseup', handleMouseSelection);
    };
  }, [wordListA, wordListB]); // Empty dependency array ensures this effect runs only once on mount

  const handleAlignment = () => {
    let newAlignment = null;
    if (selectedPhraseAlignment === null) {
      if (selectedWordsA.length === 0 && selectedWordsB.length === 0) {
        alert(
          'Please select words from at least one box and a label to align pairs.'
        );
        return;
      }

      newAlignment = new Alignment(
        selectedWordsA,
        selectedWordsB,
        phraseLabels[selectedPhraseLabel],
        selectedPhraseLabel,
        alignmentIndex,
        selectedPhraseAlignment,
        inputValue
      );

      setAlignmentIndex(alignmentIndex + 1);
      setSelectedPhraseAlignment(newAlignment);
    } else {
      newAlignment = new Alignment(
        [focusedWordA],
        [focusedWordB],
        wordLabels[selectedWordLabel],
        selectedWordLabel,
        alignmentIndex,
        selectedPhraseAlignment,
        inputValue
      );

      setAlignmentIndex(alignmentIndex + 1);
    }
    setInputValue('');
    setSelectedBox(0);
    setAlignedPairs([...alignedPairs, newAlignment]);

    setSelectedWordsA([]);
    setSelectedWordsB([]);
  };

  // Function to handle input value change
  const handleInputChange = (e) => {
    setInputValue(e.target.value); // Update the input value state
  };

  const handleInputClick = () => {
    setSelectedBox(4);
  };

  const handleDeletion = (alignmentId) => {
    if (selectedPhraseAlignment !== null && selectedPhraseAlignment.id === alignmentId) {
      setSelectedPhraseAlignment(null);
    }
    setAlignedPairs(
      alignedPairs
        .filter((a) => a.id !== alignmentId)
        .filter((a) => !(a.parent !== null && a.parent.id === alignmentId))
    );
  };

  const handleDownload = () => {
    // Gather all state values into an object
    const stateData = {
      textA,
      textB,
      selectedWordsA,
      selectedWordsB,
      selectedWordAlignment,
      selectedPhraseAlignment,
      alignedPairs,
      selectedPhraseLabel,
      selectedWordLabel,
      focusedWordA,
      focusedWordB,
      alignmentIndex,
    };

    // Convert the object to JSON
    const jsonData = JSON.stringify(stateData, null, 2);

    // Create a Blob from the JSON data
    const blob = new Blob([jsonData], { type: 'application/json' });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a temporary <a> element to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'state_data.json';

    // Append the <a> element to the DOM and trigger a click event
    document.body.appendChild(a);
    a.click();

    // Clean up by removing the <a> element and revoking the URL
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const setTextA1 = (textA) => {
    setTextA(textA);
    wordListA = mapToWords(textA);
    console.log(wordListA);
    setAttributesToBox(wordListA, selectedWordsA, focusedWordA, 0);
  };

  const setTextB1 = (textB) => {
    setTextB(textB);
    wordListB = mapToWords(textB);
    setAttributesToBox(wordListB, selectedWordsB, focusedWordB, 1);
  };

  return (
    <div className="app">
      <UploadButton
        setTextA={setTextA1}
        setTextB={setTextB1}
        setSelectedWordsA={setSelectedWordsA}
        setSelectedWordsB={setSelectedWordsB}
        setSelectedWordAlignment={setSelectedWordAlignment}
        setSelectedPhraseAlignment={setSelectedPhraseAlignment}
        setAlignedPairs={setAlignedPairs}
        setSelectedPhraseLabel={setSelectedPhraseLabel}
        setSelectedWordLabel={setSelectedWordLabel}
        setFocusedWordA={setFocusedWordA}
        setFocusedWordB={setFocusedWordB}
        setAlignmentIndex={setAlignmentIndex}
      />
      <TextBox
        id={0}
        title="Box A"
        ref={scrollableRefA}
        wordList={wordListA}
        onWordClick={handleSelectionInA}
        onWordChange={setWordInputValue}
        selectedPhraseAlignment={selectedPhraseAlignment}
        selectedBox={selectedBox}
      />
      <TextBox
        id={1}
        title="Box B"
        ref={scrollableRefB}
        wordList={wordListB}
        onWordClick={handleSelectionInB}
        onWordChange={setWordInputValue}
        selectedPhraseAlignment={selectedPhraseAlignment}
        selectedBox={selectedBox}
      />
      <LabelsBox
        id={2}
        labels={phraseLabels}
        selectedLabel={selectedPhraseLabel}
        onLabelClick={handlePhraseLabelClick}
        selectedBox={selectedBox}
        selectedPhraseAlignment={selectedPhraseAlignment}
        selectedIndicesA={selectedWordsA}
        selectedIndicesB={selectedWordsB}
      />
      <LabelsBox
        id={3}
        labels={wordLabels}
        selectedLabel={selectedWordLabel}
        onLabelClick={handleWordLabelClick}
        selectedBox={selectedBox}
        selectedPhraseAlignment={selectedPhraseAlignment}
        selectedIndicesA={selectedWordsA}
        selectedIndicesB={selectedWordsB}
      />
      <NoteBox
        id={4}
        handleInputClick={handleInputClick}
        handleInputChange={handleInputChange}
        inputValue={inputValue}
        selectedBox={selectedBox}
      />
      <button
        className={`btn-align-pairs ${selectedBox === 5 ? 'selected-box' : ''}`}
        onClick={handleAlignment}
      >
        Align Pairs
      </button>
      <Alignments
        wordListA={wordListA}
        wordListB={wordListB}
        alignments={alignedPairs}
        selectedPhraseAlignment={selectedPhraseAlignment}
        handleDeletion={handleDeletion}
      />
      <button className={`btn-upload btn-download`} onClick={handleDownload}>
        Download alignment
      </button>
    </div>
  );
};

export default App;
