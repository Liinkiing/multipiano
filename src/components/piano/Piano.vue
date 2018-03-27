<template>
    <div class="piano">
        <ul class="keys">
            <piano-key v-if="!loadingSounds" :key="note.keyname" v-for="note in pianoNotes" :note="note"/>
        </ul>
    </div>

</template>

<script>
    import {mapGetters, mapActions} from 'vuex'
    import PianoKey from './PianoKey'
    import audioEngine from '../audio/AudioEngine'
    import {USER_PLAY_NOTE, USER_RELEASE_NOTE} from '../../store/modules/piano/actions'

    export default {
        components: {PianoKey},
        name: 'piano',
        data () {
            return {
                loadingSounds: false,
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
                        this.USER_PLAY_NOTE({
                            note,
                            volume: 0.5
                        })
                    }
                }
            },
            onKeyup (e) {
                const note = this.getNoteByKeycode(e.keyCode)
                if (note) {
                    this.USER_RELEASE_NOTE(note)
                }
            }
        },
        computed: {
            ...mapGetters([
                'pianoType',
                'getNoteByKeycode',
                'pianoNotes',
            ])
        },
        watch: {
            async pianoType(newPianoType) {
                this.loadingSounds = true
                await audioEngine.init(newPianoType)
                this.loadingSounds = false
            }
        },
        async mounted() {
            await audioEngine.init(this.pianoType)
            window.addEventListener('keydown', this.onKeydown.bind(this))
            window.addEventListener('keyup', this.onKeyup.bind(this))
        },
        beforeDestroy () {
            window.removeEventListener('keydown', this.onKeydown.bind(this))
            window.removeEventListener('keyup', this.onKeyup.bind(this))
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