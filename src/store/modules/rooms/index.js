import actions from "./actions";
import mutations from "./mutations";

const state = {
    currentRoom: {
        id: 'home',
        name: 'Multiplayer Piano'
    }
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