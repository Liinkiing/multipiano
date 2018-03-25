import MIDIWrapper from "../../wrappers/MIDIWrapper";

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
        if(!result) return false
        return 'connection' in result ? result.connection === 'open' : false
    },
    isMidiOutputConnectionStatusOpen: state => id => {
        let result = state.outputs.find(output => output.id === id);
        if(!result) return false
        return 'connection' in result ? result.connection === 'open' : false
    }
}

const mutations = {
    setMidiAccess(state, midiAccess) {
        state.midiAccess = midiAccess
        state.inputs = state.midiAccess.inputsConnectionStatus
        state.outputs = state.midiAccess.outputsConnectionStatus
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
    refreshMidiInputsOutputs(state) {
        state.inputs = state.midiAccess.inputsConnectionStatus
        state.outputs = state.midiAccess.outputsConnectionStatus
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
    async openMidiInput({commit, state}, inputId) {
        await state.midiAccess.inputs.filter(i => i.id === inputId)[0].open()
        commit('refreshMidiInputsOutputs')
    },
    async closeMidiInput({state, commit}, inputId) {
        await state.midiAccess.inputs.filter(i => i.id === inputId)[0].close()
        commit('refreshMidiInputsOutputs')
    },
    async openMidiOutput({state, commit}, outputId) {
        await state.midiAccess.outputs.filter(o => o.id === outputId)[0].open()
        commit('refreshMidiInputsOutputs')
    },
    async closeMidiOutput({state, commit}, outputId) {
        await state.midiAccess.outputs.filter(o => o.id === outputId)[0].close()
        commit('refreshMidiInputsOutputs')
    },
    refreshMidi({commit, dispatch}, midiStateEvent) {
        if (midiStateEvent.port.state === 'connected' && midiStateEvent.port.type === 'input') {
            commit('addMidiInput', midiStateEvent.port)
        } else if (midiStateEvent.port.state === 'disconnected' && midiStateEvent.port.type === 'input') {
            commit('removeMidiInput', midiStateEvent.port)
        }
        else if (midiStateEvent.port.state === 'connected' && midiStateEvent.port.type === 'output') {
            commit('addMidiOutput', midiStateEvent.port)
        } else if (midiStateEvent.port.state === 'disconnected' && midiStateEvent.port.type === 'output') {
            commit('removeMidiOutput', midiStateEvent.port)
        }
        dispatch('refreshMidiInputsOutputs')
    },
    refreshMidiInputsOutputs({commit}) {
        commit('refreshMidiInputsOutputs')
    },
    closeMidiPort({getters}, inputId) {
        getters.midiInputs.filter(input => input.id === inputId)[0].close()
    },
    openMidiPort({getters}, inputId) {
        getters.midiInputs.filter(input => input.id === inputId)[0].open()
    },
    async toggleMidiConnectionInput({getters, commit, dispatch}, inputId) {
        if (getters.isMidiInputConnectionStatusOpen(inputId)) {
            await dispatch('closeMidiInput', inputId)
        } else if (!getters.isMidiInputConnectionStatusOpen(inputId)) {
            await dispatch('openMidiInput', inputId)
        }
    },
    async toggleMidiConnectionOutput({getters, commit, dispatch}, inputId) {
        if (getters.isMidiOutputConnectionStatusOpen(inputId)) {
            await dispatch('closeMidiOutput', inputId)
        } else if (!getters.isMidiOutputConnectionStatusOpen(inputId)) {
            await dispatch('openMidiOutput', inputId)
        }
    },
}

export default {
    state,
    getters,
    actions,
    mutations
}