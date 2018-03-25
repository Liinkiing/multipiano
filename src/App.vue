<template>
  <div id="app" class="wrapper" v-if="!loadingMidi">
    <router-view/>
    <bottom-bar/>
  </div>
  <div v-else id="app" class="wrapper">
    <p>Waiting for MIDI devices...</p>
  </div>
</template>

<script>
    import { mapActions } from 'vuex'
    import BottomBar from "./components/ui/BottomBar";
    import {MIDI_PITCH} from "./components/midi/constants";
    import {GET_MIDI_ACCESS, REFRESH_MIDI, REFRESH_MIDI_INPUTS_OUTPUTS} from "./store/modules/piano/actions";

  export default {
      components: {BottomBar},
      name: 'app',
      data () {
          return {
              loadingMidi: true
          }
      },
      methods: {
          ...mapActions([
              GET_MIDI_ACCESS,
              REFRESH_MIDI,
              REFRESH_MIDI_INPUTS_OUTPUTS
          ])
      },
      async created () {
          await this[GET_MIDI_ACCESS]()
          this.loadingMidi = false;
          this.$store.state.piano.midiAccess.addEventListener('onstatechange', e => {
              this[REFRESH_MIDI](e)
              this[REFRESH_MIDI_INPUTS_OUTPUTS]()
          })
          this.$store.state.piano.midiAccess.addEventListener(MIDI_PITCH, e => {
            console.log('pitch', e.signalType)
          })

      }
  }
</script>

<style lang="scss">

</style>
