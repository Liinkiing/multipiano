import {MIDI_ATTACK, MIDI_RELASE, MIDI_SUSTAIN, SIGNAL_TYPE_MAP} from './constants'
import pianoKeys from './piano_keys'
import Note from "./Note";

export default class MIDIMessage {
    /**
     * @param {MIDIMessageEvent} event
     */
    constructor({ data }) {
        this._velocity = data[2]
        if (data[0] === 187) {
            this._signalType = MIDI_SUSTAIN
        } else {
            this._signalType = this._velocity === 0 ? MIDI_RELASE : MIDI_ATTACK
            // RELEASE signal is now the same as ATTACK, only velocity changes
        }
        this._originalMidiData = data
        const note = pianoKeys.find(key => key.midiCode === data[1]);
        this._note =  ((this._signalType === MIDI_ATTACK && note) || (this._signalType === MIDI_RELASE && note)) ?
            new Note(note) :
            null
    }

    get signalType() {
        if (this._signalType === MIDI_ATTACK) {
            return this._velocity === 0 ? MIDI_RELASE : MIDI_ATTACK;
        } else {
            return this._signalType
        }
    }

    get originalMidiData () {
        return this._originalMidiData;
    }

    get note () {
        return this._note;
    }

    get velocity () {
        return this._velocity;
    }
}



