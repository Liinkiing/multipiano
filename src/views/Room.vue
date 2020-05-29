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
        head: {
            meta: [
                { property: 'og:title', content: 'Multipiano' },
                { property: 'twitter:title', content: 'Multipiano' },
                { property: 'twitter:card', content: 'summary_large_image' },
                { property: 'twitter:image', content: 'https://multipiano.netlify.app/socials.png' },
                { property: 'twitter:description', content: 'Multipiano is a free website to play the piano with your friends in realtime!' },
                { property: 'og:url', content: 'https://multipiano.netlify.app' },
                { property: 'og:locale', content: 'en' },
                { property: 'og:type', content: 'website' },
                { property: 'og:image', content: 'https://multipiano.netlify.app/socials.png' },
                { property: 'og:image:width', content: '640' },
                { property: 'og:image:height', content: '359' },
                { property: 'og:description', content: 'Multipiano is a free website to play the piano with your friends in realtime!' },
                { name: 'description', content: 'Multipiano is a free website to play the piano with your friends in realtime!', id: 'desc' }
            ]
        },
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
