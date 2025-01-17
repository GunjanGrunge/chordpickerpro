import React, { useState, useEffect } from 'react';
import * as Scale from '@tonaljs/scale';  // Updated import
import Piano from './components/Piano';
import ChordDisplay from './components/ChordDisplay';
import ScaleDisplay from './components/ScaleDisplay';
import ChordProgression from './components/ChordProgression';
import { chordProgressions } from './utils/progressions';
import { audioEngine } from './utils/audio';
import './App.css';
import Metronome from './components/Metronome';
import ChordCompatibility from './components/ChordCompatibility';

function App() {
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [selectedKey, setSelectedKey] = useState('C');
  const [scaleType, setScaleType] = useState('major');
  const [selectedProgression, setSelectedProgression] = useState('');
  const [chordPositions, setChordPositions] = useState([]);
  const [showCircle, setShowCircle] = useState(true);
  const [volume, setVolume] = useState(-10);
  const [selectedOctave, setSelectedOctave] = useState(5);
  const [tempo, setTempo] = useState(120);

  const keys = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F']; // Circle of fifths order
  const scaleTypes = ['major', 'minor', 'dorian', 'mixolydian', 'pentatonic'];

  useEffect(() => {
    if (selectedProgression) {
      const progression = chordProgressions[selectedProgression];
      const scaleNotes = Scale.get(`${selectedKey} ${scaleType}`).notes;  // Updated usage
      const positions = progression.degrees.map((degree, index) => {
        const note = scaleNotes[(degree - 1) % 7];
        return { note, position: index + 1 };
      });
      setChordPositions(positions);
    } else {
      setChordPositions([]);
    }
  }, [selectedKey, scaleType, selectedProgression]);

  useEffect(() => {
    audioEngine.synth.volume.value = volume;
  }, [volume]);

  const handleNoteClick = (note) => {
    const fullNote = note; // Now includes octave number
    setSelectedNotes(prev => 
      prev.includes(fullNote) 
        ? prev.filter(n => n !== fullNote)
        : [...prev, fullNote]
    );
  };

  const handleChordClick = (chordNotes) => {
    setSelectedNotes(chordNotes);
  };

  const getRelativeMinor = (majorKey) => {
    const minorKeys = {
      'C': 'Am', 'G': 'Em', 'D': 'Bm', 'A': 'F#m', 'E': 'C#m', 'B': 'G#m',
      'F#': 'D#m', 'C#': 'A#m', 'G#': 'Fm', 'D#': 'Cm', 'A#': 'Gm', 'F': 'Dm'
    };
    return minorKeys[majorKey];
  };

  const handleKeySelection = (key, isMinor = false) => {
    setSelectedKey(key);
    setScaleType(isMinor ? 'minor' : 'major');
  };

  const handleReset = () => {
    setSelectedNotes([]);
    setChordPositions([]);
  };

  const renderCircleOfFifths = () => {
    return (
      <div className="circle-of-fifths">
        {/* Major keys (outer circle) */}
        {keys.map((key, index) => (
          <button
            key={key}
            className={`circle-note major ${selectedKey === key && scaleType === 'major' ? 'selected' : ''}`}
            onClick={() => {
              handleKeySelection(key, false);
              if (selectedKey && selectedKey !== key) {
                handleCircleTransition(selectedKey, key);
              }
            }}
            style={{
              '--angle': `${index * 30}deg`
            }}
          >
            {key}
          </button>
        ))}
        
        {/* Relative minor keys (inner circle) */}
        {keys.map((key, index) => {
          const minorKey = getRelativeMinor(key);
          const minorRoot = minorKey.replace('m', '');
          return (
            <button
              key={minorKey}
              className={`circle-note minor ${selectedKey === minorRoot && scaleType === 'minor' ? 'selected' : ''}`}
              onClick={() => handleKeySelection(minorRoot, true)}
              style={{
                '--angle': `${index * 30}deg`
              }}
            >
              {minorKey}
            </button>
          );
        })}
      </div>
    );
  };

  const CircleIcon = () => (
    <svg 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      height="1em" 
      width="1em"
    >
      <path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm0 2c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8z" />
    </svg>
  );

  return (
    <div className="app">
      <h1>Chord Picker</h1>
      
      <div className="main-controls">
        <button className="circle-toggle" onClick={() => setShowCircle(!showCircle)}>
          <CircleIcon />
          <span>{showCircle ? 'Hide' : 'Show'} Circle of Fifths</span>
        </button>

        <div className="scale-controls">
          <select 
            value={scaleType} 
            onChange={(e) => setScaleType(e.target.value)}
          >
            {scaleTypes.map(scale => (
              <option key={scale} value={scale}>{scale}</option>
            ))}
          </select>
          <select 
            value={selectedProgression} 
            onChange={(e) => setSelectedProgression(e.target.value)}
          >
            <option value="">Select Progression</option>
            {Object.keys(chordProgressions).map(prog => (
              <option key={prog} value={prog}>{chordProgressions[prog].name}</option>
            ))}
          </select>
        </div>
      </div>

      {showCircle && (
        <div className="circle-container">
          {renderCircleOfFifths()}
        </div>
      )}

      <ScaleDisplay 
        keyNote={selectedKey} 
        scaleType={scaleType} 
        onNoteClick={handleNoteClick}
        selectedOctave={selectedOctave}
      />

      <div className="metronome-section">
        <h3>Metronome</h3>
        <Metronome 
          tempo={tempo}
          onTempoChange={setTempo}
          standalone={true}
        />
      </div>

      <ChordProgression 
        keyNote={selectedKey} 
        scaleType={scaleType} 
        selectedProgression={selectedProgression}
        onChordClick={handleChordClick}
        selectedOctave={selectedOctave}
      />

      <ChordCompatibility 
        currentChord={selectedNotes[0]} // Pass the first note of selected chord
        keyNote={selectedKey}
        scaleType={scaleType}
        onChordClick={handleChordClick}
        selectedOctave={selectedOctave}
      />

      <div className="piano-section">
        <div className="piano-controls">
          <div className="control-group">
            <label htmlFor="volume">
              Volume
              <span className="volume-display">{volume}dB</span>
            </label>
            <input
              id="volume"
              type="range"
              min="-40"
              max="0"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
            />
          </div>

          <div className="control-group">
            <label>Octave</label>
            <select
              value={selectedOctave}
              onChange={(e) => setSelectedOctave(Number(e.target.value))}
            >
              <option value={4}>Low (4)</option>
              <option value={5}>High (5)</option>
            </select>
          </div>

          <button 
            className="reset-button" 
            onClick={handleReset}
            title="Clear selected notes"
          >
            Reset Notes
          </button>
        </div>

        <Piano 
          onNoteClick={handleNoteClick} 
          selectedNotes={selectedNotes} 
          chordPositions={chordPositions}
          selectedOctave={selectedOctave}
        />
      </div>

      <ChordDisplay notes={selectedNotes} />
    </div>
  );
}

export default App;
