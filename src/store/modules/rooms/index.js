import actions from "./actions";
import mutations from "./mutations";
import {HOME_ID} from "../../../router";

const state = {
    currentRoom: HOME_ID,
    rooms: []
}

const getters = {
    currentRoom: state => {
        return state.rooms.find(room => room.name === state.currentRoom) || null
    },
    homeCount: state => {
        return state.rooms.find(room => room.id === HOME_ID) ? state.rooms.find(room => room.id === HOME_ID).usersCount : 0
    },
    isHomepage: state => {
        return state.currentRoom === HOME_ID
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}