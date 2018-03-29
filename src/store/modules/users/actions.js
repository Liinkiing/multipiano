import {ADD_USER, REMOVE_USER, SET_CURRENT_USER, SET_USERS} from "./mutations";

export default {
    socket_userConnected ({commit}, socketUser) {
        commit(ADD_USER, socketUser)
    },

    socket_userDisconnected ({commit}, socketId) {
        commit(REMOVE_USER, socketId)
    },

    socket_meConnected({commit}, {me, others}) {
        commit(SET_CURRENT_USER, me)
        commit(SET_USERS, others)
    }
}