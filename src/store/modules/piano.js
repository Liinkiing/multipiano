import MIDIWrapper from "../../wrappers/MIDIWrapper";

const state = {
    midiAccess: null
}

const getters = {
    midiInputs: state => {
        if(!state.midiAccess) return []
        return state.midiAccess.inputs
    },
    midiOutputs: state => {
        if(!state.midiAccess) return []
        return state.midiAccess.outputs
    }
}

const mutations = {
    setMidiAccess(state, midiAccess) {
        state.midiAccess = midiAccess
    }
}

const actions = {
    async getMidiAccess({commit}) {
        commit('setMidiAccess', await MIDIWrapper.requestMidiAccess())
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}