<template>
    <div class="room">
        <h1>{{ room.name }}</h1>
        <user-list/>
        <piano/>
        <chat v-if="currentRoom && currentRoom.chatEnabled"/>
    </div>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex'
    import {CHANGE_ROOM} from "../store/modules/rooms/actions";
    import Piano from "../components/piano/Piano";
    import UserList from "../components/ui/UserList";
    import Chat from "../components/chat/Chat";
    export default {
        components: {
            Chat,
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
        computed: {
            ...mapGetters('rooms', ['currentRoom'])
        },
        created () {
            this[CHANGE_ROOM](this.room.id)
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
