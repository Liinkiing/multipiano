import MIDIWrapper from "../../../wrappers/MIDIWrapper";
import audioEngine from '../../../components/audio/AudioEngine'
import {
    ADD_MIDI_INPUT,
    ADD_MIDI_OUTPUT,
    REMOVE_MIDI_INPUT,
    REMOVE_MIDI_OUTPUT,
    SET_MIDI_ACCESS,
    REFRESH_MIDI_INPUTS_OUTPUTS as MUTATION_REFRESH_MIDI_INPUTS_OUTPUTS,
    SET_PIANO_NOTES as MUTATION_SET_PIANO_NOTES, SET_PIANO_TYPE, ADD_NOTE_PLAYING, REMOVE_NOTE_PLAYING
} from "./mutations";

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
export const CHANGE_PIANO_TYPE = "CHANGE_PIANO_TYPE"
export const USER_PLAY_NOTE = "USER_PLAY_NOTE"
export const USER_RELEASE_NOTE = "USER_RELEASE_NOTE"

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
    [SET_PIANO_NOTES]({commit}, keys) {
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
    async [TOGGLE_MIDI_CONNECTION_INPUT]({getters, dispatch}, inputId) {
        if (getters.isMidiInputConnectionStatusOpen(inputId)) {
            await dispatch(CLOSE_MIDI_INPUT, inputId)
        } else if (!getters.isMidiInputConnectionStatusOpen(inputId)) {
            await dispatch(OPEN_MIDI_INPUT, inputId)
        }
    },
    [USER_PLAY_NOTE]({commit}, {note, volume}, stopDelay) {
        if (note) {
            note.timestamp = Date.now()
            commit(ADD_NOTE_PLAYING, note)
            audioEngine.play(note, volume, stopDelay)
        }
    },
    [USER_RELEASE_NOTE]({commit}, {note, delay, sustained}) {
        if (note) {
            commit(REMOVE_NOTE_PLAYING, note)
            audioEngine.stop(note, delay, sustained)
        }
    },
    async [TOGGLE_MIDI_CONNECTION_OUTPUT]({getters, dispatch}, inputId) {
        if (getters.isMidiOutputConnectionStatusOpen(inputId)) {
            await dispatch(CLOSE_MIDI_OUTPUT, inputId)
        } else if (!getters.isMidiOutputConnectionStatusOpen(inputId)) {
            await dispatch(OPEN_MIDI_OUTPUT, inputId)
        }
    },
    [CHANGE_PIANO_TYPE]({commit}, type) {
        commit(SET_PIANO_TYPE, type)
    }
}
