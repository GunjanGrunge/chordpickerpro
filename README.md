# Chord Picker Pro

A comprehensive music theory and chord progression tool built with React and Electron. Available as both a web application and a desktop application.

## Features

- **Interactive Circle of Fifths**
  - Visual representation of musical keys
  - Easy key selection and modulation
  - Shows relative minor/major relationships

- **Scale Explorer**
  - Major and minor scale visualization
  - Scale degree information
  - Compatible chord suggestions for each scale degree
  - Notes in each chord displayed

- **Chord Compatibility**
  - Suggests compatible chords based on current key and scale
  - Primary and secondary chord indicators
  - Real-time chord playback
  - Visual chord progression builder

- **Interactive Piano**
  - Virtual piano keyboard interface
  - Note and chord playback
  - Multiple octave support
  - Volume control

- **Professional Metronome**
  - Tempo range: 40-208 BPM
  - Both slider and manual input
  - Visual beat indication
  - Professional click sounds
  - Start/Stop control

- **Scale Finder**
  - Find scales based on selected notes
  - Major and minor scale identification
  - Interactive note selection
  - Clear UI for scale matching

## Available Versions

### Web Version
Access the application online at: https://gunjangrunge.github.io/chordpickerpro/

### Desktop Application
Download the Windows installer from the latest releases.

## Installation

### Web Version
No installation required. Simply visit the website.

### Desktop Version
1. Download the installer (`Chord Picker Pro-Setup-1.2.0.exe`)
2. Run the installer
3. Follow the installation wizard
4. Launch from desktop shortcut or start menu

## Development

```bash
# Clone the repository
git clone https://github.com/GunjanGrunge/chordpickerpro.git

# Install dependencies
npm install

# Run development version
npm run electron:dev

# Build for web
npm run build:web

# Build desktop installer
npm run build:installer
```

## Technologies Used

- React
- Electron
- Tone.js
- Tonal.js
- Vite
- Soundfont Player

## Requirements

- Windows 10 or later (for desktop version)
- Modern web browser (for web version)
- Audio output device

## License

MIT License

## Author

Gunjan Sarkar
