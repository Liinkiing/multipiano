<template>
    <div class="chat">
        <div ref="chatContainer" class="chat-messages-container" :class="{opened}">
            <ul class="chat-messages">
                <chat-message v-for="message in messages" :key="message.id" :message="message"/>
            </ul>
        </div>
        <input ref="messageInput" type="text" @focus="focus" @blur="onBlur" v-model="newMessage" @keyup.enter="send" @keyup.esc="$refs.messageInput.blur">
    </div>

</template>

<script>
    import {mapActions, mapState} from 'vuex'
    import {
        CLEAR_PIANO_PLAYING,
        USER_CAN_PLAY_WITH_KEYBOARD,
        USER_CANT_PLAY_WITH_KEYBOARD
    } from "../../store/modules/piano/actions";
    import {USER_SEND_MESSAGE} from "../../store/modules/chat/actions";
    import ChatMessage from "./ChatMessage";

    export default {
        components: {ChatMessage},
        name: 'chat',
        data() {
            return {
                newMessage: '',
                opened: false
            }
        },
        computed: {
            ...mapState('users', [
                'currentUser'
            ]),
            ...mapState('chat', [
                'messages'
            ])
        },
        methods: {
            ...mapActions('piano', [
                USER_CAN_PLAY_WITH_KEYBOARD,
                USER_CANT_PLAY_WITH_KEYBOARD,
                CLEAR_PIANO_PLAYING
            ]),
            ...mapActions('chat', [
                USER_SEND_MESSAGE
            ]),
            focus () {
                this[USER_CANT_PLAY_WITH_KEYBOARD]()
                this[CLEAR_PIANO_PLAYING]()
                this.opened = true
            },
            onBlur () {
                this[USER_CAN_PLAY_WITH_KEYBOARD]()
                this.opened = false
            },
            send () {
                this[USER_SEND_MESSAGE]({
                    user: this.currentUser,
                    message: this.newMessage
                })
                this.newMessage = ''
            }
        },
        watch: {
            messages () {
                this.$nextTick(() => {
                    this.$refs.chatContainer.scrollTop = this.$refs.chatContainer.scrollHeight
                })
            }
        }
    }
</script>

<style lang="scss">
    .chat {
        position: absolute;
        bottom: 140px;
        left: 40px;
        right: 40px;
        & input {
            width: 100%;
        }
        & .chat-messages-container {
            padding: 0;
            margin-bottom: 20px;
            height: 500px;
            display: flex;
            flex-direction: column;
            overflow-y: scroll;
            position: relative;
            &.opened {
                background: black;
                z-index: 100;
            }
            & .chat-messages {
                margin-top: auto;
                list-style: none;
                padding: 0;
            }
        }
    }
</style>