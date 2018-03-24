import Vue from 'vue'
import Router from 'vue-router'
import Room from './views/Room.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: Room,
            props: { roomName: null }
        },
        {
            path: '/:roomName',
            name: 'room.view',
            component: Room,
            props: true
        }
    ]
})
