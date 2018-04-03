<template>
    <span class="room-options">
        <button v-if="currentUserIsHost" @click="$modal.show('roomOptions')">Room options</button>
         <modal @opened="() => { USER_CANT_PLAY_WITH_KEYBOARD(); CLEAR_PIANO_PLAYING() }" @closed="USER_CAN_PLAY_WITH_KEYBOARD" height="auto" name="roomOptions">
            <h2>Room options</h2>
             <label for="chat-enabled">Chat</label>
             <input id="chat-enabled" type="checkbox" v-model="chat">
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
        data () {
            return {
                chat: true
            }
        },
        watch: {
            currentRoom () {
                this.chat = this.currentRoom.chatEnabled
            },
            chat () {
                this[CHANGE_CHAT_STATUS](this.chat)
            },
        },
        methods: {
            ...mapActions('chat', [
                CHANGE_CHAT_STATUS
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