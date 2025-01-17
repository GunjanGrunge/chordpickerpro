import React, { useState, useEffect } from 'react';
import { getChordSuggestions, getTransitionChords } from '../utils/aiService';
import './AiSuggestions.css';

const GENRES = [
  { id: 'pop', name: 'Pop Music' },
  { id: 'rock', name: 'Rock' },
  { id: 'jazz', name: 'Jazz' },
  { id: 'rb', name: 'R&B' },
  { id: 'hiphop', name: 'Hip Hop' },
  { id: 'lofi', name: 'Lo-Fi' },
  { id: 'drill', name: 'Drill' },
  { id: 'trap', name: 'Trap' },
  { id: 'classical', name: 'Classical' },
  { id: 'edm', name: 'EDM' },
  { id: 'ambient', name: 'Ambient' }
];

const AiSuggestions = ({ keyNote, scaleType, selectedNotes, onChordSelect, isEnabled }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [targetKey, setTargetKey] = useState('');
  const [targetScale, setTargetScale] = useState('');
  const [showTransition, setShowTransition] = useState(false);
  const [circleTransition, setCircleTransition] = useState({
    source: { key: '', scale: '' },
    target: { key: '', scale: '' }
  });

  const handleGenreChange = async (e) => {
    const genre = e.target.value;
    setSelectedGenre(genre);
    if (genre) {
      setIsLoading(true);
      try {
        const newSuggestions = await getChordSuggestions(keyNote, scaleType, selectedNotes, genre);
        setSuggestions(newSuggestions);
      } catch (error) {
        console.error('Error:', error);
      }
      setIsLoading(false);
    }
  };

  const handleTransitionRequest = async () => {
    if (!targetKey || !targetScale) return;
    
    setIsLoading(true);
    try {
      const transitionSuggestions = await getTransitionChords(
        keyNote,
        scaleType,
        targetKey,
        targetScale,
        selectedGenre
      );
      setSuggestions(transitionSuggestions);
    } catch (error) {
      console.error('Error:', error);
    }
    setIsLoading(false);
  };

  const handleCircleTransition = async (sourceKey, sourceScale, targetKey, targetScale) => {
    setIsLoading(true);
    try {
      const transitionSuggestions = await getTransitionChords(
        sourceKey,
        sourceScale,
        targetKey,
        targetScale,
        selectedGenre,
        true // indicates this is a circle of fifths transition
      );
      setSuggestions(transitionSuggestions);
    } catch (error) {
      console.error('Error:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (circleTransition.source.key && circleTransition.target.key) {
      handleCircleTransition(
        circleTransition.source.key,
        circleTransition.source.scale,
        circleTransition.target.key,
        circleTransition.target.scale
      );
    }
  }, [circleTransition]);

  return (
    <div className="ai-suggestions" style={{ display: isEnabled ? 'block' : 'none' }}>
      {isEnabled && (
        <>
          <div className="ai-controls">
            <h3>AI Chord Suggestions</h3>
            <div className="controls-row">
              <select 
                value={selectedGenre}
                onChange={handleGenreChange}
                className="genre-select"
              >
                <option value="">Select a Genre</option>
                {GENRES.map(genre => (
                  <option key={genre.id} value={genre.id}>{genre.name}</option>
                ))}
              </select>
              
              <button
                className="transition-toggle"
                onClick={() => setShowTransition(!showTransition)}
              >
                {showTransition ? 'Hide Transition' : 'Show Transition'}
              </button>
            </div>

            {showTransition && (
              <div className="transition-controls">
                <h4>Transition to:</h4>
                <div className="transition-inputs">
                  <select
                    value={targetKey}
                    onChange={(e) => setTargetKey(e.target.value)}
                    className="key-select"
                  >
                    <option value="">Target Key</option>
                    {['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'F', 'Bb', 'Eb', 'Ab'].map(key => (
                      <option key={key} value={key}>{key}</option>
                    ))}
                  </select>
                  <select
                    value={targetScale}
                    onChange={(e) => setTargetScale(e.target.value)}
                    className="scale-select"
                  >
                    <option value="">Target Scale</option>
                    <option value="major">Major</option>
                    <option value="minor">Minor</option>
                  </select>
                  <button
                    className="get-transition-btn"
                    onClick={handleTransitionRequest}
                    disabled={!targetKey || !targetScale || isLoading}
                  >
                    Get Transition Chords
                  </button>
                </div>
              </div>
            )}
          </div>

          {isLoading && (
            <div className="loading">Generating suggestions...</div>
          )}

          {suggestions.length > 0 && !isLoading && (
            <div className="suggestions-list">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="suggestion-card">
                  <h4>Suggestion {index + 1}</h4>
                  <div className="chord-sequence">
                    {suggestion.chords.map((chord, chordIndex) => (
                      <button
                        key={chordIndex}
                        className="chord-button"
                        onClick={() => onChordSelect(chord)}
                      >
                        {chord}
                      </button>
                    ))}
                  </div>
                  <p className="suggestion-description">{suggestion.description}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AiSuggestions;

