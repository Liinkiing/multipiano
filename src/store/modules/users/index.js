import actions from "./actions";
import mutations from "./mutations";

const state = {
    currentUser: {
        id: null,
        username: 'Linking',
        color: 'yellow'
    },
    users: []
}

const getters = {
    others: state => {
        return state.users.filter(user => user.id !== state.currentUser.id)
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}