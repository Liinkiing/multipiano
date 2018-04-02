<template>
    <div class="chat">
        <input type="text" @focus="() => { USER_CANT_PLAY_WITH_KEYBOARD(); CLEAR_PIANO_PLAYING() } " @blur="USER_CAN_PLAY_WITH_KEYBOARD" v-model="newMessage">
    </div>

</template>

<script>
    import {mapActions} from 'vuex'
    import {
        CLEAR_PIANO_PLAYING,
        USER_CAN_PLAY_WITH_KEYBOARD,
        USER_CANT_PLAY_WITH_KEYBOARD
    } from "../../store/modules/piano/actions";

    export default {
        name: 'chat',
        data() {
            return {
                newMessage: '',
                visible: true
            }
        },
        methods: {
            ...mapActions('piano', [
                USER_CAN_PLAY_WITH_KEYBOARD,
                USER_CANT_PLAY_WITH_KEYBOARD,
                CLEAR_PIANO_PLAYING
            ]),
        }
    }
</script>

<style lang="scss">
    .chat {

    }
</style>