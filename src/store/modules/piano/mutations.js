import Note from "../../../components/midi/Note";

export const SET_MIDI_ACCESS = "SET_MIDI_ACCESS"
export const ADD_MIDI_INPUT = "ADD_MIDI_INPUT"
export const ADD_MIDI_OUTPUT = "ADD_MIDI_OUTPUT"
export const REMOVE_MIDI_OUTPUT = "REMOVE_MIDI_OUTPUT"
export const REMOVE_MIDI_INPUT = "REMOVE_MIDI_INPUT"
export const REFRESH_MIDI_INPUTS_OUTPUTS = "REFRESH_MIDI_INPUTS_OUTPUTS"
export const SET_PIANO_NOTES = "SET_PIANO_NOTES"
export const SET_PIANO_TYPE = "SET_PIANO_TYPE"
export const ADD_NOTE_PLAYING = "ADD_NOTE_PLAYING"
export const REMOVE_NOTE_PLAYING = "REMOVE_NOTE_PLAYING"
export const SET_CAN_PLAY = "SET_CAN_PLAY"

export default {
    [SET_CAN_PLAY](state, canPlay) {
        state.canPlay = canPlay
    },
    [SET_MIDI_ACCESS](state, midiAccess) {
        state.midi.midiAccess = midiAccess
        state.midi.inputs = state.midi.midiAccess.inputsConnectionStatus
        state.midi.outputs = state.midi.midiAccess.outputsConnectionStatus
    },
    [ADD_MIDI_INPUT] (state, input) {
        if (state.midi.midiAccess.inputs.filter(i => i.id === input.id).length > 0) return
        state.midi.midiAccess.inputs.push(input)
        state.midi.midiAccess.init()
    },
    [REMOVE_MIDI_INPUT] (state, input) {
        if (state.midi.midiAccess.inputs.filter(i => i.id === input.id).length === 0) return
        state.midi.midiAccess.inputs = state.midi.midiAccess.inputs.filter(i => i.id !== input.id)
        state.midi.midiAccess.init()
    },
    [ADD_MIDI_OUTPUT](state, output) {
        if (state.midi.midiAccess.outputs.filter(o => o.id === output.id).length > 0) return
        state.midi.midiAccess.outputs.push(output)
        state.midi.midiAccess.init()
    },
    [REMOVE_MIDI_OUTPUT](state, output) {
        if (state.midi.midiAccess.outputs.filter(o => o.id === output.id).length === 0) return
        state.midi.midiAccess.outputs = state.midi.midiAccess.outputs.filter(o => o.id !== output.id)
        state.midi.midiAccess.init()
    },
    [REFRESH_MIDI_INPUTS_OUTPUTS](state) {
        state.midi.inputs = state.midi.midiAccess.inputsConnectionStatus
        state.midi.outputs = state.midi.midiAccess.outputsConnectionStatus
    },
    [SET_PIANO_NOTES] (state, keys) {
        state.notes = keys.map(key => new Note(key))
    },
    [SET_PIANO_TYPE] (state, type) {
        state.type = type
    },
    [ADD_NOTE_PLAYING] (state, note) {
        state.notes = state.notes.map(n => {
            if (n.keyname === note.keyname) {
                note.playing = true
                return note
            }
            return n
        })
    },
    [REMOVE_NOTE_PLAYING] (state, note) {
        state.notes = state.notes.map(n => {
            if (n.keyname === note.keyname) {
                note.playing = false
                return note
            }
            return n
        })
    }
}


