<template>
    <span class="room-options">
        <button v-if="currentUserIsHost" @click="$modal.show('roomOptions')">Room options</button>
         <modal @opened="() => { USER_CANT_PLAY_WITH_KEYBOARD(); CLEAR_PIANO_PLAYING() }"
                @closed="USER_CAN_PLAY_WITH_KEYBOARD" height="auto" name="roomOptions">
            <h2>Room options</h2>
             <div class="field">
                 <label for="chat-enabled">Chat</label>
                <input id="chat-enabled" type="checkbox" v-model="chat">
             </div>
             <div class="field">
                <label for="public-room">Public</label>
                <input id="public-room" type="checkbox" v-model="publicRoom">
             </div>
             <h2>Ban options</h2>
             <label for="banDuration">Ban duration (in minutes)</label>
             <input type="number" min="1" max="120" id="banDuration" v-model="banDuration">
             <div v-if="bannedUsers.length > 0" class="banned-users">
                 <h2>Banned players</h2>
                 <ul class="users">
                    <user-badge v-if="user.id !== currentUser.id" v-for="user in bannedUsers" :key="user.id" :user="user" :host="isHost(user)" :display-action="true"/>
                </ul>
             </div>
             <h2>Players</h2>
              <ul v-if="currentRoom" class="users">
                <user-badge v-if="user.id !== currentUser.id" v-for="user in currentRoom.users" :key="user.id" :user="user" :host="isHost(user)" :display-action="true"/>
            </ul>
        </modal>
    </span>

</template>

<script>
    import {mapGetters, mapActions, mapState} from 'vuex'
    import {
        CLEAR_PIANO_PLAYING,
        USER_CAN_PLAY_WITH_KEYBOARD,
        USER_CANT_PLAY_WITH_KEYBOARD
    } from "../../store/modules/piano/actions";
    import {CHANGE_CHAT_STATUS} from "../../store/modules/chat/actions";
    import {CHANGE_PUBLIC_ROOM_STATUS} from "../../store/modules/rooms/actions";
    import UserBadge from "./UserBadge";
    import {EventBus} from "../../main";
    import {BAN_USER, UNBAN_USER} from "../../store/modules/users/actions";

    export default {
        components: {UserBadge},
        name: 'room-options',
        computed: {
            ...mapGetters('users', [
                'currentUserIsHost',
                'isHost',
                'isUserBannedForCurrentRoom'
            ]),
            ...mapGetters('rooms', [
                'currentRoom',
                'bannedUsers'
            ]),
            ...mapState('chat', [
                'enabled'
            ]),
            ...mapState('users', [
                'currentUser'
            ])
        },
        data() {
            return {
                chat: true,
                publicRoom: true,
                banDuration: 60
            }
        },
        mounted () {
            EventBus.$on('player.toggleBan', (user) => {
                this.onPlayerToggleBan(user)
            })
        },
        watch: {
            currentRoom() {
                this.chat = this.currentRoom ? this.currentRoom.chatEnabled : true
                this.publicRoom = this.currentRoom ? this.currentRoom.public : true
            },
            chat() {
                this[CHANGE_CHAT_STATUS](this.chat)
            },
            publicRoom() {
                this[CHANGE_PUBLIC_ROOM_STATUS](this.publicRoom)
            },
        },
        methods: {
            ...mapActions('chat', [
                CHANGE_CHAT_STATUS,
            ]),
            ...mapActions('users', [
                BAN_USER,
                UNBAN_USER
            ]),
            ...mapActions('rooms', [
                CHANGE_PUBLIC_ROOM_STATUS,
            ]),
            ...mapActions('piano', [
                USER_CAN_PLAY_WITH_KEYBOARD,
                USER_CANT_PLAY_WITH_KEYBOARD,
                CLEAR_PIANO_PLAYING
            ]),
            onPlayerToggleBan(user) {
                if (this.isUserBannedForCurrentRoom(user)) {
                    this[UNBAN_USER]({
                        user,
                        host: this.currentUser
                    })
                } else {
                    this[BAN_USER]({
                        host: this.currentUser,
                        user,
                        duration: this.banDuration
                    })
                }

            }
        }
    }
</script>

<style lang="scss">

</style>