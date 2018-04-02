<template>
    <li class="chat-message" :style="style">
        <input ref="editMessageInput" v-if="isEditing" type="text" v-model="newMessage" @blur="onBlur"
               @keyup.enter="send" @keyup.esc="$refs.editMessageInput.blur">
        <div v-else @dblclick="edit">{{ message.user.username }} : {{ message.body }}
            <small v-if="message.editedAt">(édité à {{ message.editedAt | date('hhhmm') }})</small>
            <small v-else-if="message.createdAt">({{ message.createdAt | date('hhhmm') }})</small>
        </div>
    </li>

</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {EventBus} from "../../main";
    import Message from '../../socket/models/Message'
    import {
        CLEAR_PIANO_PLAYING,
        USER_CAN_PLAY_WITH_KEYBOARD,
        USER_CANT_PLAY_WITH_KEYBOARD
    } from "../../store/modules/piano/actions";
    import {USER_EDIT_MESSAGE} from "../../store/modules/chat/actions";

    export default {
        name: 'chat-message',
        props: {
            message: {type: Message, required: true},
            newMessageInput: {required: false}
        },
        data() {
            return {
                isEditing: false,
                newMessage: '',
            }
        },
        methods: {
            ...mapActions('chat', [
                USER_EDIT_MESSAGE,
            ]),
            ...mapActions('piano', [
                USER_CANT_PLAY_WITH_KEYBOARD,
                USER_CAN_PLAY_WITH_KEYBOARD,
                CLEAR_PIANO_PLAYING
            ]),
            edit() {
                if (this.currentUser.id !== this.message.user.id) return
                this.isEditing = true
                this.newMessage = this.message.body
                this.$nextTick(() => {
                    if (this.$refs.editMessageInput) {
                        this.$refs.editMessageInput.focus()
                    }
                    this[USER_CANT_PLAY_WITH_KEYBOARD]()
                    this[CLEAR_PIANO_PLAYING]()
                })
            },
            onBlur() {
                this.isEditing = false
                if (this.newMessageInput) {
                    this.newMessageInput.focus()
                }
            },
            send() {
                if (this.newMessage.trim() === '') return
                this[USER_EDIT_MESSAGE]({
                    user: this.currentUser,
                    message: this.message,
                    newBody: this.newMessage.trim()
                })
                this.newMessage = ''
                if (this.newMessageInput) {
                    this.newMessageInput.focus()
                }
            }
        },
        mounted() {
            EventBus.$on('user-edit-last-message', (message) => {
                if (message === this.message) {
                    this.edit()
                }
            })
        },
        computed: {
            ...mapState('users', [
                'currentUser'
            ]),
            style() {
                return {
                    color: this.message.user.color,
                    textShadow: `0 0 10px ${this.message.user.color}, 0 2px 5px rgba(0,0,0,0.8)`
                }
            }
        }
    }
</script>

<style lang="scss">
    .chat-message {
        input {
            color: black;
        }
    }
</style>