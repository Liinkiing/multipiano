<template>
    <li class="user-badge" :style="style">
        <span v-if="!editing" @click="edit">{{ isCurrentUser ? 'You (' + user.username + ')' : user.username }}</span>
        <input ref="input" v-show="isCurrentUser && editing" :disabled="!editing" type="text" v-model="newUsername"
               @blur="cancel" @keyup.enter.exact="validate" @keyup.esc.exact="cancel">
    </li>

</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {USER_CAN_PLAY, USER_CANT_PLAY} from "../../store/modules/piano/actions";
    import {USER_EDIT_USERNAME} from "../../store/modules/users/actions";

    export default {
        name: 'user-badge',
        props: {
            user: {type: Object, required: true},
            isCurrentUser: {type: Boolean, required: false, default: false}
        },
        data() {
            return {
                newUsername: '',
                editing: false
            }
        },
        methods: {
            ...mapActions('piano', [
                USER_CAN_PLAY,
                USER_CANT_PLAY
            ]),
            ...mapActions('users', [
                USER_EDIT_USERNAME
            ]),
            edit() {
                if (!this.isCurrentUser) return;
                this.newUsername = this.user.username
                this.editing = true
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