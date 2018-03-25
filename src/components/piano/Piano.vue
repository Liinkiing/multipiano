<template>
    <div class="piano">
        <ul class="keys">
            <piano-key/>
            <piano-key/>
            <piano-key/>
        </ul>
    </div>

</template>

<script>
    import PianoKey from './PianoKey'
    export default {
        components: {PianoKey},
        name: 'piano'
    }
</script>

<style lang="scss">
    .piano {
        display: flex;
        & .keys {
            padding: 0;
            margin: 0;
            list-style: none;
            display: flex;
        }
    }
</style>