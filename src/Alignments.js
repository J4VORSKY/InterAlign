import React from 'react';
import WordAlignment from './WordAlignment';
import './Alignments.css';

const Alignments = ({
  wordListA,
  wordListB,
  alignments,
  selectedPhraseAlignment,
  handleDeletion,
}) => {
  const phraseAlignments = alignments.filter((a) => a.parent === null);
  const wordAlignments = alignments.filter((a) => a.parent !== null);

  const renderWords = (indices, wordList) =>
    indices.map((i) => wordList?.[i]?.word ?? '[?]').join(' ');

  const isSelected = (alignmentId) =>
    selectedPhraseAlignment?.id === alignmentId;

  return (
    <div id="alignments" className="alignments">
      {[...phraseAlignments].reverse().map((alignment) => (
        <ul
          key={alignment.id}
          id={`alignment-${alignment.id}`}
          className={`alignment ${isSelected(alignment.id) ? 'selected-alignment' : ''}`}
        >
          <li>
            <span className="label-color">{alignment.label}</span>
            <span className="lang-a">{renderWords(alignment.pair[0], wordListA)}</span>
            <span>→</span>
            <span className="lang-b">{renderWords(alignment.pair[1], wordListB)}</span>
            {alignment.note && <span className="note">'{alignment.note}'</span>}
            <span
              className="btn delete-btn"
              onClick={() => handleDeletion(alignment.id)}
            >
              (delete)
            </span>

            <ul>
              <WordAlignment
                wordListA={wordListA}
                wordListB={wordListB}
                alignmentList={wordAlignments.filter(
                  (wa) => wa.parent?.id === alignment.id
                )}
                handleDeletion={handleDeletion}
                changeLabelHandler={null}
              />
            </ul>
          </li>
        </ul>
      ))}
    </div>
  );
};

export default Alignments;
