import React from 'react';
import * as Scale from '@tonaljs/scale';
import * as Chord from '@tonaljs/chord';
import { audioEngine } from '../utils/audio';
import { chordProgressions } from '../utils/progressions';
import './ChordProgression.css';

const ChordProgression = ({ keyNote, scaleType, selectedProgression, onChordClick, selectedOctave = 5 }) => {
  if (!selectedProgression) return null;

  // Get progression data
  const progression = chordProgressions[selectedProgression];
  const scale = Scale.get(`${keyNote} ${scaleType}`);
  
  // Calculate chords
  const getChords = () => {
    if (!scale || !scale.notes || !progression) return [];
    
    return progression.degrees.map(degree => {
      const note = scale.notes[(degree - 1) % 7];
      const chordType = scaleType === 'major'
        ? [1, 4, 5].includes(degree) ? 'maj' : degree === 7 ? 'dim' : 'min'
        : degree === 3 ? 'maj' : 'min';
      return { 
        symbol: `${note}${chordType}`, 
        notes: Chord.get(`${note}${chordType}`).notes 
      };
    });
  };

  const chords = getChords();

  const handleChordClick = (chord) => {
    if (!chord || !chord.notes) return;
    const chordNotes = chord.notes.map(note => `${note}${selectedOctave}`);
    audioEngine.playChord(chordNotes);
    onChordClick(chord.notes);
  };

  return (
    <div className="chord-progression">
      <div className="progression-header">
        <h3>Progression: {progression.name}</h3>
      </div>
      <p>{progression.description}</p>
      <div className="progression-chords">
        {chords.map((chord, index) => (
          <div 
            key={index} 
            className="progression-chord"
            onClick={() => handleChordClick(chord)}
          >
            {chord.symbol}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChordProgression;
