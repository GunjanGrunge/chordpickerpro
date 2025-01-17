import * as Tone from 'tone';

class AudioEngine {
  constructor() {
    this.synth = new Tone.PolySynth(Tone.Synth).toDestination();
    this.synth.volume.value = -10; // Adjust volume
    this.context = Tone.context;
  }

  async init() {
    await Tone.start();
    console.log('Audio engine initialized');
  }

  playNote(note) {
    Tone.loaded().then(() => {
      this.synth.triggerAttackRelease(note, "8n");
    });
  }

  playChord(notes, duration = "2n") {
    Tone.loaded().then(() => {
      this.synth.releaseAll();
      this.synth.triggerAttackRelease(notes, duration);
    });
  }

  stopAll() {
    this.synth.releaseAll();
  }

  playMetronome() {
    const click = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 }
    }).toDestination();
    click.volume.value = -20;
    click.triggerAttackRelease('C6', '32n');
  }
}

export const audioEngine = new AudioEngine();
