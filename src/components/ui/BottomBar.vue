<template>
    <div class="bottom-bar">
        <button @click="$modal.show('midi')">MIDI In / Out</button>
        <modal name="midi">
            <ul class="midi-inputs">
                <li class="midi-input" v-for="input in midiInputs" :key="input.id">
                    <toggle-button class="changed-font" :value="midiPortState(input.id) === 'connected'" :key="input.id" :labels="{checked: input.name, unchecked: input.name}" :width="500" :height="40"/>
                </li>
            </ul>
        </modal>
    </div>
    
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    export default {
        name: 'bottom-bar',
        data () {
            return {
                toggleValues: []
            }
        },
        computed: {
            ...mapGetters([
                'midiInputs',
                'midiOutputs',
                'midiPortState',
            ])
        },
        methods: {
            ...mapActions([
                'closeMidiPort',
                'openMidiPort',
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
        & ul.midi-inputs {
            padding: 0;
            margin: 0;
            list-style: none;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            height: 100%;
            & li {}
        }
    }
</style>