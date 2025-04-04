import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import './Metronome.css';

const MetronomeIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M12 1L3 5v2l9-4 9 4V5l-9-4zM3 19v-2l9 4 9-4v2l-9 4-9-4zm9-7L3 8v8l9 4 9-4V8l-9 4z"/>
  </svg>
);

const Metronome = ({ tempo, onTempoChange, standalone = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef(null);
  const clickHighRef = useRef(null);
  const clickLowRef = useRef(null);
  const [inputValue, setInputValue] = useState(tempo);

  useEffect(() => {
    // Create two oscillators for metronome clicks
    clickHighRef.current = new Tone.Oscillator({
      frequency: 1800,
      type: "sine",
      volume: -10,
    }).toDestination();

    clickLowRef.current = new Tone.Oscillator({
      frequency: 1200,
      type: "sine",
      volume: -10,
    }).toDestination();

    return () => {
      clickHighRef.current.dispose();
      clickLowRef.current.dispose();
    };
  }, []);

  const playClick = (time, isAccent) => {
    const click = isAccent ? clickHighRef.current : clickLowRef.current;
    click.start(time).stop(time + 0.025); // Short duration click
  };

  useEffect(() => {
    if (isPlaying) {
      const intervalTime = (60 / tempo) * 1000;
      let lastClick = Date.now();
      let count = 0;

      const tick = () => {
        const now = Date.now();
        if (now - lastClick >= intervalTime) {
          playClick(Tone.now(), count % 4 === 0);
          lastClick = now;
          count++;
        }
        timerRef.current = requestAnimationFrame(tick);
      };

      timerRef.current = requestAnimationFrame(tick);
    }

    return () => {
      if (timerRef.current) {
        cancelAnimationFrame(timerRef.current);
      }
    };
  }, [isPlaying, tempo]);

  const handleTempoChange = (e) => {
    const newTempo = parseInt(e.target.value);
    if (!isNaN(newTempo) && newTempo >= 40 && newTempo <= 208) {
      onTempoChange(newTempo);
    }
  };

  const handleManualTempoChange = (e) => {
    const value = e.target.value;
    setInputValue(value); // Allow any input value temporarily

    const newTempo = parseInt(value);
    if (!isNaN(newTempo) && newTempo >= 40 && newTempo <= 208) {
      onTempoChange(newTempo);
    }
  };

  const handleInputBlur = () => {
    const validTempo = Math.min(Math.max(parseInt(inputValue) || 40, 40), 208);
    setInputValue(validTempo);
    onTempoChange(validTempo);
  };

  // Update input value when tempo prop changes
  useEffect(() => {
    setInputValue(tempo);
  }, [tempo]);

  return (
    <div className={`metronome ${standalone ? 'standalone' : ''}`}>
      <div className="metronome-header">
        <MetronomeIcon />
        <div className="tempo-input-group">
          <input
            type="text"
            inputMode="numeric"
            pattern="\d*"
            value={inputValue}
            onChange={handleManualTempoChange}
            onBlur={handleInputBlur}
            className="tempo-input"
          />
          <span>BPM</span>
        </div>
      </div>

      <div className="metronome-controls">
        <button 
          className={`play-button ${isPlaying ? 'active' : ''}`}
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? 'Stop' : 'Start'}
        </button>
        
        <div className="tempo-control">
          <input
            type="range"
            min="40"
            max="208"
            value={tempo}
            onChange={handleTempoChange}
            className="tempo-slider"
          />
        </div>
      </div>
    </div>
  );
};

export default Metronome;
