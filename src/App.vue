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
              'getMidiAccess'
          ])
      },
      async created () {
          await this.getMidiAccess()
          this.loadingMidi = false;
      }
  }
</script>

<style lang="scss">

</style>
