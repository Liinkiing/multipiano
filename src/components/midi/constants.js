export const MIDI_RELASE = "REL"
export const MIDI_ATTACK = "ATK"
export const MIDI_MODULATION = "MOD"
export const MIDI_PITCH = "PITCH"

export const SIGNAL_TYPE_MAP = {
    128: MIDI_RELASE,
    144: MIDI_ATTACK,
    176: MIDI_MODULATION,
    224: MIDI_PITCH,
}