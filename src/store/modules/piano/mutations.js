export const SET_MIDI_ACCESS = "SET_MIDI_ACCESS"
export const ADD_MIDI_INPUT = "ADD_MIDI_INPUT"
export const ADD_MIDI_OUTPUT = "ADD_MIDI_OUTPUT"
export const REMOVE_MIDI_OUTPUT = "REMOVE_MIDI_OUTPUT"
export const REMOVE_MIDI_INPUT = "REMOVE_MIDI_INPUT"
export const REFRESH_MIDI_INPUTS_OUTPUTS = "REFRESH_MIDI_INPUTS_OUTPUTS"
export const SET_MIDI_KEYS = "SET_MIDI_KEYS"

export default {
    [SET_MIDI_ACCESS](state, midiAccess) {
        state.midi.midiAccess = midiAccess
        state.midi.inputs = state.midi.midiAccess.inputsConnectionStatus
        state.midi.outputs = state.midi.midiAccess.outputsConnectionStatus
    },
    [ADD_MIDI_INPUT](state, input) {
        if (state.midi.midiAccess.inputs.filter(i => i.id === input.id).length > 0) return
        state.midi.midiAccess.inputs.push(input)
        state.midi.midiAccess.init()
    },
    [REMOVE_MIDI_INPUT](state, input) {
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
    [SET_MIDI_KEYS] (state, keys) {
        state.keys = keys
    }
}


