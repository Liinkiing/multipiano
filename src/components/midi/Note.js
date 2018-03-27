import pianoKeys from './piano_keys'
import Utils from "../../utils/Utils";
import audioEngine from '../../components/audio/AudioEngine'

export default class Note {

    /**
     * @param {Number} midiCode
     * @returns {Note}
     */
    constructor(midiCode) {
        let note = pianoKeys.find(note => note.midiCode == midiCode)
        this._keyname = note.keyname
        this._midiCode = note.midiCode
        this._keyCodes = note.keyCodes || null
        this._isBlackKey = note.keyname.includes("S")
        this._octave = Utils.getNumberFromString(note.keyname)
        this._midiCode = midiCode;
    }

    play (volume) {
        audioEngine.play(this)
    }

    get octave() {
        return this._octave;
    }

    get keyCodes () {
        return this._keyCodes
    }

    get midiCode() {
        return this._midiCode;
    }

    get keyname() {
        return this._keyname;
    }

    get isBlackKey() {
        return this._isBlackKey;
    }
}