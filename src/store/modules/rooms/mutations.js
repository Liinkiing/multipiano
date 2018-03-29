export const SET_ROOM = "SET_ROOM"

export default {

    [SET_ROOM] (state, room) {
        state.currentRoom = room
    }

}