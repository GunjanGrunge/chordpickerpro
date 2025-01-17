import React from 'react';
import './CircleOfFifths.css';

const CircleOfFifths = ({ selectedNotes }) => {
  const majorNotes = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F'];
  const minorNotes = ['Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'D#m', 'A#m', 'Fm', 'Cm', 'Gm', 'Dm'];
  
  const baseNote = selectedNotes[0] || '';
  const isMinor = selectedNotes.length >= 3 && 
    selectedNotes.includes(baseNote + 'm');

  return (
    <div className="circle-container">
      <div className="circle">
        {majorNotes.map((note, index) => (
          <div
            key={note}
            className={`circle-note major ${note === baseNote ? 'active' : ''}`}
            style={{
              transform: `rotate(${index * 30}deg) translate(100px) rotate(-${index * 30}deg)`
            }}
          >
            {note}
          </div>
        ))}
        {minorNotes.map((note, index) => (
          <div
            key={note}
            className={`circle-note minor ${note === baseNote + 'm' ? 'active' : ''}`}
            style={{
              transform: `rotate(${index * 30}deg) translate(70px) rotate(-${index * 30}deg)`
            }}
          >
            {note}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CircleOfFifths;
