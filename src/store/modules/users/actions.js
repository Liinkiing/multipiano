import Vue from "vue";
import {
ADD_MUTED_USER, REMOVE_MUTED_USER, RESET_MUTED_USERS, SET_COLOR, SET_CURRENT_USER,
SET_USERNAME
} from "./mutations";
import { router } from '../../../router'
export const USER_EDIT_USERNAME = "USER_EDIT_USERNAME";
export const USER_ADD_MUTED_USER = "USER_ADD_MUTED_USER";
export const USER_REMOVE_MUTED_USER = "USER_REMOVE_MUTED_USER";
export const USER_RESET_MUTED_USER = "USER_RESET_MUTED_USER";
export const USER_EDIT_COLOR = "USER_EDIT_COLOR";
export const KICK_USER = "KICK_USER";
export const BAN_USER = "BAN_USER";
export const UNBAN_USER = "UNBAN_USER";

export default {
    socket_meConnected({commit}, me) {
        commit(SET_CURRENT_USER, me)
    },
    socket_userKicked() {
        router.push('/')
        Vue.prototype.$notify({
            group: 'notifications',
            type: 'warn',
            title: "You've been kicked",
            text: 'Sorry! You have been kicked from this room :('
        });
    },
    socket_userBanned(context, duration) {
        router.push('/')
        Vue.prototype.$notify({
            group: 'notifications',
            type: 'warn',
            title: "You're banned",
            text: `Sorry! You are banned from this room for ${duration} minutes :(`
        });
    },
    socket_userUnbanned(context, room) {
        Vue.prototype.$notify({
            group: 'notifications',
            type: 'success',
            title: "Yay! Unban",
            text: `You have been unbanned from the room ${room.name}`
        });
    },
    [USER_EDIT_USERNAME] ({commit, state}, username) {
        commit(SET_USERNAME, username)
        this._vm.$socket.emit('userEditUsername', state.currentUser.id, username);
    },
    [USER_EDIT_COLOR] ({commit, state}, color) {
        commit(SET_COLOR, color)
        this._vm.$socket.emit('userEditColor', state.currentUser.id, color);
    },
    [USER_ADD_MUTED_USER] ({commit}, user) {
        commit(ADD_MUTED_USER, user)
    },
    [USER_REMOVE_MUTED_USER] ({commit}, user) {
        commit(REMOVE_MUTED_USER, user)
    },
    [USER_RESET_MUTED_USER] ({commit}, user) {
        commit(RESET_MUTED_USERS, user)
    },
    [KICK_USER] (context, {host, user}) {
        this._vm.$socket.emit('userKick', {host, user});
    },
    [BAN_USER] (context, {host, user, duration}) {
        this._vm.$socket.emit('userBan', {host, user, duration});
    },
    [UNBAN_USER] (context, {host, user, duration}) {
        this._vm.$socket.emit('userUnban', {host, user, duration});
    }

}