export const REPLACE_MESSAGE = "REPLACE_MESSAGE"
export const ADD_MESSAGE = "ADD_MESSAGE"
export const CLEAR_CHAT = "CLEAR_CHAT"

export default {

    [CLEAR_CHAT](state) {
        state.messages = []
    },

    [ADD_MESSAGE](state, message) {
        state.messages.push(message)
    },

    [REPLACE_MESSAGE](state, newMessage) {
        state.messages = state.messages.map(message => {
            if (message.id === newMessage.id) {
                return newMessage
            }
            return message
        })
    }
}