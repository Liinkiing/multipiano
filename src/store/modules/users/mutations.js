import User from "../../../socket/models/User.js";

export const SET_CURRENT_USER = "SET_CURRENT_USER"
export const SET_USERNAME = "SET_USERNAME"

export default {

    [SET_CURRENT_USER] (state, socketUser) {
        state.currentUser = new User(socketUser)
    },
    [SET_USERNAME] (state, username) {
        state.currentUser.username = username
    }
}