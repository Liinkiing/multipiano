import Utils from "../../utils/Utils";
import audioEngine from '../../components/audio/AudioEngine'

export default class Note {

    /**
     * @param {Object} note
     * @returns {Note}
     */
    constructor(note) {
        if (!note) return null
        this._keyname = note.keyname
        this._midiCode = note.midiCode
        this._isPlaying = false
        this._timestamp = null
        this._keyCodes = note.keyCodes || null
        this._isBlackKey = note.keyname.includes("S")
        this._octave = Utils.getNumberFromString(note.keyname)
    }

    static createFromKeyname(keyname) {
        return new Note({
            keyname,
            midiCode: 127,
        })
    }

    set timestamp (value) {
        this._timestamp = value
    }

    get timestamp () {
        return this._timestamp
    }

    play (volume) {
        audioEngine.play(this, volume)
    }

    set playing (value) {
        this._isPlaying = value
    }

    get playing () {
        return this._isPlaying
    }

    get octave() {
        return this._octave
    }

    get keyCodes () {
        return this._keyCodes
    }

    get midiCode() {
        return this._midiCode
    }

    get keyname() {
        return this._keyname
    }

    get isBlackKey() {
        return this._isBlackKey
    }
}