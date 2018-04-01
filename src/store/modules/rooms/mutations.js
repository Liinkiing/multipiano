import User from "../../../socket/models/User";

export const SET_CURRENT_ROOM_NAME = "SET_CURRENT_ROOM_NAME"
export const SET_ROOMS = "SET_ROOMS"
export const ADD_ROOM = "ADD_ROOM"
export const DELETE_ROOM = "DELETE_ROOM"
export const ADD_USER = "ADD_USER"
export const REMOVE_USER = "REMOVE_USER"
export const SET_USERS = "SET_USERS"


export default {
    [SET_CURRENT_ROOM_NAME] (state, roomName) {
        state.currentRoom = roomName
    },
    [SET_ROOMS] (state, rooms) {
        state.rooms = rooms
    },
    [ADD_ROOM] (state, room) {
        state.rooms.push(room)
    },
    [DELETE_ROOM] (state, room) {
        state.rooms = state.rooms.filter(r => r.id !== room.id)
    },
    [ADD_USER] (state, socketUser) {
        state.currentRoom.users.push(new User(socketUser))
    },
    [REMOVE_USER] (state, socketUser) {
        state.currentRoom.users = state.currentRoom.users.filter(user => user.id !== socketUser.id)
    },
    [SET_USERS] (state, users) {
        state.currentRoom.users = users
    },
}