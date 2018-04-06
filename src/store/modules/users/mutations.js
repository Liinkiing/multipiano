import User from "../../../socket/models/User.js";

export const SET_CURRENT_USER = "SET_CURRENT_USER"
export const SET_USERNAME = "SET_USERNAME"
export const ADD_MUTED_USER = "ADD_MUTED_USER"
export const REMOVE_MUTED_USER = "REMOVE_MUTED_USER"
export const RESET_MUTED_USERS = "RESET_MUTED_USERS"
export const SET_COLOR = "SET_COLOR"

export default {

    [SET_CURRENT_USER] (state, socketUser) {
        state.currentUser = new User(socketUser)
    },
    [SET_USERNAME] (state, username) {
        state.currentUser.username = username
    },
    [ADD_MUTED_USER] (state, user) {
        state.mutedUsers.push(user)
    },
    [REMOVE_MUTED_USER] (state, user) {
       state.mutedUsers = state.mutedUsers.filter(u => u.id !== user.id)
    },
    [RESET_MUTED_USERS] (state) {
        state.mutedUsers = []
    },
    [SET_COLOR] (state, color) {
        state.currentUser.color = color
    }
}