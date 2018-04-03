<template>
    <div class="bottom-bar">
        <button v-if="midiInputs || midiOutputs" @click="$modal.show('midi')">MIDI In / Out</button>
        <button @click="CHANGE_PIANO_TYPE('stage_grand')">Stage Grand</button>
        <button @click="CHANGE_PIANO_TYPE('close_grand')">Close Grand</button>
        <button @click="$modal.show('newRoom')">Create a room</button>
        <button v-if="currentUserIsHost" @click="$modal.show('roomOptions')">Room options</button>
        <room-list/>
        <modal @opened="() => { USER_CANT_PLAY_WITH_KEYBOARD(); CLEAR_PIANO_PLAYING() }" @closed="USER_CAN_PLAY_WITH_KEYBOARD" height="auto" name="midi">
            <h2>Inputs</h2>
            <ul class="midi-inputs">
                <li class="midi-input" v-for="input in midiInputs" :key="input.id">
                    <toggle-button v-if="midiInputs" class="changed-font" :value="isMidiInputConnectionStatusOpen(input.id)" :sync="true"
                                   :key="input.id" :labels="{checked: input.name, unchecked: input.name}"
                                   :width="500" :height="40" @change="TOGGLE_MIDI_CONNECTION_INPUT(input.id)"/>
                </li>
            </ul>
            <h2>Outputs</h2>
            <ul class="midi-outputs">
                <li class="midi-output" v-for="output in midiOutputs" :key="output.id">
                    <toggle-button v-if="midiOutputs" class="changed-font" :value="isMidiOutputConnectionStatusOpen(output.id)" :sync="true"
                                   :key="output.id" :labels="{checked: output.name, unchecked: output.name}"
                                   :width="500" :height="40" @change="TOGGLE_MIDI_CONNECTION_OUTPUT(output.id)"/>
                </li>
            </ul>
        </modal>
        <modal @opened="() => { USER_CANT_PLAY_WITH_KEYBOARD(); CLEAR_PIANO_PLAYING(); $refs.newRoomInput.focus() }" @closed="USER_CAN_PLAY_WITH_KEYBOARD" height="auto" name="newRoom">
            <h2>Create a room</h2>
            <input ref="newRoomInput" type="text" v-model="newRoom" @keyup.enter="validateRoomCreation">
            <button @click="validateRoomCreation">OK</button>
        </modal>
    </div>
    
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    import {
        CLOSE_MIDI_PORT,
        OPEN_MIDI_PORT,
        CHANGE_PIANO_TYPE,
        TOGGLE_MIDI_CONNECTION_INPUT,
        TOGGLE_MIDI_CONNECTION_OUTPUT,
        USER_CANT_PLAY_WITH_KEYBOARD,
        CLEAR_PIANO_PLAYING,
        USER_CAN_PLAY_WITH_KEYBOARD
    } from "../../store/modules/piano/actions";
    import RoomList from "./RoomList";
    const ROOM_BLACKLIST = ['home', 'accueil', 'multiplayer piano', 'multiplayer-piano']
    export default {
        components: {RoomList},
        name: 'bottom-bar',
        data () {
            return {
                newRoom: ''
            }
        },
        computed: {
            ...mapGetters('piano', [
                'midiInputs',
                'midiOutputs',
                'isMidiInputConnectionStatusOpen',
                'isMidiOutputConnectionStatusOpen',

            ]),
            ...mapGetters('users', [
                'currentUserIsHost'
            ])
        },
        methods: {
            validateRoomCreation () {
                if (ROOM_BLACKLIST.includes(this.newRoom.trim().toLowerCase())) return
                this.$router.push({
                    name: 'room.view',
                    params: {
                        roomName: this.newRoom
                    }
                })
                this.newRoom = ''
                this.$modal.hide('newRoom')
            },
            ...mapActions('piano', [
                CLOSE_MIDI_PORT,
                OPEN_MIDI_PORT,
                CLEAR_PIANO_PLAYING,
                USER_CANT_PLAY_WITH_KEYBOARD,
                USER_CAN_PLAY_WITH_KEYBOARD,
                TOGGLE_MIDI_CONNECTION_INPUT,
                TOGGLE_MIDI_CONNECTION_OUTPUT,
                CHANGE_PIANO_TYPE,
            ])
        }
    }
</script>

<style lang="scss">
    @import "../../assets/scss/modules/variables";
    .bottom-bar {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 40px;
        background: rgba(0, 0, 0, 0.28);
        box-shadow: $big-shadow;
        height: 120px;
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