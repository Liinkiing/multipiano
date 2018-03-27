<template>
    <div class="piano-key" :class="{'is-black-key': note.isBlackKey, 'is-playing': note.playing}" @click="(e) => {this.play()}">

    </div>

</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    import Note from '../midi/Note'
    import audioEngine from '../audio/AudioEngine'
    import {MIDI_ATTACK, MIDI_RELASE} from "../midi/constants";
    import {USER_PLAY_NOTE, USER_RELEASE_NOTE} from "../../store/modules/piano/actions";

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
                this.USER_PLAY_NOTE(this.note)
                audioEngine.play(this.note, volume)
            },
            ...mapActions([
                USER_PLAY_NOTE,
                USER_RELEASE_NOTE
            ])
        },
        created () {
            this.midiAccess.listenToMidiForNote(MIDI_ATTACK, this.note, (e) => {
                this.play(e.velocity * (MAX_VELOCITY / VELOCITY_STEPS))
            })
            this.midiAccess.listenToMidiForNote(MIDI_RELASE, this.note, () => {
                this.USER_RELEASE_NOTE(this.note)
            })
        }
    }
</script>

<style lang="scss">
    .piano-key {
        background: whitesmoke;
        height: 140px;
        width: 20px;
        border: 2px black solid;
        &.is-black-key {
            background: black;
            height: 100px;
        }
        &.is-playing {
            background: red;
        }
    }
</style>