import React, { useEffect } from 'react';
import { audioEngine } from '../utils/audio';
import './Piano.css';

const Piano = ({ onNoteClick, selectedNotes, chordPositions = [], selectedOctave = 5 }) => {
  useEffect(() => {
    // Initialize audio engine
    audioEngine.init();
  }, []);

  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const octaves = [4, 5]; // Changed to octaves 4 and 5

  const getKeyClassName = (note, octave) => {
    const fullNote = `${note}${octave}`;
    const classes = [
      'key',
      note.includes('#') ? 'black' : 'white',
      selectedNotes.includes(note) ? 'active' : '',
      octave === selectedOctave ? 'current-octave' : ''
    ];

    const chordPosition = chordPositions.find(pos => pos.note === note);
    if (chordPosition) {
      classes.push('chord-position');
      classes.push(`position-${chordPosition.position}`);
    }

    return classes.filter(Boolean).join(' ');
  };

  const handleNoteClick = (note, octave) => {
    const fullNote = `${note}${octave}`;
    audioEngine.playNote(fullNote);
    onNoteClick(note);
  };

  return (
    <div className="piano-container">
      <div className="piano">
        {octaves.map(octave => (
          <div key={octave} className="octave">
            {notes.map((note) => {
              const isBlack = note.includes('#');
              return (
                <div
                  key={`${note}${octave}`}
                  className={getKeyClassName(note, octave)}
                  onClick={() => handleNoteClick(note, octave)}
                  data-note={`${note}${octave}`}
                >
                  <span className={`note-name ${isBlack ? 'black-key' : 'white-key'}`}>
                    {note}
                  </span>
                  {chordPositions.find(pos => pos.note === note) && (
                    <span className="position-indicator">
                      {chordPositions.find(pos => pos.note === note).position}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Piano;
