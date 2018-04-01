<template>
    <div class="user-list">
        <ul v-if="currentRoom" class="users">
            <user-badge v-for="user in currentRoom.users" :user="user" :is-current-user="user.id === currentUser.id"/>
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
            ])
        }
    }
</script>

<style lang="scss">
    ul.users {
        padding: 0;
        margin: 0;
        list-style: none;
    }
</style>