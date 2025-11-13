// MIDI to Note Name mapping
// MIDI numbers range from 1 to 128
// Note names follow standard musical notation

export interface MIDINote {
  midi: number;
  note: string;
  frequency: number;
}

// Generate MIDI note data
// MIDI 1-128 maps to notes from C-2 to G8
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const OCTAVE_OFFSET = -2; // MIDI 0 is C-2

function midiToNote(midi: number): string {
  const noteIndex = midi % 12;
  const octave = Math.floor(midi / 12) + OCTAVE_OFFSET;
  return `${NOTE_NAMES[noteIndex]}${octave}`;
}

function midiToFrequency(midi: number): number {
  // A4 (MIDI 69) = 440 Hz
  return 440 * Math.pow(2, (midi - 69) / 12);
}

// Generate all MIDI notes (1-128)
export const MIDI_NOTES: MIDINote[] = Array.from({ length: 128 }, (_, i) => {
  const midi = i + 1;
  return {
    midi,
    note: midiToNote(midi),
    frequency: midiToFrequency(midi),
  };
});

// Helper function to get note by MIDI number
export function getNoteByMIDI(midi: number): MIDINote | undefined {
  return MIDI_NOTES.find(n => n.midi === midi);
}

