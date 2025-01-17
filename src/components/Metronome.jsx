import React, { useState, useEffect, useCallback } from 'react';
import { audioEngine } from '../utils/audio';
import './Metronome.css';

const Metronome = ({ isPlaying: progressionPlaying, tempo = 120, onTempoChange }) => {
  const [beat, setBeat] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [isMetronomeOn, setIsMetronomeOn] = useState(false);

  const playClick = useCallback(() => {
    audioEngine.playMetronome();
    setBeat(prev => (prev + 1) % 4);
  }, []);

  useEffect(() => {
    // Start metronome if either progression is playing or metronome is turned on
    if (progressionPlaying || isMetronomeOn) {
      const interval = setInterval(playClick, (60 / tempo) * 1000);
      setIntervalId(interval);
    } else {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
        setBeat(0);
      }
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [progressionPlaying, isMetronomeOn, tempo, playClick]);

  const toggleMetronome = () => {
    setIsMetronomeOn(!isMetronomeOn);
  };

  return (
    <div className="metronome">
      <div className="tempo-control">
        <label>
          Tempo: {tempo} BPM
          <input
            type="range"
            min="60"
            max="180"
            value={tempo}
            onChange={(e) => onTempoChange(Number(e.target.value))}
          />
        </label>
      </div>
      <button 
        className={`metronome-toggle ${isMetronomeOn ? 'active' : ''}`}
        onClick={toggleMetronome}
      >
        {isMetronomeOn ? 'Stop' : 'Start'} Metronome
      </button>
      <div className="beat-indicator">
        {[0, 1, 2, 3].map((b) => (
          <div
            key={b}
            className={`beat ${beat === b ? 'active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Metronome;
