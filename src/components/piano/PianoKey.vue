<template>
    <div class="piano-key" @click="(e) => {this.play()}">

    </div>

</template>

<script>
    import { mapGetters } from 'vuex'
    import Note from '../midi/Note'
    import audioEngine from '../audio/AudioEngine'
    import {MIDI_ATTACK} from "../midi/constants";

    const MAX_VELOCITY = 1
    const VELOCITY_STEPS = 127

    export default {
        name: 'piano-key',
        props: {
            note: {type: Note, required: true}
        },
        computed: {
            ...mapGetters([
                'midiAccess',
            ])
        },
        methods: {
            play (volume) {
                audioEngine.play(this.note, volume)
            }
        },
        created () {
            this.midiAccess.listenToMidiForNote(MIDI_ATTACK, this.note, (e) => {
                this.play(e.velocity * (MAX_VELOCITY / VELOCITY_STEPS))
            })
        }
    }
</script>

<style lang="scss">
    .piano-key {
        background: whitesmoke;
        height: 40px;
        width: 20px;
    }
</style>