import {ADD_MUTED_USER, REMOVE_MUTED_USER, RESET_MUTED_USERS, SET_CURRENT_USER, SET_USERNAME} from "./mutations";

export const USER_EDIT_USERNAME = "USER_EDIT_USERNAME";
export const USER_ADD_MUTED_USER = "USER_ADD_MUTED_USER";
export const USER_REMOVE_MUTED_USER = "USER_REMOVE_MUTED_USER";
export const USER_RESET_MUTED_USER = "USER_RESET_MUTED_USER";

export default {
    socket_meConnected({commit}, me) {
        commit(SET_CURRENT_USER, me)
    },
    [USER_EDIT_USERNAME] ({commit, state}, username) {
        commit(SET_USERNAME, username)
        this._vm.$socket.emit('userEditUsername', state.currentUser.id, username);
    },
    [USER_ADD_MUTED_USER] ({commit}, user) {
        commit(ADD_MUTED_USER, user)
    },
    [USER_REMOVE_MUTED_USER] ({commit}, user) {
        commit(REMOVE_MUTED_USER, user)
    },
    [USER_RESET_MUTED_USER] ({commit}, user) {
        commit(RESET_MUTED_USERS, user)
    },

}