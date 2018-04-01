<template>
    <div class="piano">
        <ul class="keys">
            <piano-key v-if="!loadingSounds" :key="note.keyname" v-for="note in pianoNotes" :note="note" :sustain="sustain"/>
        </ul>
    </div>

</template>

<script>
    import {mapGetters, mapActions, mapState, mapMutations} from 'vuex'
    import PianoKey from './PianoKey'
    import AudioEngine from '../audio/AudioEngine'
    import {USER_PLAY_NOTE, USER_RELEASE_NOTE} from '../../store/modules/piano/actions'
    import {MIDI_SUSTAIN, SOURCE_KEYBOARD} from "../midi/constants";
    import {ADD_KEY_DOWN, DELETE_KEY_DOWN} from "../../store/modules/piano/mutations";

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
            ...mapMutations('piano', [
               DELETE_KEY_DOWN,
               ADD_KEY_DOWN
            ]),
            ...mapActions('piano', [
                USER_PLAY_NOTE,
                USER_RELEASE_NOTE
            ]),
            onKeydown (e) {
                if(this.canPlay && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
                    if(!this.keysdown[e.keyCode]) {
                        const note = this.getNoteByKeycode(e.keyCode)
                        if (note && !note.currentUserPlaying) {
                            this[ADD_KEY_DOWN](e.keyCode)
                            this[USER_PLAY_NOTE]({
                                note,
                                volume: 0.5,
                                source: SOURCE_KEYBOARD
                            })
                        }
                    }
                }
            },
            onKeyup(e) {
                this[DELETE_KEY_DOWN](e.keyCode)
                const note = this.getNoteByKeycode(e.keyCode)
                if (this.canPlay && note && note.source === SOURCE_KEYBOARD) {
                    this[USER_RELEASE_NOTE]({
                        note,
                        sustained: this.sustain,
                        source: SOURCE_KEYBOARD
                    })
                }
            },
            onSustainMessage(e) {
                this.sustain = e.signalType === MIDI_SUSTAIN && e.velocity > 0 && e.originalMidiData[1] === 64
            }
        },
        computed: {
            ...mapState('piano', [
                'canPlay',
                'keysdown'
            ]),
            ...mapGetters('piano', [
                'pianoType',
                'getNoteByKeycode',
                'midiAccess',
                'pianoNotes',
            ])
        },
        watch: {
            async pianoType(newPianoType) {
                this.loadingSounds = true
                await AudioEngine.init(newPianoType)
                this.loadingSounds = false
            }
        },
        async mounted() {
            await AudioEngine.init(this.pianoType)
            this.midiAccess.addEventListener(MIDI_SUSTAIN, this.onSustainMessage.bind(this))
        },
        beforeMount () {
            this.onKeyup = this.onKeyup.bind(this)
            this.onKeydown = this.onKeydown.bind(this)
            window.addEventListener('keydown', this.onKeydown)
            window.addEventListener('keyup', this.onKeyup)
        },
        beforeDestroy () {
            window.removeEventListener('keydown', this.onKeydown)
            window.removeEventListener('keyup', this.onKeyup)
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