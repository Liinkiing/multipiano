import User from "../../../socket/models/User.js";

export const ADD_USER = "ADD_USER"
export const REMOVE_USER = "REMOVE_USER"
export const SET_CURRENT_USER = "SET_CURRENT_USER"
export const SET_USERS = "SET_USERS"
export const SET_USERNAME = "SET_USERNAME"
export const REPLACE_USER = "REPLACE_USER"

export default {
    [ADD_USER] (state, socketUser) {
        state.users.push(new User(socketUser))
    },
    [REPLACE_USER] (state, user) {
        state.users = state.users.map(u => {
            if (u.id === user.id) {
                return user
            }
            return u
        });
    },
    [REMOVE_USER] (state, socketUser) {
        state.users = state.users.filter(user => user.id !== socketUser.id)
    },
    [SET_USERS] (state, users) {
        state.users = users
    },
    [SET_CURRENT_USER] (state, socketUser) {
        state.currentUser = new User(socketUser)
    },
    [SET_USERNAME] (state, username) {
        state.currentUser.username = username
    }
}