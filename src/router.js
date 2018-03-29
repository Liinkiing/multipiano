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
            props: { room: {name: 'Multiplayer Piano', id: 'home'} }
        },
        {
            path: '/:roomName',
            name: 'room.view',
            component: Room,
            props: route => ({room: {name: route.params.roomName, id: route.params.roomName}})
        }
    ]
})
