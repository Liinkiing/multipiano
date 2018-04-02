import MIDIWrapper from "../../../wrappers/MIDIWrapper";
import AudioEngine from '../../../components/audio/AudioEngine'
import {
    ADD_MIDI_INPUT,
    ADD_MIDI_OUTPUT,
    REMOVE_MIDI_INPUT,
    REMOVE_MIDI_OUTPUT,
    SET_CAN_PLAY,
    SET_MIDI_ACCESS,
    REFRESH_MIDI_INPUTS_OUTPUTS as MUTATION_REFRESH_MIDI_INPUTS_OUTPUTS,
    SET_PIANO_NOTES as MUTATION_SET_PIANO_NOTES, SET_PIANO_TYPE, ADD_NOTE_PLAYING, REMOVE_NOTE_PLAYING,
    DELETE_ALL_KEYS_DOWN, SET_CAN_PLAY_KEYBOARD
} from "./mutations";
import Note from "../../../components/midi/Note";
import {SOURCE_KEYBOARD} from "../../../components/midi/constants";

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
export const USER_CAN_PLAY = "USER_CAN_PLAY"
export const USER_CANT_PLAY = "USER_CANT_PLAY"
export const USER_CAN_PLAY_WITH_KEYBOARD = "USER_CAN_PLAY_WITH_KEYBOARD"
export const USER_CANT_PLAY_WITH_KEYBOARD = "USER_CANT_PLAY_WITH_KEYBOARD"
export const USER_RELEASE_SUSTAIN = "USER_RELEASE_SUSTAIN"
export const CLEAR_PIANO_PLAYING = "CLEAR_PIANO_PLAYING"

export default {
    async GET_MIDI_ACCESS({commit}) {
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
    [USER_CAN_PLAY]({commit}) {
        commit(SET_CAN_PLAY, true)
    },
    [USER_CANT_PLAY]({commit}) {
        commit(SET_CAN_PLAY, false)
    },
    [USER_CAN_PLAY_WITH_KEYBOARD]({commit}) {
        commit(SET_CAN_PLAY_KEYBOARD, true)
    },
    [USER_CANT_PLAY_WITH_KEYBOARD]({commit}) {
        commit(SET_CAN_PLAY_KEYBOARD, false)
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
    [USER_PLAY_NOTE]({commit, rootState}, {note, volume, source}, stopDelay) {
        if (note) {
            note.timestamp = Date.now()
            if (!note.users.find(user => rootState.users.currentUser.id === user.id)) {
                note.users.push(rootState.users.currentUser)
            }
            note.volume = volume
            note.source = source || SOURCE_KEYBOARD
            commit(ADD_NOTE_PLAYING, note)
            this._vm.$socket.emit('userPlayNote', note);
            AudioEngine.play(note, note.volume, stopDelay)
        }
    },
    socket_userHasPlayedNote({commit}, payload) {
        let note = new Note(payload)
        if (note) {
            commit(ADD_NOTE_PLAYING, note)
            AudioEngine.play(note, note.volume, 1.5)
        }
    },
    [USER_RELEASE_NOTE]({commit, rootState}, {note, delay, sustained}) {
        if (note) {
            if (note.users.find(user => rootState.users.currentUser.id === user.id)) {
                note.users = note.users.filter(user => user.id !== rootState.users.currentUser.id)
            }
            commit(REMOVE_NOTE_PLAYING, note)
            AudioEngine.stop(note, delay, sustained)
            this._vm.$socket.emit('userReleaseNote', {note, delay, sustained});
        }
    },
    [CLEAR_PIANO_PLAYING]({commit, getters, dispatch}) {
        getters.playingNotes.forEach(note => {
            dispatch(USER_RELEASE_NOTE, {
                note,
                delay: 3,
                sustained: false
            })
        })
        commit(DELETE_ALL_KEYS_DOWN)
    },
    [USER_RELEASE_SUSTAIN](context, notes) {
        AudioEngine.stopBufferedSoundsExcept(notes)
        this._vm.$socket.emit('userReleaseSustain', notes);
    },
    socket_userHasReleasedSustain(context, notes) {
        AudioEngine.stopBufferedSoundsExcept(notes)
    },
    socket_userHasReleasedNote({commit}, {note, sustained}) {
        let _note = new Note(note)
        if (_note) {
            commit(REMOVE_NOTE_PLAYING, _note)
            AudioEngine.stop(_note, 1.5, sustained)
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
