import {SET_ROOM} from "./mutations";
import {REMOVE_USER} from "../users/mutations";

export const CHANGE_ROOM = "CHANGE_ROOM"

export default {
    [CHANGE_ROOM] ({state, commit}, room) {
        commit(SET_ROOM, room)
        this._vm.$socket.emit('room', state.currentRoom);
    },
    socket_leaveRoom ({dispatch}, {user, room}) {
    },
}