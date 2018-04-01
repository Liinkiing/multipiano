import {SET_CURRENT_ROOM_NAME, SET_ROOMS} from "./mutations";

export const CHANGE_ROOM = "CHANGE_ROOM"

export default {
    [CHANGE_ROOM] ({state, commit, rootState}, roomName) {
        const from = state.currentRoom
        commit(SET_CURRENT_ROOM_NAME, roomName)
        const to = roomName
        this._vm.$socket.emit('joinRoom', {from, to});
    },
    socket_getRooms({commit}, rooms) {
        commit(SET_ROOMS, rooms)
    }
}