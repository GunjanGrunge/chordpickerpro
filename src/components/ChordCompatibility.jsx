import React, { useState } from 'react';
import * as Scale from '@tonaljs/scale';
import * as Chord from '@tonaljs/chord';
import * as Key from '@tonaljs/key';
import { audioEngine } from '../utils/audio';
import { chordProgressions } from '../utils/progressions';
import './ChordCompatibility.css';

const ChordCompatibility = ({ currentChord, keyNote, scaleType, onChordClick, selectedOctave = 4 }) => {
  const [selectedProgression, setSelectedProgression] = useState('I-IV-V'); // Default progression

  const getChordRelations = () => {
    if (!keyNote) return [];
    
    const scale = Scale.get(`${keyNote} ${scaleType}`);
    const chords = [];

    // Simplified chord types - only major and minor
    scale.notes.forEach((note, i) => {
      let chordType, category;
      
      if (scaleType === 'major') {
        // In major scale: I, IV, V are major; ii, iii, vi are minor
        chordType = [0, 3, 4].includes(i) ? '' : 'm';  // empty string for major
        category = [0, 3, 4].includes(i) ? 'strong-compatibility' : 'medium-compatibility';
      } else {
        // In minor scale: III, VI, VII are major; i, ii, iv, v are minor
        chordType = [2, 5, 6].includes(i) ? '' : 'm';
        category = [0, 3, 4].includes(i) ? 'strong-compatibility' : 'medium-compatibility';
      }

      const chord = Chord.get(`${note}${chordType}`);
      chords.push({
        symbol: `${note}${chordType}`,
        notes: chord.notes,
        notesDisplay: chord.notes.join(' - '),
        category
      });
    });

    return chords;
  };

  const getProgressionChords = () => {
    if (!selectedProgression || !keyNote) return [];
    
    const progression = chordProgressions[selectedProgression];
    const scale = Scale.get(`${keyNote} ${scaleType}`);
    
    return progression.degrees.map(degree => {
      const note = scale.notes[(degree - 1) % 7];
      const chordType = scaleType === 'major'
        ? [1, 4, 5].includes(degree) ? 'maj'
          : degree === 7 ? 'dim' : 'm'
        : degree === 3 ? 'maj' : 'm';
      
      const chord = Chord.get(`${note}${chordType}`);
      return {
        symbol: `${note}${chordType}`,
        notes: chord.notes,
        notesDisplay: chord.notes.join(' - '),
        position: degree
      };
    });
  };

  const handleChordClick = (chord) => {
    const chordNotes = Chord.get(chord.symbol).notes.map(note => `${note}${selectedOctave}`);
    audioEngine.playChord(chordNotes);
    onChordClick(chord.notes);
  };

  const chords = getChordRelations();
  const progressionChords = getProgressionChords();

  return (
    <div className="chord-compatibility">
      <h3>Chord Suggestions</h3>
      <div className="compatibility-grid">
        {getChordRelations().map((chord) => (
          <button 
            key={chord.symbol}
            className={`compatibility-chord ${chord.category}`}
            onClick={() => handleChordClick(chord)}
          >
            <div className="chord-symbol">{chord.symbol}</div>
            <div className="chord-notes">{chord.notesDisplay}</div>
          </button>
        ))}
      </div>
      
      <div className="compatibility-legend">
        <span className="legend-item strong-compatibility">Primary Chords</span>
        <span className="legend-item medium-compatibility">Secondary Chords</span>
      </div>
    </div>
  );
};

export default ChordCompatibility;
