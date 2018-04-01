import actions from "./actions";
import mutations from "./mutations";
import {HOME_ID} from "../../../router";

const state = {
    currentRoom: {
        id: HOME_ID,
        name: 'Multiplayer Piano',
        users: [],
        usersCount: 0,
    },
    rooms: []
}

const getters = {

}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}