<template>
    <div class="room">
        <h1>{{ room.name }}</h1>
        <user-list/>
        <piano/>
    </div>
</template>

<script>
    import { mapActions } from 'vuex'
    import {CHANGE_ROOM} from "../store/modules/rooms/actions";
    import Piano from "../components/piano/Piano";
    import UserList from "../components/ui/UserList";
    export default {
        components: {
            UserList,
            Piano},
        name: 'room',
        props: {
            room: { type: Object, required: true }
        },
        methods: {
            ...mapActions('rooms', [
                CHANGE_ROOM
            ])
        },
        created () {
            this[CHANGE_ROOM](this.room)
        }
    }
</script>

<style lang="scss">
    @import "../assets/scss/modules/variables";
    .room {
        width: inherit;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        & h1 {
            text-align: center;
            text-transform: uppercase;
            font-size: 4rem;
            text-shadow: $shadow-3d;
        }
    }
</style>