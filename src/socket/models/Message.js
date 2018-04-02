export default class Message {

    constructor(socketMessage) {
        this.id = socketMessage.id
        this.user = socketMessage.user;
        this.body = socketMessage.body
        this.createdAt = socketMessage.createdAt;
        this.editedAt = socketMessage.editedAt || null;
    }

}
