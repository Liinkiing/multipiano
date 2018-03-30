<template>
    <div class="piano-key" :class="{'is-black-key': this.note.isBlackKey, 'is-playing': this.note.playing}" :style="colorStyle">
    </div>

</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import AudioEngine from '../../components/audio/AudioEngine'
    import Note from '../midi/Note'
    import {MIDI_ATTACK, MIDI_RELASE, SOURCE_MIDI, SOURCE_MOUSE} from "../midi/constants";
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
            ...mapGetters('piano', [
                'midiAccess'
            ]),
            colorStyle () {
                if (!this.note.playing) return null
                return {
                    'background-color': this.note.color
                }
            }
        },
        watch: {
            sustain (newVal)  {
                if(newVal === false && !this.note.playing) {
                    AudioEngine.stopBufferedSoundForNote(this.note)
                }
            }
        },
        methods: {
            play(volume, source = SOURCE_MOUSE) {
                this[USER_PLAY_NOTE]({
                    note: this.note,
                    volume,
                    source
                })
            },
            release(delay = 3) {
                this[USER_RELEASE_NOTE]({
                    note: this.note,
                    delay,
                    sustained: this.sustain
                })
            },
            onMouseDown() {
                if (!this.note.playing) this.play(0.5)
            },
            onMouseOut() {
                if (this.note.source === SOURCE_MOUSE && this.note.playing) this.release()
            },
            onMouseUp() {
                if (this.note.source === SOURCE_MOUSE && this.note.playing) this.release()
            },
            ...mapActions('piano', [
                USER_PLAY_NOTE,
                USER_RELEASE_NOTE
            ])
        },
        created() {
            this.midiAccess.listenToMidiForNote(MIDI_ATTACK, this.note, (e) => {
                if (!this.note.playing) this.play(e.velocity * (MAX_VELOCITY / VELOCITY_STEPS), SOURCE_MIDI)
            })
            this.midiAccess.listenToMidiForNote(MIDI_RELASE, this.note, () => {
                if (this.note.source === SOURCE_MIDI) this.release(3)
            })
        },
        mounted() {
            this.$el.addEventListener('mousedown', this.onMouseDown.bind(this))
            this.$el.addEventListener('mouseup', this.onMouseUp.bind(this))
            this.$el.addEventListener('mouseout', this.onMouseOut.bind(this))
        },
        beforeDestroy() {
            this.$el.removeEventListener('mousedown', this.onMouseDown.bind(this))
            this.$el.removeEventListener('mouseup', this.onMouseUp.bind(this))
            this.$el.removeEventListener('mouseout', this.onMouseOut.bind(this))
        }
    }
</script>

<style lang="scss">
    @import "../../assets/scss/modules/variables";

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
            @each $colorName, $color in $color-list {
                &.#{$colorName} {
                    background: $color
                }
            }
        }
    }


</style>