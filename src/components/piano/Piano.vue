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
    import { mapGetters } from 'vuex'
    import PianoKey from './PianoKey'
    import {MIDI_ATTACK} from '../midi/constants'
    import audioEngine from '../audio/AudioEngine'

    export default {
        components: {PianoKey},
        name: 'piano',
        computed: {
            ...mapGetters([
                'pianoType'
            ])
        },
        async mounted () {
            this.$store.state.piano.midiAccess.addEventListener(MIDI_ATTACK, e => console.log(e))
            await audioEngine.init(this.pianoType)
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