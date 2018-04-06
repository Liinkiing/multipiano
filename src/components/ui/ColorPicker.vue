<template>
    <span class="color-picker">
        <button @click="$modal.show('colorPicker')">Color</button>

        <modal @opened="() => { USER_CANT_PLAY_WITH_KEYBOARD(); CLEAR_PIANO_PLAYING() }"
               @closed="USER_CAN_PLAY_WITH_KEYBOARD" height="auto" name="colorPicker" class="picker-modal">
           <h2>Color picker</h2>
            <div class="picker-modal-content">
            <picker v-model="color"/>
            <div class="user-badge" :style="{backgroundColor: color.hex}">
                {{ currentUser.username }}
            </div>
            </div>
            <button class="btn-submit" @click="submit">OK</button>
        </modal>
    </span>

</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import {Chrome} from 'vue-color'
    import {
        CLEAR_PIANO_PLAYING,
        USER_CAN_PLAY_WITH_KEYBOARD,
        USER_CANT_PLAY_WITH_KEYBOARD
    } from "../../store/modules/piano/actions";
    import UserBadge from "./UserBadge";
    import {USER_EDIT_COLOR} from "../../store/modules/users/actions";

    export default {
        name: 'color-picker',
        components: {
            UserBadge,
            'picker': Chrome
        },
        data() {
            return {
                color: {
                    hex: '#000'
                }
            }
        },
        mounted () {
            this.color = {
                hex: this.currentUser.color
            }
        },
        computed: {
            ...mapState('users', [
                'currentUser'
            ])
        },
        methods: {
            ...mapActions('piano', [
                USER_CAN_PLAY_WITH_KEYBOARD,
                USER_CANT_PLAY_WITH_KEYBOARD,
                CLEAR_PIANO_PLAYING
            ]),
            ...mapActions('users', [
                USER_EDIT_COLOR
            ]),
            submit () {
                this[USER_EDIT_COLOR](this.color.hex)
                this.$modal.hide('colorPicker')
            }
        }
    }
</script>

<style lang="scss">
    .picker-modal {
        & .picker-modal-content {
            display: flex;
            justify-content: space-evenly;
            align-items: center;
        }
        & .btn-submit {
            margin-top: 20px;
            float: right;
        }
    }

</style>