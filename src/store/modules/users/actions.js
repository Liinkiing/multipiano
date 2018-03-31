import {ADD_USER, REMOVE_USER, REPLACE_USER, SET_CURRENT_USER, SET_USERNAME, SET_USERS} from "./mutations";

export const USER_EDIT_USERNAME = "USER_EDIT_USERNAME";

export default {
    socket_userConnected ({commit}, socketUser) {
        commit(ADD_USER, socketUser)
    },

    socket_userDisconnected ({commit}, socketUser) {
        commit(REMOVE_USER, socketUser)
    },

    socket_meConnected({commit}, {me, others}) {
        commit(SET_CURRENT_USER, me)
        commit(SET_USERS, others)
    },
    [USER_EDIT_USERNAME] ({commit, state}, username) {
        commit(SET_USERNAME, username)
        this._vm.$socket.emit('userEditUsername', state.currentUser.id, username);
    },
    socket_userHasEditedUsername({commit}, user) {
        commit(REPLACE_USER, user)
    }
}