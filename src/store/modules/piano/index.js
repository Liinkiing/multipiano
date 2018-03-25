import MIDIWrapper from "../../../wrappers/MIDIWrapper";
import mutations from './mutations'
import actions from './actions'

const state = {
    midiAccess: null,
    inputs: [],
    outputs: [],
}

const getters = {
    midiInputs: state => {
        return state.midiAccess.inputs
    },
    midiOutputs: state => {
        return state.midiAccess.outputs
    },
    isMidiInputConnectionStatusOpen: state => id => {
        let result = state.inputs.find(input => input.id === id);
        if (!result) return false
        return 'connection' in result ? result.connection === 'open' : false
    },
    isMidiOutputConnectionStatusOpen: state => id => {
        let result = state.outputs.find(output => output.id === id);
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