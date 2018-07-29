<template>
    <div class="piano">
        <transition name="fade">
            <ul class="keys" v-if="!loadingSounds">
                <piano-key :key="note.keyname" v-for="note in pianoNotes" :note="note" :sustain="sustain"/>
            </ul>
        </transition>
    </div>

</template>

<script>
    import {mapGetters, mapActions, mapState, mapMutations} from 'vuex'
    import PianoKey from './PianoKey'
    import AudioEngine from '../audio/AudioEngine'
    import {USER_PLAY_NOTE, USER_RELEASE_NOTE, USER_RELEASE_SUSTAIN} from '../../store/modules/piano/actions'
    import {MIDI_SUSTAIN, SOURCE_KEYBOARD} from "../midi/constants";
    import {ADD_KEY_DOWN, DELETE_KEY_DOWN} from "../../store/modules/piano/mutations";
    import {START_LOADING, STOP_LOADING} from "../../store/modules/app/actions";

    export default {
        components: {PianoKey},
        name: 'piano',
        data () {
            return {
                loadingSounds: true,
                sustain: false
            }
        },
        methods: {
            ...mapActions('app', [
                START_LOADING,
                STOP_LOADING
            ]),
            ...mapMutations('piano', [
               DELETE_KEY_DOWN,
               ADD_KEY_DOWN
            ]),
            ...mapActions('piano', [
                USER_PLAY_NOTE,
                USER_RELEASE_NOTE,
                USER_RELEASE_SUSTAIN
            ]),
            onKeydown (e) {
                if(this.canPlayKeyboard && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
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
                if (this.canPlayKeyboard) {
                    this[DELETE_KEY_DOWN](e.keyCode)
                }
                const note = this.getNoteByKeycode(e.keyCode)
                if (this.canPlayKeyboard && note) {
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
                'canPlayKeyboard',
                'keysdown'
            ]),
            ...mapGetters('piano', [
                'pianoType',
                'playingNotes',
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
            },
            loadingSounds (loading) {
                if (loading) {
                    this[START_LOADING]('Loading sounds...')
                } else {
                    this[STOP_LOADING]()
                }
            },
            sustain(newVal) {
                if (newVal === false) {
                    this[USER_RELEASE_SUSTAIN](this.playingNotes)
                }
            }
        },
        async mounted () {
            this.loadingSounds = true
            this[START_LOADING]('Loading sounds...')
            await AudioEngine.init(this.pianoType)
            this.loadingSounds = false
            if (this.midiAccess) {
                this.midiAccess.init();
                this.midiAccess.addEventListener(MIDI_SUSTAIN, this.onSustainMessage.bind(this))
                this.midiAccess.startListening()
            }
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
            if (this.midiAccess) {
                this.midiAccess.removeEventListener(MIDI_SUSTAIN, this.onSustainMessage.bind(this))
            }
        }
    }
</script>

<style lang="scss">
    @import "../../assets/scss/modules/variables";
    .piano {
        display: flex;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -o-user-select: none;
        user-select: none;
        position: relative;
        z-index: 50;
        margin: 40px 0;
        box-shadow: 0 0 40px rgba(0, 0, 0, 0.42);
        overflow: hidden;
        border-radius: 20px;
        border: 2px solid #c7c7c752;
        & .keys {
            padding: 0;
            margin: 0;
            list-style: none;
            display: flex;
            position: relative;
            & .is-black-key {
                position: absolute;
                z-index: 1;
                @each $blackKeyNumber, $position in $black-keys {
                    &:nth-of-type(#{$blackKeyNumber}) {
                        left: $position
                    }
                }
            }
        }
    }
</style>