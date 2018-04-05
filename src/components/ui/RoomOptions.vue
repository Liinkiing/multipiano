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

    export default {
        name: 'room-options',
        computed: {
            ...mapGetters('users', [
                'currentUserIsHost'
            ]),
            ...mapGetters('rooms', [
                'currentRoom'
            ]),
            ...mapState('chat', [
                'enabled'
            ])
        },
        data() {
            return {
                chat: true,
                publicRoom: true
            }
        },
        watch: {
            currentRoom() {
                this.chat = this.currentRoom.chatEnabled
                this.publicRoom = this.currentRoom.public
            },
            chat() {
                this[CHANGE_CHAT_STATUS](this.chat)
            },
            publicRoom () {
                this[CHANGE_PUBLIC_ROOM_STATUS](this.publicRoom)
            },
        },
        methods: {
            ...mapActions('chat', [
                CHANGE_CHAT_STATUS,
            ]),
            ...mapActions('rooms', [
                CHANGE_PUBLIC_ROOM_STATUS,
            ]),
            ...mapActions('piano', [
                USER_CAN_PLAY_WITH_KEYBOARD,
                USER_CANT_PLAY_WITH_KEYBOARD,
                CLEAR_PIANO_PLAYING
            ]),
        }
    }
</script>

<style lang="scss">

</style>