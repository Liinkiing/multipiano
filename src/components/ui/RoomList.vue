<template>
    <div class="room-list">
        <ul class="rooms">
            <li :class="{active: isHomepage}"><router-link to="/">Home ({{ homeCount }})</router-link></li>
            <li v-for="room in rooms" :key="room.id" :class="{active: room.name === currentRoom}">
                <router-link  v-if="room.id !== HOME_ID" :to="{name: 'room.view', params: {roomName: room.name}}">{{ room.name }} ({{ room.usersCount }})</router-link>
            </li>
        </ul>
    </div>

</template>

<script>
    import { mapState, mapGetters } from 'vuex';
    import { HOME_ID } from '../../router'
    export default {
        name: 'room-list',
        computed: {
            ...mapState('rooms', [
                'rooms',
                'currentRoom'
            ]),
            ...mapGetters('rooms', [
                'homeCount',
                'isHomepage'
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
            display: inline-block;
            &.active {
                font-weight: bold;
            }
        }
        & a {
            color: $blue
        }
    }
</style>