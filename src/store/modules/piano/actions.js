import MIDIWrapper from "../../../wrappers/MIDIWrapper";
import {ADD_MIDI_INPUT,
    ADD_MIDI_OUTPUT,
    REMOVE_MIDI_INPUT,
    REMOVE_MIDI_OUTPUT,
    SET_MIDI_ACCESS,
    REFRESH_MIDI_INPUTS_OUTPUTS as MUTATION_REFRESH_MIDI_INPUTS_OUTPUTS,
    SET_PIANO_NOTES as MUTATION_SET_PIANO_NOTES} from "./mutations";

export const GET_MIDI_ACCESS = "GET_MIDI_ACCESS"
export const OPEN_MIDI_INPUT = "OPEN_MIDI_INPUT"
export const OPEN_MIDI_OUTPUT = "OPEN_MIDI_OUTPUT"
export const CLOSE_MIDI_OUTPUT = "CLOSE_MIDI_OUTPUT"
export const CLOSE_MIDI_INPUT = "CLOSE_MIDI_INPUT"
export const OPEN_MIDI_PORT = "OPEN_MIDI_PORT"
export const CLOSE_MIDI_PORT = "CLOSE_MIDI_PORT"
export const REFRESH_MIDI = "REFRESH_MIDI"
export const REFRESH_MIDI_INPUTS_OUTPUTS = "REFRESH_MIDI_INPUTS_OUTPUTS"
export const TOGGLE_MIDI_CONNECTION_INPUT = "TOGGLE_MIDI_CONNECTION_INPUT"
export const TOGGLE_MIDI_CONNECTION_OUTPUT = "TOGGLE_MIDI_CONNECTION_OUTPUT"
export const SET_PIANO_NOTES = "SET_PIANO_NOTES"

export default {
    async [GET_MIDI_ACCESS]({commit}) {
        commit(SET_MIDI_ACCESS, await MIDIWrapper.requestMidiAccess())
    },
    async [OPEN_MIDI_INPUT]({commit, state}, inputId) {
        await state.midi.midiAccess.inputs.filter(i => i.id === inputId)[0].open()
        commit(MUTATION_REFRESH_MIDI_INPUTS_OUTPUTS)
    },
    async [CLOSE_MIDI_INPUT]({state, commit}, inputId) {
        await state.midi.midiAccess.inputs.filter(i => i.id === inputId)[0].close()
        commit(MUTATION_REFRESH_MIDI_INPUTS_OUTPUTS)
    },
    async [OPEN_MIDI_OUTPUT]({state, commit}, outputId) {
        await state.midi.midiAccess.outputs.filter(o => o.id === outputId)[0].open()
        commit(MUTATION_REFRESH_MIDI_INPUTS_OUTPUTS)
    },
    async [CLOSE_MIDI_OUTPUT]({state, commit}, outputId) {
        await state.midi.midiAccess.outputs.filter(o => o.id === outputId)[0].close()
        commit(MUTATION_REFRESH_MIDI_INPUTS_OUTPUTS)
    },
    [SET_PIANO_NOTES] ({commit}, keys) {
        commit(MUTATION_SET_PIANO_NOTES, keys)
    },
    [REFRESH_MIDI]({commit, dispatch}, midiStateEvent) {
        if (midiStateEvent.port.state === 'connected' && midiStateEvent.port.type === 'input') {
            commit(ADD_MIDI_INPUT, midiStateEvent.port)
        } else if (midiStateEvent.port.state === 'disconnected' && midiStateEvent.port.type === 'input') {
            commit(REMOVE_MIDI_INPUT, midiStateEvent.port)
        }
        else if (midiStateEvent.port.state === 'connected' && midiStateEvent.port.type === 'output') {
            commit(ADD_MIDI_OUTPUT, midiStateEvent.port)
        } else if (midiStateEvent.port.state === 'disconnected' && midiStateEvent.port.type === 'output') {
            commit(REMOVE_MIDI_OUTPUT, midiStateEvent.port)
        }
        dispatch(REFRESH_MIDI_INPUTS_OUTPUTS)
    },
    [REFRESH_MIDI_INPUTS_OUTPUTS]({commit}) {
        commit(REFRESH_MIDI_INPUTS_OUTPUTS)
    },
    [CLOSE_MIDI_PORT]({getters}, inputId) {
        getters.midiInputs.filter(input => input.id === inputId)[0].close()
    },
    [OPEN_MIDI_PORT]({getters}, inputId) {
        getters.midiInputs.filter(input => input.id === inputId)[0].open()
    },
    async [TOGGLE_MIDI_CONNECTION_INPUT] ({getters, commit, dispatch}, inputId) {
        if (getters.isMidiInputConnectionStatusOpen(inputId)) {
            await dispatch(CLOSE_MIDI_INPUT, inputId)
        } else if (!getters.isMidiInputConnectionStatusOpen(inputId)) {
            await dispatch(OPEN_MIDI_INPUT, inputId)
        }
    },
    async [TOGGLE_MIDI_CONNECTION_OUTPUT] ({getters, commit, dispatch}, inputId) {
        if (getters.isMidiOutputConnectionStatusOpen(inputId)) {
            await dispatch(CLOSE_MIDI_OUTPUT, inputId)
        } else if (!getters.isMidiOutputConnectionStatusOpen(inputId)) {
            await dispatch(OPEN_MIDI_OUTPUT, inputId)
        }
    },
}
