import Vue from 'vue'
import Router from 'vue-router'
import Room from './views/Room.vue'

export const HOME_ID = 'multipiano'

Vue.use(Router)

export const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: Room,
            props: { room: {name: 'Multipiano', id: HOME_ID} }
        },
        {
            path: '/:roomName',
            name: 'room.view',
            component: Room,
            props: route => ({room: {name: route.params.roomName, id: route.params.roomName}})
        }
    ]
})
