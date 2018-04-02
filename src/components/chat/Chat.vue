<template>
    <div class="chat">
        <div ref="chatContainer" class="chat-messages-container" :class="{opened}">
            <ul class="chat-messages">
                <chat-message v-for="message in messages" :key="message.id" :message="message" :new-message-input="$refs.messageInput"/>
            </ul>
        </div>
        <input ref="messageInput" type="text" @focus="focus" @blur="onBlur" v-model="newMessage" @keyup.enter="send" @keyup.esc="$refs.messageInput.blur" @keyup.up="editLastMessage">
    </div>

</template>

<script>
    import {mapActions, mapState, mapGetters} from 'vuex'
    import {EventBus} from "../../main";
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
            ]),
            ...mapGetters('chat', [
                'lastUserMessage'
            ])
        },
        methods: {
            ...mapActions('piano', [
                USER_CAN_PLAY_WITH_KEYBOARD,
                USER_CANT_PLAY_WITH_KEYBOARD,
                CLEAR_PIANO_PLAYING
            ]),
            editLastMessage () {
                if (this.lastUserMessage) {
                    EventBus.$emit('user-edit-last-message', this.lastUserMessage)
                }
            },
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
                if (this.newMessage.trim() === '') return
                this[USER_SEND_MESSAGE]({
                    user: this.currentUser,
                    message: this.newMessage.trim()
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
            padding: 0 20px;
            height: calc(100vh - 320px);
            display: flex;
            flex-direction: column;
            overflow-y: scroll;
            position: relative;
            margin-bottom: 20px;
            transition: all 0.3s;
            &::-webkit-scrollbar {
                width: 0.25rem;
            }

            &::-webkit-scrollbar-track {
                display: none;
            }

            &::-webkit-scrollbar-thumb {
                background-color: rgba(0, 0, 0, 0.22);
            }
            &.opened {
                background: rgba(0, 0, 0, 0.31);
                z-index: 300;
                backdrop-filter: blur(20px);
            }
            & .chat-messages {
                margin-top: auto;
                list-style: none;
                padding: 0;
            }
        }
    }
</style>