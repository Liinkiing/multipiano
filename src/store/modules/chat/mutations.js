export const ADD_MESSAGE = "ADD_MESSAGE"

export default {

    [ADD_MESSAGE](state, message) {
        state.messages = { ...state.messages, ...{[message.id]: message}}
    }

}