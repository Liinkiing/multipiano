import Vue from 'vue'
import Router from 'vue-router'
import Room from './views/Room.vue'

export const HOME_ID = 'multiplayer-piano'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: Room,
            props: { room: {name: 'Multiplayer Piano', id: HOME_ID} }
        },
        {
            path: '/:roomName',
            name: 'room.view',
            component: Room,
            props: route => ({room: {name: route.params.roomName, id: route.params.roomName}})
        }
    ]
})
