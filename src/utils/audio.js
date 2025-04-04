import Soundfont from 'soundfont-player'

class AudioEngine {
  constructor() {
    this.ac = null;
    this.instruments = {};
    this.currentInstrument = 'acoustic_grand_piano';
    this.currentPattern = 'basic';
    this.initialized = false;
  }

  async init() {
    try {
      // Create AudioContext only on user interaction
      this.ac = new (window.AudioContext || window.webkitAudioContext)();
      await this.ac.resume();
      
      // Load default piano instrument
      this.instruments[this.currentInstrument] = await Soundfont.instrument(
        this.ac,
        'acoustic_grand_piano',
        {
          soundfont: 'MusyngKite',
          format: 'mp3',
          gain: 2.5, // Increase volume
          nameToUrl: (name, soundfont, format) => {
            return `https://gleitz.github.io/midi-js-soundfonts/${soundfont}/${name}-${format}.js`;
          }
        }
      );

      console.log('Audio engine initialized');
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize audio:', error);
      return false;
    }
  }

  async loadInstrument(instrumentName) {
    try {
      this.instruments[instrumentName] = await Soundfont.instrument(
        this.ac,
        instrumentName,
        {
          soundfont: 'MusyngKite',
          format: 'mp3',
          nameToUrl: (name, soundfont, format) => {
            return `https://d1pzp51pvbm36p.cloudfront.net/${soundfont}/${name}-${format}.js`
          }
        }
      );
      console.log(`Loaded instrument: ${instrumentName}`);
    } catch (error) {
      console.error(`Failed to load instrument ${instrumentName}:`, error);
    }
  }

  async setInstrument(instrumentName) {
    if (!this.instruments[instrumentName]) {
      await this.loadInstrument(instrumentName);
    }
    this.currentInstrument = instrumentName;
  }

  async playNote(note) {
    if (!this.initialized || !this.instruments[this.currentInstrument]) {
      console.warn('Audio not initialized or instrument not loaded');
      return;
    }

    try {
      await this.instruments[this.currentInstrument].play(note);
    } catch (error) {
      console.error('Error playing note:', error);
    }
  }

  async playChord(notes) {
    if (!this.initialized || !this.instruments[this.currentInstrument]) {
      console.warn('Audio not initialized or instrument not loaded');
      return;
    }

    try {
      const instrument = this.instruments[this.currentInstrument];
      const pattern = strummingPatterns[this.currentPattern];
      const now = this.ac.currentTime;

      pattern.pattern.forEach((noteIndex, index) => {
        const time = now + pattern.timing[index];
        const note = notes[noteIndex % notes.length];
        instrument.play(note, time);
      });
    } catch (error) {
      console.error('Error playing chord:', error);
    }
  }

  setVolume(value) {
    if (!this.initialized) return;
    const normalizedVolume = Math.pow(10, value / 20);
    Object.values(this.instruments).forEach(instrument => {
      if (instrument && instrument.player) {
        instrument.player.volume.value = value;
      }
    });
  }

  stopAll() {
    if (!this.initialized) return;
    Object.values(this.instruments).forEach(instrument => {
      if (instrument && instrument.stop) {
        instrument.stop();
      }
    });
  }
}

export const audioEngine = new AudioEngine();

// Strumming patterns
export const strummingPatterns = {
  basic: {
    name: 'Basic',
    pattern: [0],
    timing: [0],
  },
  downStrum: {
    name: 'Down Strum',
    pattern: [0, 1, 2],
    timing: [0, 0.05, 0.1],
  },
  upStrum: {
    name: 'Up Strum',
    pattern: [2, 1, 0],
    timing: [0, 0.05, 0.1],
  },
  alternating: {
    name: 'Alternating',
    pattern: [0, 1, 2, 1, 0, 1, 2, 1],
    timing: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875],
  }
};
