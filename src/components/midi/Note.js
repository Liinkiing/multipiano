import pianoKeys from './piano_keys'
import Utils from "../../utils/Utils";

export default class Note {

    /**
     * @param {Number} midiCode
     * @returns {Note}
     */
    constructor(midiCode) {
        let note = pianoKeys.filter(note => note.midiCode == midiCode)[0]
        this._keyname = note.keyname
        this._midiCode = note.midiCode
        this._isBlackKey = note.keyname.includes("#")
        this._octave = Utils.getNumberFromString(note.keyname)
        this._midiCode = midiCode;
    }

    get octave() {
        return this._octave;
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