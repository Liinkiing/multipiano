import MIDIWrapper from "../../wrappers/MIDIWrapper";

const state = {
    midiAccess: null
}

const getters = {
    midiInputs: state => {
        console.log(state.midiAccess.inputs)
        return state.midiAccess.inputs
    },
    midiInput: state => id => {
        return state.midiAccess.inputs.find(input => input.id === id)
    },
    midiPortState: state => id => {
        return state.midiAccess.inputs.find(input => input.id === id).state
    },
    midiPortConnectionStatus: state => id => {
        return state.midiAccess.inputs.find(input => input.id === id).connection
    },
    midiOutputs: state => {
        if (!state.midiAccess) return []
        return state.midiAccess.outputs
    }
}

const mutations = {
    setMidiAccess(state, midiAccess) {
        state.midiAccess = midiAccess
    },
    addMidiInput(state, input) {
        if (state.midiAccess.inputs.filter(i => i.id === input.id).length > 0) return
        state.midiAccess.inputs.push(input)
        state.midiAccess.init()
    },
    removeMidiInput(state, input) {
        if (state.midiAccess.inputs.filter(i => i.id === input.id).length === 0) return
        state.midiAccess.inputs = state.midiAccess.inputs.filter(i => i.id !== input.id)
        state.midiAccess.init()
    },
    addMidiOutput(state, output) {
        if (state.midiAccess.outputs.filter(o => o.id === output.id).length > 0) return
        state.midiAccess.outputs.push(output)
        state.midiAccess.init()
    },
    removeMidiOutput(state, output) {
        if (state.midiAccess.outputs.filter(o => o.id === output.id).length === 0) return
        state.midiAccess.outputs = state.midiAccess.outputs.filter(o => o.id !== output.id)
        state.midiAccess.init()
    },
    openMidiInput(state, input) {
        state.midiAccess.inputs.filter(i => i.id === input.id)[0].open()
    },
    closeMidiInput(state, input) {
        state.midiAccess.inputs.filter(i => i.id === input.id)[0].close()
    },
    openMidiOutput(state, output) {
        state.midiAccess.outputs.filter(o => o.id === output.id)[0].open()
    },
    closeMidiOutput(state, output) {
        state.midiAccess.outputs.filter(o => o.id === output.id)[0].close()
    }
}

const actions = {
    async getMidiAccess({commit}) {
        commit('setMidiAccess', await MIDIWrapper.requestMidiAccess())
    },
    addMidiInput({commit, state}, input) {
        commit('addMidiInput', input)
    },
    removeMidiInput({commit, state}, input) {
        commit('removeMidiInput', input)
    },
    addMidiOutput({commit, state}, output) {
        commit('addMidiOutput', output)
    },
    removeMidiOutput({commit, state}, output) {
        commit('removeMidiOutput', output)
    },
    openMidiInput({commit, state}, input) {
        commit('openMidiInput', input)
    },
    closeMidiInput({commit, state}, input) {
        commit('closeMidiInput', input)
    },
    openMidiOutput({commit, state}, output) {
        commit('openMidiOutput', output)
    },
    closeMidiOutput({commit, state}, output) {
        commit('closeMidiOutput', output)
    },
    refreshMidi({commit}, midiStateEvent) {
        if (midiStateEvent.port.state === 'connected' && midiStateEvent.port.type === 'input') {
            commit('addMidiInput', midiStateEvent.port)
        } else if (midiStateEvent.port.state === 'disconnected' &&  midiStateEvent.port.type === 'input') {
            commit('removeMidiInput', midiStateEvent.port)
        }
        else if (midiStateEvent.port.state === 'connected' && midiStateEvent.port.type === 'output') {
            commit('addMidiOutput', midiStateEvent.port)
        } else if (midiStateEvent.port.state === 'disconnected' && midiStateEvent.port.type === 'output') {
            commit('removeMidiOutput', midiStateEvent.port)
        }
    },
    closeMidiPort({getters}, inputId) {
        getters.midiInputs.filter(input => input.id === inputId)[0].close()
    },
    openMidiPort({getters}, inputId) {
        getters.midiInputs.filter(input => input.id === inputId)[0].open()
    },
    toggleMidiConnectionInput({getters, commit}, inputId) {
        if (getters.midiPortConnectionStatus(inputId) === 'open') {
            commit('closeMidiInput', getters.midiInput(inputId))
        } else if (getters.midiPortConnectionStatus(inputId) === 'closed') {
            commit('openMidiInput', getters.midiInput(inputId))
        }
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}