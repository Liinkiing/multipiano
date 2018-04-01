import {REPLACE_USER, SET_ROOM, SET_ROOMS} from "./mutations";

export const CHANGE_ROOM = "CHANGE_ROOM"

export default {
    [CHANGE_ROOM] ({state, commit, rootState}, roomName) {
        const from = state.currentRoom.name
        const to = roomName
        this._vm.$socket.emit('joinRoom', {from, to});
    },
    socket_userHasEditedUsername({commit}, user) {
        commit(REPLACE_USER, user)
    },
    socket_getRooms({commit}, rooms) {
        commit(SET_ROOMS, rooms)
    },
    socket_updateRoom({commit}, room) {
        commit(SET_ROOM, room)
    },
    socket_userDisconnectedFromRoom ({commit}, room) {
        commit(SET_ROOM, room)
    }
}