import pianoKeys from '../../../components/midi/piano_keys'
import mutations from './mutations'
import actions from './actions'
import Note from "../../../components/midi/Note";


const state = {
    midi: {
        midiAccess: null,
        inputs: [],
        outputs: []
    },
    octaveOffset: 0,
    type: 'stage_grand',
    canPlay: true,
    canPlayKeyboard: true,
    notes: pianoKeys.map(key => new Note(key)),
    keysdown: {}
}

const getters = {
    pianoType: state => {
        return state.type
    },
    playingNotes: state => {
        return state.notes.filter(note => note.playing)
    },
    pianoNotes: state => {
        return state.notes
    },
    midiInputs: state => {
        return state.midi.midiAccess ? state.midi.midiAccess.inputs : null
    },
    midiOutputs: state => {
        return state.midi.midiAccess ? state.midi.midiAccess.outputs : null
    },
    midiAccess: state => {
        return state.midi.midiAccess
    },
    getNote: state => note => {
        return state.notes.find(n => n.keyname === note.keyname)
    },
    getNoteByKeycode: state => keycode => {
        return state.notes.find(key => key.keyCodes && key.keyCodes.includes(keycode))
    },
    isMidiInputConnectionStatusOpen: state => id => {
        if (!state.midi.inputs) return false
        let result = state.midi.inputs.find(input => input.id === id);
        if (!result) return false
        return 'connection' in result ? result.connection === 'open' : false
    },
    isMidiOutputConnectionStatusOpen: state => id => {
        if (!state.midi.outputs) return false
        let result = state.midi.outputs.find(output => output.id === id);
        if (!result) return false
        return 'connection' in result ? result.connection === 'open' : false
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
