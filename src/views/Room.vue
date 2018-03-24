<template>
    <div class="room">
        <h1>{{ roomName || 'Multiplayer Piano' }}</h1>
        <piano/>
    </div>
</template>

<script>
    import Piano from "../components/piano/Piano";

    export default {
        components: {Piano},
        name: 'room',
        props: {
            roomName: { type: String, required: false }
        }
    }
</script>

<style lang="scss">
    @import "../assets/scss/modules/variables";
    .room {
        width: inherit;
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