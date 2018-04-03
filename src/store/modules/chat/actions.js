import Message from "../../../socket/models/Message";
import {ADD_MESSAGE, REPLACE_MESSAGE, SET_ENABLED} from "./mutations";

export const USER_SEND_MESSAGE = "USER_SEND_MESSAGE"
export const USER_EDIT_MESSAGE = "USER_EDIT_MESSAGE"
export const CHANGE_CHAT_STATUS = "CHANGE_CHAT_STATUS"

export default {
    [USER_SEND_MESSAGE](context, {user, message}) {
        this._vm.$socket.emit('userSendMessage', {user, message})
    },
    [USER_EDIT_MESSAGE](context, {user, message, newBody}) {
        this._vm.$socket.emit('userEditMessage', {user, message, newBody})
    },
    socket_userHasEditedMessage({commit}, socketMessage) {
        commit(REPLACE_MESSAGE, new Message(socketMessage))
    },
    socket_userHasSentMessage({commit}, socketMessage) {
        let message = new Message(socketMessage);
        commit(ADD_MESSAGE, message)
    },
    [CHANGE_CHAT_STATUS](context, chatEnabled) {
        this._vm.$socket.emit('userChangedChatStatus', chatEnabled)
    }

}