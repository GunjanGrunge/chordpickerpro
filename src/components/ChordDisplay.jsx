import React from 'react';
import * as Chord from '@tonaljs/chord';  // Updated import
import './ChordDisplay.css';

const ChordDisplay = ({ notes }) => {
  const chordName = notes.length > 0 
    ? Chord.detect(notes)[0] || 'Unknown Chord'
    : 'Select notes to form a chord';

  return (
    <div className="chord-display">
      <h2>Current Chord:</h2>
      <div className="chord-name">{chordName}</div>
      <div className="notes">
        Notes: {notes.join(', ') || 'None'}
      </div>
    </div>
  );
};

export default ChordDisplay;
