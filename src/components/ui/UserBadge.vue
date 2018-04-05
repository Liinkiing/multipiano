<template>
    <li class="user-badge" :style="style">
        <span v-if="!editing" @click="edit">
            <span v-if="isCurrentUser">You ({{user.username}}) </span>
            <span v-else>{{user.username}} <button @click="toggleMute">{{ isUserMuted ? 'Unmute' : 'Mute' }}</button></span>
            <span v-if="host"> (HOST)</span>
        </span>
        <input ref="input" v-show="isCurrentUser && editing" :disabled="!editing" type="text" v-model="newUsername"
               @blur="cancel" @keyup.enter.exact="validate" @keyup.esc.exact="cancel">
    </li>

</template>

<script>
    import {mapState, mapActions, mapGetters} from 'vuex'
    import {CLEAR_PIANO_PLAYING, USER_CAN_PLAY, USER_CANT_PLAY} from "../../store/modules/piano/actions";
    import {USER_ADD_MUTED_USER, USER_EDIT_USERNAME, USER_REMOVE_MUTED_USER} from "../../store/modules/users/actions";

    export default {
        name: 'user-badge',
        props: {
            user: {type: Object, required: true},
            isCurrentUser: {type: Boolean, required: false, default: false},
            host: {type: Boolean, required: true}
        },
        data() {
            return {
                newUsername: '',
                editing: false
            }
        },
        methods: {
            ...mapGetters('users', [
                'isMuted'
            ]),
            ...mapActions('piano', [
                USER_CAN_PLAY,
                USER_CANT_PLAY,
                CLEAR_PIANO_PLAYING
            ]),
            ...mapActions('users', [
                USER_EDIT_USERNAME,
                USER_ADD_MUTED_USER,
                USER_REMOVE_MUTED_USER
            ]),
            toggleMute () {
                if (this.isUserMuted) {
                    this[USER_REMOVE_MUTED_USER](this.user)
                } else {
                    this[USER_ADD_MUTED_USER](this.user)
                }
            },
            edit() {
                if (!this.isCurrentUser) return;
                this.newUsername = this.user.username
                this.editing = true
                this[CLEAR_PIANO_PLAYING]()
                this[USER_CANT_PLAY]()
                this.$nextTick(() => {
                    this.$refs.input.select()
                })
            },
            validate() {
                this.editing = false
                this[USER_EDIT_USERNAME](this.newUsername)
                this[USER_CAN_PLAY]()

            },
            cancel() {
                this.editing = false
                this.$refs.input.blur()
                this[USER_CAN_PLAY]()
            }
        },
        computed: {
            isUserMuted () {
                return this.isMuted()(this.user)
            },
            ...mapState('users', [
                'currentUser'
            ]),
            style() {
                return {
                    'background-color': this.user.color
                }
            }
        }
    }
</script>

<style lang="scss">
    .user-badge {
        list-style: none;
        padding: 10px 20px;
        border-radius: 5px;
        display: inline-block;
        margin: 10px 20px;
        &:first-of-type {
            margin-left: 0;
        }
        &:last-of-type {
            margin-right: 0;
        }
        input:not(.editing) {
            border: none;
            color: black;
            text-align: center;
        }
    }
</style>