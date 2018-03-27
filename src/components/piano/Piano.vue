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
    import {USER_PLAY_NOTE} from '../../store/modules/piano/actions'

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
                USER_PLAY_NOTE
            ])
        },
        computed: {
            ...mapGetters([
                'pianoType',
                'playingNotes',
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
            window.addEventListener('keydown', (e) => {
                if(!e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
                    let note = this.pianoNotes
                        .find(key => key.keyCodes && key.keyCodes.includes(e.keyCode));
                    if (note) {
                        console.log(note)
                        audioEngine.play(note)
                        this.USER_PLAY_NOTE(note)
                    }
                }
            })
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