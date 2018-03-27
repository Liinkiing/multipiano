<template>
    <div class="piano">
        <ul class="keys">
            <piano-key v-if="!loadingSounds" :key="note.keyname" v-for="note in pianoNotes" :note="note"/>
        </ul>
    </div>

</template>

<script>
    import {mapGetters} from 'vuex'
    import PianoKey from './PianoKey'
    import audioEngine from '../audio/AudioEngine'

    export default {
        components: {PianoKey},
        name: 'piano',
        data () {
            return {
                loadingSounds: false,
            }
        },
        computed: {
            ...mapGetters([
                'pianoType',
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
                        audioEngine.play(note)
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