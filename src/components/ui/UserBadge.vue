<template>
    <li v-if="!onlyDisplay" class="user-badge" :style="style">
        <span v-if="!editing">
            <span v-if="isCurrentUser" @click="edit">You ({{user.username}}) </span><color-picker v-if="isCurrentUser"/>
            <span v-else>
                {{user.username}} <button @click="toggleMute">{{ isUserMuted ? 'Unmute' : 'Mute' }}</button>
                <span class="actions" v-if="displayAction">
                <button v-if="isCurrentUserHost && !isUserBannedFromCurrentRoom" @click="kick(user)">Kick</button>
                <button v-if="isCurrentUserHost" @click="toggleBan(user)">{{ isUserBannedFromCurrentRoom ? 'Unban' : 'Ban' }}</button>
                </span>
            </span>
            <span v-if="host"> (HOST)</span>
        </span>
        <input ref="input" v-show="isCurrentUser && editing" :disabled="!editing" type="text" v-model="newUsername"
               @blur="cancel" @keyup.enter.exact="validate" @keyup.esc.exact="cancel">
    </li>
    <li v-else class="user-badge" :style="style">
        {{ user.username }}
    </li>

</template>

<script>
    import {mapState, mapActions, mapGetters} from 'vuex'
    import {CLEAR_PIANO_PLAYING, USER_CAN_PLAY, USER_CANT_PLAY} from "../../store/modules/piano/actions";
    import {
        KICK_USER,
        USER_ADD_MUTED_USER,
        USER_EDIT_USERNAME,
        USER_REMOVE_MUTED_USER
    } from "../../store/modules/users/actions";
    import ColorPicker from "./ColorPicker";
    import {EventBus} from "../../main";

    export default {
        components: {ColorPicker},
        name: 'user-badge',
        props: {
            user: {type: Object, required: true},
            isCurrentUser: {type: Boolean, required: false, default: false},
            host: {type: Boolean, required: true},
            onlyDisplay: {type: Boolean, default: false},
            displayAction: {type: Boolean, default: false}
        },
        data() {
            return {
                newUsername: '',
                editing: false
            }
        },
        methods: {
            ...mapGetters('users', [
                'isMuted',
                'isHost',
            ]),
            ...mapActions('piano', [
                USER_CAN_PLAY,
                USER_CANT_PLAY,
                CLEAR_PIANO_PLAYING
            ]),
            ...mapActions('users', [
                USER_EDIT_USERNAME,
                KICK_USER,
                USER_ADD_MUTED_USER,
                USER_REMOVE_MUTED_USER
            ]),
            toggleMute() {
                if (this.isUserMuted) {
                    this[USER_REMOVE_MUTED_USER](this.user)
                } else {
                    this[USER_ADD_MUTED_USER](this.user)
                }
            },
            kick(user) {
                this[KICK_USER]({
                    host: this.currentUser,
                    user
                })
            },
            toggleBan(user) {
                EventBus.$emit('player.toggleBan', user)
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
            ...mapGetters('rooms', [
                'bannedUsers'
            ]),
            isUserBannedFromCurrentRoom () {
                return this.bannedUsers.find(user => user.ip === this.user.ip)
            },
            isUserMuted() {
                return this.isMuted()(this.user)
            },
            isCurrentUserHost() {
                return this.isHost()(this.currentUser)
            },
            ...mapState('users', [
                'currentUser'
            ]),
            style() {
                return {
                    'background-color': this.user.color,
                    'box-shadow': `0 0 30px ${this.user.color}`,
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
        transition: all 0.3s;
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