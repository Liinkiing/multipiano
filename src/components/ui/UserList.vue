<template>
    <div class="user-list">
        <ul v-if="currentRoom" class="users">
            <user-badge v-for="user in currentRoom.users" :key="user.id" :user="user" :is-current-user="user.id === currentUser.id" :host="isHost(user)"/>
        </ul>
    </div>

</template>

<script>
    import {mapState, mapGetters} from 'vuex';
    import UserBadge from "./UserBadge";

    export default {
        components: {UserBadge},
        name: 'user-list',
        computed: {
            ...mapState('users', [
                'currentUser'
            ]),
            ...mapGetters('rooms', [
                'currentRoom'
            ]),
            ...mapGetters('users', [
                'isHost'
            ])
        }
    }
</script>

<style lang="scss">
    ul.users {
        padding: 0;
        margin: 0;
        list-style: none;
        position: relative;
        z-index: 200;
    }
</style>