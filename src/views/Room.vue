<template>
    <div class="room">
        <h1>{{ roomName || 'Multiplayer Piano' }}</h1>
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

</style>