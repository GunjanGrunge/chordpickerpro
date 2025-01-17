import React from 'react';
import { Scale } from 'tonal';
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScaleDisplay;
