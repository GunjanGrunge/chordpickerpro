import React from 'react';
import { strummingPatterns } from '../utils/instruments';
import { audioEngine } from '../utils/audio';
import './InstrumentControls.css';

const INSTRUMENTS = {
  acoustic_grand_piano: 'Piano',
  acoustic_guitar_nylon: 'Nylon Guitar',
  acoustic_guitar_steel: 'Steel Guitar',
  electric_guitar_clean: 'Electric Guitar'
};

const InstrumentControls = () => {
  const handleInstrumentChange = (e) => {
    audioEngine.setInstrument(e.target.value);
  };

  const handlePatternChange = (e) => {
    audioEngine.setPattern(e.target.value);
  };

  return (
    <div className="instrument-controls">
      <div className="control-group">
        <label>Instrument</label>
        <select onChange={handleInstrumentChange} defaultValue="acoustic_grand_piano">
          {Object.entries(INSTRUMENTS).map(([key, name]) => (
            <option key={key} value={key}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <div className="control-group">
        <label>Strumming Pattern</label>
        <select onChange={handlePatternChange} defaultValue="basic">
          {Object.entries(strummingPatterns).map(([key, pattern]) => (
            <option key={key} value={key}>
              {pattern.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default InstrumentControls;
