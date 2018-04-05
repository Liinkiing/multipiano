import {SET_CURRENT_ROOM_NAME, SET_ROOMS} from "./mutations";
import {CLEAR_CHAT} from "../chat/mutations";
export const CHANGE_PUBLIC_ROOM_STATUS = "CHANGE_PUBLIC_ROOM_STATUS"


export const CHANGE_ROOM = "CHANGE_ROOM"

export default {
    [CHANGE_ROOM] ({state, commit}, roomName) {
        const from = state.currentRoom
        commit(`chat/${CLEAR_CHAT}`, null, { root: true })
        commit(SET_CURRENT_ROOM_NAME, roomName)
        const to = roomName
        this._vm.$socket.emit('joinRoom', {from, to});
    },
    socket_getRooms({commit}, rooms) {
        commit(SET_ROOMS, rooms)
    },
    [CHANGE_PUBLIC_ROOM_STATUS](context, publicRoom) {
        this._vm.$socket.emit('userChangedPublicRoomStatus', publicRoom)
    }
}