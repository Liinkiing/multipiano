import User from "../../../socket/models/User.mjs";

export const ADD_USER = "ADD_USER"
export const REMOVE_USER = "REMOVE_USER"
export const SET_CURRENT_USER = "SET_CURRENT_USER"
export const SET_USERS = "SET_USERS"

export default {
    [ADD_USER] (state, socketUser) {
        state.users.push(new User(socketUser))
    },
    [REMOVE_USER] (state, socketId) {
        state.users = state.users.filter(user => user.id !== socketId)
    },
    [SET_USERS] (state, users) {
        state.users = users
    },
    [SET_CURRENT_USER] (state, socketUser) {
        state.currentUser = new User(socketUser)
    }
}