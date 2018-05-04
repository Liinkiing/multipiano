<template>
    <div id="app" class="wrapper" v-if="!loadingMidi">
        <notifications group="notifications"/>
        <global-loader/>
        <transition name="fade-scale" mode="out-in">
            <router-view :key="$router.currentRoute.path"/>
        </transition>
        <bottom-bar/>
        <modal @opened="() => { USER_CANT_PLAY_WITH_KEYBOARD(); CLEAR_PIANO_PLAYING(); }" @closed="USER_CAN_PLAY_WITH_KEYBOARD" height="auto" name="chromeDumbPolicy" class="modal">
            <h2>Hey!</h2>
            <p>Sorry to annoy you, but unfortunately, you are using a release of Chrome which force user to make an interaction before I can make sounds!
                And it looks like the first thing you tried to play is with your MIDI controller, but Chrome is too dumb to detect this as a 'user interaction'. So
                you have to click to the button or pressing any key on your keyboard / clicking your mouse for making Chrome happy and that you consent to play. Yeah, really dumb I know, sorry!</p>
            <button @click="() => { $modal.hide('chromeDumbPolicy'); handleUserInteraction() }">Click me</button>
        </modal>
        <modal @opened="() => { USER_CANT_PLAY_WITH_KEYBOARD(); CLEAR_PIANO_PLAYING(); }"
               @closed="USER_CAN_PLAY_WITH_KEYBOARD" height="auto" name="noMidi">
            <h2>Warning</h2>
            <p>Your browser does not seems to support the MIDI API. You could not play with a MIDI controller.</p>
        </modal>
    </div>
    <div v-else id="app" class="wrapper">

    </div>
</template>

<script>
    import {mapActions, mapGetters, mapState} from 'vuex'
    import BottomBar from "./components/ui/BottomBar";
    import AudioEngine from './components/audio/AudioEngine'
    import {
        CLEAR_PIANO_PLAYING,
        GET_MIDI_ACCESS,
        REFRESH_MIDI,
        REFRESH_MIDI_INPUTS_OUTPUTS, USER_CAN_PLAY_WITH_KEYBOARD,
        USER_CANT_PLAY_WITH_KEYBOARD
    } from "./store/modules/piano/actions";
    import GlobalLoader from "./components/ui/GlobalLoader";
    import { EventBus } from './main';

    export default {
        components: {
            GlobalLoader,
            BottomBar
        },
        name: 'app',
        data() {
            return {
                loadingMidi: true
            }
        },
        computed: {
            ...mapGetters('piano', [
                'midiAccess'
            ]),
            ...mapState('rooms', [
                'currentRoom'
            ])
        },
        methods: {
            ...mapActions('piano', [
                GET_MIDI_ACCESS,
                USER_CAN_PLAY_WITH_KEYBOARD,
                USER_CANT_PLAY_WITH_KEYBOARD,
                CLEAR_PIANO_PLAYING,
                REFRESH_MIDI,
                REFRESH_MIDI_INPUTS_OUTPUTS
            ]),
            handleUserInteraction() { // Used because of new Chrome policy : https://goo.gl/7K7WLu
                if (AudioEngine.state === 'suspended') {
                    AudioEngine.resume();
                }
            }
        },
        async mounted() {
            this.handleUserInteraction = this.handleUserInteraction.bind(this)
            try {
                await this[GET_MIDI_ACCESS]()
                this.loadingMidi = false;
                this.midiAccess.addEventListener('onstatechange', e => {
                    this[REFRESH_MIDI](e)
                    this[REFRESH_MIDI_INPUTS_OUTPUTS]()
                })
            } catch {
                this.loadingMidi = false;
                this.$modal.show('noMidi')
            }
            EventBus.$on('midi.firstUserInteraction', () => {
                this.$modal.show('chromeDumbPolicy');
            })
            AudioEngine.onstatechange = (e) => {
                if (e.target.state === 'running') {
                    window.removeEventListener('click', this.handleUserInteraction)
                    window.removeEventListener('keydown', this.handleUserInteraction)
                }
            }
            window.addEventListener('click', this.handleUserInteraction)
            window.addEventListener('keydown', this.handleUserInteraction)
        }
    }
</script>

<style lang="scss">

</style>
