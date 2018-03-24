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
    import MIDIWrapper from '../../wrappers/MIDIWrapper'

    export default {
        components: {PianoKey},
        name: 'piano',
        beforeMount: async function () {
            this.midiWrapper = await MIDIWrapper.requestMidiAccess()
        }
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