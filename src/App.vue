<template>
  <div id="app" class="wrapper" v-if="!loadingMidi">
    <router-view :key="$router.currentRoute.name"/>
    <bottom-bar/>
  </div>
  <div v-else id="app" class="wrapper">
    <p>Waiting for MIDI devices...</p>
  </div>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex'
    import BottomBar from "./components/ui/BottomBar";
    import {GET_MIDI_ACCESS, REFRESH_MIDI, REFRESH_MIDI_INPUTS_OUTPUTS} from "./store/modules/piano/actions";

  export default {
      components: {BottomBar},
      name: 'app',
      data () {
          return {
              loadingMidi: true
          }
      },
      computed: {
          ...mapGetters('piano', [
              'midiAccess'
          ])
      },
      methods: {
          ...mapActions('piano', [
              GET_MIDI_ACCESS,
              REFRESH_MIDI,
              REFRESH_MIDI_INPUTS_OUTPUTS
          ])
      },
      async created () {
          if(navigator.requestMIDIAccess) {
              await this[GET_MIDI_ACCESS]()
              this.loadingMidi = false;
              this.midiAccess.addEventListener('onstatechange', e => {
                  this[REFRESH_MIDI](e)
                  this[REFRESH_MIDI_INPUTS_OUTPUTS]()
              })
          } else {
              this.loadingMidi = false;
          }

      }
  }
</script>

<style lang="scss">

</style>
