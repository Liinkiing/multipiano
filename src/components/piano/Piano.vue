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
    import {MIDI_ATTACK} from '../midi/constants'

    export default {
        components: {PianoKey},
        name: 'piano',
        created () {
            this.$store.state.piano.midiAccess.addEventListener(MIDI_ATTACK, this.onNotePlayed)
        },
        methods: {
            onNotePlayed (e) {
                console.log(e)
            }
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