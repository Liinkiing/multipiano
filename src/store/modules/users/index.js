import actions from "./actions";
import mutations from "./mutations";

const state = {
    currentUser: {
        id: null,
        username: 'Linking',
        color: 'yellow'
    },
    mutedUsers: []
}

const getters = {
    usersInroom: (state, getters, rootState, rootGetters) => {
        return rootGetters['rooms/currentRoom'] ? rootGetters['rooms/currentRoom'].users : []
    },
    othersInroom: (state, getters) => {
        return getters.usersInroom.filter(user => user.id !== state.currentUser.id)
    },
    isHost: (state, getters, rootState, rootGetters) => user => {
        if (!user) return false
        if (!rootGetters['rooms/currentRoom']) return false
        if (!rootGetters['rooms/currentRoom'].host) return false
        return rootGetters['rooms/currentRoom'].host.id === user.id
    },
    currentUserIsHost: (state, getters, rootState, rootGetters) => {
        if (!rootGetters['rooms/currentRoom']) return false
        if (!rootGetters['rooms/currentRoom'].host) return false
        return rootGetters['rooms/currentRoom'].host.id === state.currentUser.id
    },
    isMuted: state => user => {
        return state.mutedUsers.find(u => u.id === user.id) !== undefined
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}