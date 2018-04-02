import Message from "../../../socket/models/Message";
import {ADD_MESSAGE} from "./mutations";

export const USER_SEND_MESSAGE = "USER_SEND_MESSAGE"

export default {

    [USER_SEND_MESSAGE]({commit}, {user, message}) {
        this._vm.$socket.emit('userSendMessage', {user, message})
    },
    socket_userHasSentMessage({commit}, socketMessage) {
        let message = new Message(socketMessage);
        console.log(message)
        commit(ADD_MESSAGE, message)
    }

}