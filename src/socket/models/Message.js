export default class Message {

    constructor(socketMessage) {
        this._id = socketMessage.id
        this._user = socketMessage.user;
        this._body = socketMessage.body
        this._createdAt = socketMessage.createdAt;
    }

    get id () {
        return this._id
    }

    get user() {
        return this._user;
    }

    get body() {
        return this._body;
    }

    get createdAt() {
        return this._createdAt;
    }

}
