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
    type: 'stage_grand',
    playingNotes: [],
    notes: pianoKeys.map(key => new Note(key))
}

const getters = {
    pianoType: state => {
        return state.type
    },
    playingNotes: state => {
        return state.playingNotes
    },
    pianoNotes: state => {
        return state.notes
    },
    midiInputs: state => {
        return state.midi.midiAccess.inputs
    },
    midiOutputs: state => {
        return state.midi.midiAccess.outputs
    },
    midiAccess: state => {
        return state.midi.midiAccess
    },
    note: state => note => {
        return state.notes.find(n => n.keyname === note.keyname)
    },
    isMidiInputConnectionStatusOpen: state => id => {
        let result = state.midi.inputs.find(input => input.id === id);
        if (!result) return false
        return 'connection' in result ? result.connection === 'open' : false
    },
    isMidiOutputConnectionStatusOpen: state => id => {
        let result = state.midi.outputs.find(output => output.id === id);
        if (!result) return false
        return 'connection' in result ? result.connection === 'open' : false
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}