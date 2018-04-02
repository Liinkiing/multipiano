import actions from "./actions";
import mutations from "./mutations";

const state = {
    messages: []
}

const getters = {

    lastUserMessage: (state, getters, rootState) => {
        return [...state.messages]
            .filter(message => message.user.id === rootState.users.currentUser.id)
            .sort((a, b) => b.createdAt - a.createdAt)[0] || null
    }

}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}