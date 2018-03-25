export const SET_MIDI_ACCESS = "SET_MIDI_ACCESS"
export const ADD_MIDI_INPUT = "ADD_MIDI_INPUT"
export const ADD_MIDI_OUTPUT = "ADD_MIDI_OUTPUT"
export const REMOVE_MIDI_OUTPUT = "REMOVE_MIDI_OUTPUT"
export const REMOVE_MIDI_INPUT = "REMOVE_MIDI_INPUT"
export const REFRESH_MIDI_INPUTS_OUTPUTS = "REFRESH_MIDI_INPUTS_OUTPUTS"

export default {
    [SET_MIDI_ACCESS](state, midiAccess) {
        state.midiAccess = midiAccess
        state.inputs = state.midiAccess.inputsConnectionStatus
        state.outputs = state.midiAccess.outputsConnectionStatus
    },
    [ADD_MIDI_INPUT](state, input) {
        if (state.midiAccess.inputs.filter(i => i.id === input.id).length > 0) return
        state.midiAccess.inputs.push(input)
        state.midiAccess.init()
    },
    [REMOVE_MIDI_INPUT](state, input) {
        if (state.midiAccess.inputs.filter(i => i.id === input.id).length === 0) return
        state.midiAccess.inputs = state.midiAccess.inputs.filter(i => i.id !== input.id)
        state.midiAccess.init()
    },
    [ADD_MIDI_OUTPUT](state, output) {
        if (state.midiAccess.outputs.filter(o => o.id === output.id).length > 0) return
        state.midiAccess.outputs.push(output)
        state.midiAccess.init()
    },
    [REMOVE_MIDI_OUTPUT](state, output) {
        if (state.midiAccess.outputs.filter(o => o.id === output.id).length === 0) return
        state.midiAccess.outputs = state.midiAccess.outputs.filter(o => o.id !== output.id)
        state.midiAccess.init()
    },
    [REFRESH_MIDI_INPUTS_OUTPUTS](state) {
        state.inputs = state.midiAccess.inputsConnectionStatus
        state.outputs = state.midiAccess.outputsConnectionStatus
    }
}


