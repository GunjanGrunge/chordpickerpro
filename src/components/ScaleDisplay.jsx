import React from 'react';
import { Scale } from 'tonal';
import * as Chord from '@tonaljs/chord';
import { audioEngine } from '../utils/audio';
import './ScaleDisplay.css';

const ScaleDisplay = ({ keyNote, scaleType, onNoteClick, selectedOctave = 5 }) => {
  const scale = Scale.get(`${keyNote} ${scaleType}`);
  
  const getDegreeInfo = (note, index) => {
    const degrees = {
      0: 'I (Tonic)',
      1: 'II (Supertonic)',
      2: 'III (Mediant)',
      3: 'IV (Subdominant)',
      4: 'V (Dominant)',
      5: 'VI (Submediant)',
      6: 'VII (Leading Tone)'
    };
    return degrees[index];
  };

  const getChordNotes = (note, index) => {
    // Use the chord type based on scale degree and scale type
    const chordType = scaleType === 'major'
      ? [0, 3, 4].includes(index) ? 'maj' // I, IV, V are major in major scale
        : index === 6 ? 'dim'            // VII is diminished
        : 'm'                            // Others are minor
      : index === 2 ? 'maj'              // III is major in minor scale
        : 'm';                           // Others are minor in minor scale
    
    const chord = Chord.get(`${note}${chordType}`);
    return chord.notes.join(' - ');
  };

  const handleNoteClick = (note) => {
    const fullNote = `${note}${selectedOctave}`;
    audioEngine.playNote(fullNote);
    if (onNoteClick) {
      onNoteClick(note);
    }
  };

  return (
    <div className="scale-display">
      <div className="scale-info">
        <h3>{keyNote} {scaleType} Scale</h3>
        <div className="scale-notes">
          {scale.notes.map((note, index) => (
            <div 
              key={note} 
              className="scale-note-container"
              onClick={() => handleNoteClick(note)}
            >
              <div className="scale-note">
                {note}
              </div>
              <div className="scale-degree">
                {getDegreeInfo(note, index)}
              </div>
              <div className="chord-notes">
                {getChordNotes(note, index)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScaleDisplay;
