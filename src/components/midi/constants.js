export const MIDI_RELASE = "REL"
export const MIDI_ATTACK = "ATK"
export const MIDI_SUSTAIN = "SUS"
export const MIDI_PITCH = "PITCH"

export const SOURCE_MIDI = "SOURCE_MIDI"
export const SOURCE_MOUSE = "SOURCE_MOUSE"
export const SOURCE_KEYBOARD = "SOURCE_KEYBOARD"

export const SIGNAL_TYPE_MAP = {
    128: MIDI_RELASE,
    146: MIDI_ATTACK,
    178: MIDI_SUSTAIN,
    224: MIDI_PITCH,
}