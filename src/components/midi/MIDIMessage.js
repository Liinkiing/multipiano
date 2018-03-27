import {MIDI_ATTACK, MIDI_RELASE, SIGNAL_TYPE_MAP} from './constants'
import pianoKeys from './piano_keys'
import Note from "./Note";

export default class MIDIMessage {
    /**
     * @param {MIDIMessageEvent} event
     */
    constructor({ data }) {
        this._signalType = SIGNAL_TYPE_MAP[data[0]]
        this._note =  (this._signalType === MIDI_ATTACK || this._signalType === MIDI_RELASE) ?
            new Note(pianoKeys.find(key => key.midiCode === data[1])) :
            null
        this._velocity = data[2]
    }

    get signalType() {
        if (this._signalType === MIDI_ATTACK) {
            return this._velocity === 0 ? MIDI_RELASE : MIDI_ATTACK;
        } else {
            return this._signalType
        }
    }

    get note() {
        return this._note;
    }

    get velocity() {
        return this._velocity;
    }
}



