export default class User {

    constructor (socketUser) {
        this.id = socketUser.id
        this.ip = socketUser.ip
        this.username = socketUser.username
        this.color = socketUser.color
    }

}