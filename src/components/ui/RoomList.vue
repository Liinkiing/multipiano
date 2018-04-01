<template>
    <div class="room-list">
        <ul class="rooms">
            <li v-for="room in rooms" >
                <router-link v-if="room.id === HOME_ID" :to="{name: 'home'}">Home ({{ room.usersCount }})</router-link>
                <router-link v-else :to="{name: 'room.view', params: {roomName: room.name}}">{{ room.name }} ({{ room.usersCount }})</router-link>
            </li>
        </ul>
    </div>

</template>

<script>
    import { mapState } from 'vuex';
    import { HOME_ID } from '../../router'
    export default {
        name: 'room-list',
        computed: {
            ...mapState('rooms', [
                'rooms'
            ]),
            HOME_ID () {
                return HOME_ID
            }
        }
    }
</script>

<style lang="scss">
    @import "../../assets/scss/modules/variables";
    ul.rooms {
        padding: 0;
        margin: 0;
        list-style: none;
        & li {
            margin: 10px 20px;
        }
        & a {
            color: $blue
        }
    }
</style>