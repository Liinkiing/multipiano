<template>
    <div class="piano">
        <ul class="keys">
            <piano-key v-if="!loadingSounds" :key="note.keyname" v-for="note in pianoNotes" :note="note" :sustain="sustain"/>
        </ul>
    </div>

</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import PianoKey from './PianoKey'
    import audioEngine from '../audio/AudioEngine'
    import {USER_PLAY_NOTE, USER_RELEASE_NOTE} from '../../store/modules/piano/actions'
    import {MIDI_SUSTAIN} from "../midi/constants";

    export default {
        components: {PianoKey},
        name: 'piano',
        data () {
            return {
                loadingSounds: false,
                sustain: false
            }
        },
        methods: {
            ...mapActions([
                USER_PLAY_NOTE,
                USER_RELEASE_NOTE
            ]),
            onKeydown (e) {
                if(!e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
                    const note = this.getNoteByKeycode(e.keyCode)
                    if (note) {
                        this[USER_PLAY_NOTE]({
                            note,
                            volume: 0.5
                        })
                    }
                }
            },
            onKeyup (e) {
                const note = this.getNoteByKeycode(e.keyCode)
                if (note) {
                    this[USER_RELEASE_NOTE]({
                        note,
                        sustained: this.sustain
                    })
                }
            },
            onSustainMessage(e) {
                this.sustain = e.signalType === MIDI_SUSTAIN && e.velocity > 0 && e.originalMidiData[1] === 64
            }
        },
        computed: {
            ...mapGetters([
                'pianoType',
                'getNoteByKeycode',
                'midiAccess',
                'pianoNotes',
            ])
        },
        watch: {
            async pianoType(newPianoType) {
                this.loadingSounds = true
                await audioEngine.init(newPianoType)
                this.loadingSounds = false
            },
            sustain (newVal) {
                if(newVal === false) {
                    audioEngine.stopBufferedSounds()
                }
            }
        },
        async mounted() {
            await audioEngine.init(this.pianoType)
            window.addEventListener('keydown', this.onKeydown.bind(this))
            window.addEventListener('keyup', this.onKeyup.bind(this))
            this.midiAccess.addEventListener(MIDI_SUSTAIN, this.onSustainMessage.bind(this))
        },
        beforeDestroy () {
            window.removeEventListener('keydown', this.onKeydown.bind(this))
            window.removeEventListener('keyup', this.onKeyup.bind(this))
            this.midiAccess.removeEventListener(MIDI_SUSTAIN, this.onSustainMessage.bind(this))
        }
    }
</script>

<style lang="scss">
    .piano {
        display: flex;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -o-user-select: none;
        user-select: none;
        & .keys {
            padding: 0;
            margin: 0;
            list-style: none;
            display: flex;
        }
    }
</style>