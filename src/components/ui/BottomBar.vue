<template>
    <div class="bottom-bar">
        <button @click="$modal.show('midi')">MIDI In / Out</button>
        <modal height="auto" name="midi">
            <h2>Inputs</h2>
            <ul class="midi-inputs">
                <li class="midi-input" v-for="input in midiInputs" :key="input.id">
                    <toggle-button class="changed-font" :value="isMidiInputConnectionStatusOpen(input.id)"
                                   :key="input.id" :labels="{checked: input.name, unchecked: input.name}"
                                   :width="500" :height="40" @change="toggleMidiConnectionInput(input.id)"/>
                </li>
            </ul>
            <h2>Outputs</h2>
            <ul class="midi-outputs">
                <li class="midi-output" v-for="output in midiOutputs" :key="output.id">
                    <toggle-button class="changed-font" :value="isMidiOutputConnectionStatusOpen(output.id)"
                                   :key="output.id" :labels="{checked: output.name, unchecked: output.name}"
                                   :width="500" :height="40" @change="toggleMidiConnectionOutput(output.id)"/>
                </li>
            </ul>
        </modal>
    </div>
    
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    export default {
        name: 'bottom-bar',
        computed: {
            ...mapGetters([
                'midiInputs',
                'midiOutputs',
                'isMidiInputConnectionStatusOpen',
                'isMidiOutputConnectionStatusOpen',

            ])
        },
        methods: {
            ...mapActions([
                'closeMidiPort',
                'openMidiPort',
                'toggleMidiConnectionInput',
                'toggleMidiConnectionOutput',
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
        & ul.midi-inputs, ul.midi-outputs {
            padding: 0;
            margin: 0;
            list-style: none;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            height: 100%;
            & li {
                margin: 16px 0;
            }
        }
        & h2 {
            color: black;
            margin-bottom: 0;
            &:first-of-type {
                margin-top: 0;
            }
        }
    }
</style>