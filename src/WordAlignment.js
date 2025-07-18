import React, { useMemo } from 'react';

const WordAlignment = ({
  wordListA,
  wordListB,
  alignmentList,
  handleDeletion,
  changeLabelHandler, // Not used here but kept for future use
}) => {
  const sortedAlignments = useMemo(() => {
    return [...alignmentList].sort((a, b) => a.pair[0][0] - b.pair[0][0]);
  }, [alignmentList]);

  const renderWordGroup = (indices, wordList) =>
    indices.map((i) => wordList?.[i]?.word ?? '[?]').join(' ');

  const renderAlignment = (alignment) => (
    <li key={alignment.id} className="word-alignment">
      <span className="label-color">{alignment.label || '[No label]'}:</span>
      <span className="lang-a">{renderWordGroup(alignment.pair[0], wordListA)}</span>
      <span>→</span>
      <span className="lang-b">{renderWordGroup(alignment.pair[1], wordListB)}</span>
      {alignment.note && <span className="note">'{alignment.note}'</span>}
      <span
        className="btn delete-btn"
        onClick={() => handleDeletion(alignment.id)}
      >
        (delete)
      </span>
    </li>
  );

  return <ul>{sortedAlignments.map(renderAlignment)}</ul>;
};

export default WordAlignment;
