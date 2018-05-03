import Vue from 'vue'
import Vuex from 'vuex'
import piano from './modules/piano/'
import users from './modules/users/'
import rooms from './modules/rooms'
import chat from './modules/chat'
import app from './modules/app'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        piano,
        users,
        rooms,
        chat,
        app
    }
})
