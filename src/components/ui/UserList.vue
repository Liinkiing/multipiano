<template>
    <div class="user-list">
        <ul class="users">
            <user-badge v-for="user in users" :user="user"/>
        </ul>
    </div>

</template>

<script>
    import {mapState} from 'vuex';
    import UserBadge from "./UserBadge";

    export default {
        components: {UserBadge},
        name: 'user-list',
        computed: {
            ...mapState('users', [
                'currentUser',
                'users'
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