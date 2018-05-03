<template>
    <div id="app" class="wrapper" v-if="!loadingMidi">
        <notifications group="notifications" />
        <global-loader/>
        <router-view :key="$router.currentRoute.path"/>
        <bottom-bar/>
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
    import {
        CLEAR_PIANO_PLAYING,
        GET_MIDI_ACCESS,
        REFRESH_MIDI,
        REFRESH_MIDI_INPUTS_OUTPUTS, USER_CAN_PLAY_WITH_KEYBOARD,
        USER_CANT_PLAY_WITH_KEYBOARD
    } from "./store/modules/piano/actions";
    import GlobalLoader from "./components/ui/GlobalLoader";

    export default {
        components: {
            GlobalLoader,
            BottomBar},
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
            ])
        },
        async mounted() {
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
        }
    }
</script>

<style lang="scss">

</style>
