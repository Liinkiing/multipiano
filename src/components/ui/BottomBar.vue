<template>
    <div class="bottom-bar">
        <button v-popover:midi.top>MIDI In / Out</button>
        <transition name="fade-up">
            <popover name="midi">
                salut
            </popover>
        </transition>
    </div>
    
</template>

<script>
    import { mapGetters } from 'vuex'
    export default {
        name: 'bottom-bar',
        computed: {
            ...mapGetters([
                'midiInputs',
                'midiOutputs'
            ])
        }
    }
</script>

<style lang="scss">
    @import "../../assets/scss/modules/variables";
    .bottom-bar {
        margin-top: auto;
        padding: 40px;
        background: rgba(0, 0, 0, 0.28);
        box-shadow: $big-shadow;
    }
</style>