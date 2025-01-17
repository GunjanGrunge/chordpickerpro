import React from 'react';
import * as Scale from '@tonaljs/scale';
import * as Chord from '@tonaljs/chord';
import * as Key from '@tonaljs/key';
import { audioEngine } from '../utils/audio';
import './ChordCompatibility.css';

const ChordCompatibility = ({ currentChord, keyNote, scaleType, onChordClick, selectedOctave = 4 }) => {
  const getChordRelations = () => {
    if (!keyNote) return [];
    
    const key = Key.majorKey(keyNote);
    const scale = Scale.get(`${keyNote} ${scaleType}`);
    const chords = [];

    // Get primary chords (I, IV, V)
    const primaryChords = [0, 3, 4].map(i => key.chords[i]);
    // Get secondary chords (ii, iii, vi)
    const secondaryChords = [1, 2, 5].map(i => key.chords[i]);
    // Get tension chords (diminished, augmented)
    const tensionChords = [6].map(i => key.chords[i]);

    // Add all chords with their categories
    scale.notes.forEach((note, i) => {
      const chordSymbol = key.chords[i];
      let category = 'weak-compatibility';
      
      if (primaryChords.includes(chordSymbol)) {
        category = 'strong-compatibility';
      } else if (secondaryChords.includes(chordSymbol)) {
        category = 'medium-compatibility';
      }

      chords.push({
        symbol: chordSymbol,
        notes: Chord.get(chordSymbol).notes,
        category
      });
    });

    return chords;
  };

  const handleChordClick = (chord) => {
    const chordNotes = Chord.get(chord.symbol).notes.map(note => `${note}${selectedOctave}`);
    audioEngine.playChord(chordNotes);
    onChordClick(chord.notes);
  };

  const chords = getChordRelations();

  return (
    <div className="chord-compatibility">
      <h3>Chord Suggestions</h3>
      <div className="compatibility-grid">
        {chords.map((chord) => (
          <button 
            key={chord.symbol}
            className={`compatibility-chord ${chord.category}`}
            onClick={() => handleChordClick(chord)}
          >
            {chord.symbol}
          </button>
        ))}
      </div>
      <div className="compatibility-legend">
        <span className="legend-item strong-compatibility">Primary (I, IV, V)</span>
        <span className="legend-item medium-compatibility">Secondary (ii, iii, vi)</span>
        <span className="legend-item weak-compatibility">Tension (vii°)</span>
      </div>
    </div>
  );
};

export default ChordCompatibility;
