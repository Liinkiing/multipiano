<template>
    <div class="room">
        <h1>{{ roomName || 'Multiplayer Piano' }}</h1>
        <p>Coucou</p>
    </div>
</template>

<script>
    export default {
        name: 'room',
        props: {
            roomName: { type: String, required: false }
        }
    }
</script>

<style lang="scss">
    .room {
        width: inherit;
        display: flex;
        flex-direction: column;
        align-items: center;
        & h1 {
            text-align: center;
        }
    }
</style>