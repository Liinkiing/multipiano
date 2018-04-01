import {SET_CURRENT_USER, SET_USERNAME} from "./mutations";

export const USER_EDIT_USERNAME = "USER_EDIT_USERNAME";

export default {
    socket_meConnected({commit}, me) {
        commit(SET_CURRENT_USER, me)
    },
    [USER_EDIT_USERNAME] ({commit, state}, username) {
        commit(SET_USERNAME, username)
        this._vm.$socket.emit('userEditUsername', state.currentUser.id, username);
    },

}