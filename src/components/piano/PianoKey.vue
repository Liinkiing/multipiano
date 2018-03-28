<template>
    <div class="piano-key" :class="{'is-black-key': note.isBlackKey, 'is-playing': note.playing}">
    </div>

</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    import Note from '../midi/Note'
    import {MIDI_ATTACK, MIDI_RELASE} from "../midi/constants";
    import {USER_PLAY_NOTE, USER_RELEASE_NOTE} from "../../store/modules/piano/actions";

    const MAX_VELOCITY = 1
    const VELOCITY_STEPS = 127

    export default {
        name: 'piano-key',
        props: {
            note: {type: Note, required: true},
            sustain: {type: Boolean, required: false}
        },
        computed: {
            ...mapGetters([
                'midiAccess',
            ])
        },
        methods: {
            play (volume) {
                this[USER_PLAY_NOTE]({
                    note: this.note,
                    volume,
                })
            },
            release (delay = null) {
                this[USER_RELEASE_NOTE]({
                    note: this.note,
                    delay,
                    sustained: this.sustain
                })
            },
            onMouseDown () {
                this.play(0.5)
            },
            onMouseUp () {
                this.release()
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
                this.release(3)
            })
        },
        mounted () {
            this.$el.addEventListener('mousedown', this.onMouseDown.bind(this))
            this.$el.addEventListener('mouseup', this.onMouseUp.bind(this))
            this.$el.addEventListener('mouseout', this.onMouseUp.bind(this))
        },
        beforeDestroy () {
            this.$el.removeEventListener('mousedown', this.onMouseDown.bind(this))
            this.$el.removeEventListener('mouseup', this.onMouseUp.bind(this))
            this.$el.removeEventListener('mouseout', this.onMouseUp.bind(this))
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