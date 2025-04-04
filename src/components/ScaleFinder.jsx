import React, { useState, useEffect } from 'react';
import * as Scale from '@tonaljs/scale';
import * as Note from '@tonaljs/note';
import './ScaleFinder.css';

const ScaleFinder = ({ onScaleSelect, isOpen, onClose }) => {
  const [inputNotes, setInputNotes] = useState([]);
  const [probableScales, setProbableScales] = useState([]);

  const findMatchingScales = (notes) => {
    // Simplified to only major and minor scales
    const allScales = ['major', 'minor'];
    
    return allScales.flatMap(type => 
      ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].map(tonic => ({
        name: `${tonic} ${type}`,
        tonic,
        type,
        scale: Scale.get(`${tonic} ${type}`),
        description: type === 'major' ? 'Major Scale' : 'Natural Minor Scale'
      }))
    ).filter(({ scale }) => 
      notes.every(note => scale.notes.includes(Note.simplify(note)))
    );
  };

  useEffect(() => {
    if (inputNotes.length > 0) {
      const matches = findMatchingScales(inputNotes);
      setProbableScales(matches);
    } else {
      setProbableScales([]);
    }
  }, [inputNotes]);

  const handleNoteAdd = (note) => {
    if (!inputNotes.includes(note)) {
      setInputNotes([...inputNotes, note]);
    }
  };

  const handleNoteRemove = (noteToRemove) => {
    setInputNotes(inputNotes.filter(note => note !== noteToRemove));
  };

  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  if (!isOpen) return null;

  return (
    <div className="scale-finder-overlay">
      <div className="scale-finder-modal">
        <div className="scale-finder-header">
          <h3>Scale Finder</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <p className="scale-finder-description">
          Click notes to find matching major and minor scales
        </p>

        <div className="note-input">
          <div className="note-buttons">
            {notes.map(note => (
              <button
                key={note}
                onClick={() => handleNoteAdd(note)}
                className={`note-button ${inputNotes.includes(note) ? 'active' : ''}`}
              >
                {note}
              </button>
            ))}
          </div>
          {inputNotes.length > 0 && (
            <div className="selected-notes">
              <div className="selected-notes-header">
                <span className="selected-notes-label">Selected Notes:</span>
                <button 
                  className="clear-all-button" 
                  onClick={() => setInputNotes([])}
                >
                  Clear All
                </button>
              </div>
              <div className="selected-notes-list">
                {inputNotes.map(note => (
                  <span key={note} className="selected-note" onClick={() => handleNoteRemove(note)}>
                    {note} ×
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {probableScales.length > 0 && (
          <div className="probable-scales">
            <h4>Matching Scales</h4>
            <div className="scale-list">
              {probableScales.map(({ name, scale, description }) => (
                <button
                  key={name}
                  className="scale-option"
                  onClick={() => onScaleSelect(scale.tonic, scale.type)}
                >
                  <span className="scale-name">{name}</span>
                  <span className="scale-type">{description}</span>
                  <span className="scale-notes">{scale.notes.join(' ')}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="scale-finder-footer">
          <button className="back-button" onClick={onClose}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScaleFinder;
