export const instruments = {
  piano: {
    name: 'Piano',
    url: 'https://tonejs.github.io/audio/salamander/',
    samples: {
      'C4': 'C4.mp3',
      'D#4': 'Ds4.mp3',
      'F#4': 'Fs4.mp3',
      'A4': 'A4.mp3',
    }
  },
  acousticGuitar: {
    name: 'Acoustic Guitar',
    url: 'https://tonejs.github.io/audio/guitar-acoustic/',
    samples: {
      'A2': 'A2.[mp3|ogg]',
      'A3': 'A3.[mp3|ogg]',
      'A4': 'A4.[mp3|ogg]',
      'D3': 'D3.[mp3|ogg]',
      'D4': 'D4.[mp3|ogg]',
      'E2': 'E2.[mp3|ogg]',
      'E3': 'E3.[mp3|ogg]',
      'E4': 'E4.[mp3|ogg]'
    }
  },
  electricGuitar: {
    name: 'Electric Guitar',
    url: 'https://tonejs.github.io/audio/electric-guitar/',
    samples: {
      'A2': 'A2.[mp3|ogg]',
      'A3': 'A3.[mp3|ogg]',
      'A4': 'A4.[mp3|ogg]',
      'D3': 'D3.[mp3|ogg]',
      'D4': 'D4.[mp3|ogg]',
      'E2': 'E2.[mp3|ogg]',
      'E3': 'E3.[mp3|ogg]',
      'E4': 'E4.[mp3|ogg]'
    }
  }
};

export const strummingPatterns = {
  basic: {
    name: 'Basic Strum',
    pattern: [0], // all notes at once
    timing: [0],
  },
  downStrum: {
    name: 'Down Strum',
    pattern: [0, 1, 2], // low to high
    timing: [0, 0.05, 0.1],
  },
  upStrum: {
    name: 'Up Strum',
    pattern: [2, 1, 0], // high to low
    timing: [0, 0.05, 0.1],
  },
  alternating: {
    name: 'Alternating',
    pattern: [0, 1, 2, 1, 0, 1, 2, 1],
    timing: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875],
  }
};
