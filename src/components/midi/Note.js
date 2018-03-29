import Utils from "../../utils/Utils";
import audioEngine from '../../components/audio/AudioEngine'
import {SOURCE_KEYBOARD} from "./constants";

export default class Note {

    /**
     * @param {Object} note
     * @returns {Note}
     */
    constructor(note) {
        if (!note) return null
        this._keyname = note.keyname || note._keyname
        this._midiCode = note.midiCode || note._midiCode
        this._user = note.user || note._user || null
        this._volume = note.volume || note._volume || 0.5
        this._isPlaying = note.playing || note._isPlaying || false
        this._source = note.source || note._source || SOURCE_KEYBOARD
        this._timestamp = note.timestamp || note._timestamp || null
        this._keyCodes = note.keyCodes || note._keyCodes || null
        this._isBlackKey = this._keyname.includes("S")
        this._octave = Utils.getNumberFromString(this._keyname)
    }

    static createFromKeyname(keyname) {
        return new Note({
            keyname,
            midiCode: 127,
        })
    }

    get color () {
        return this._user ? this._user.color : 'red'
    }

    set user (value) {
        this._user = value
    }

    get user () {
        return this._user
    }

    get volume () {
        return this._volume
    }

    set volume (value) {
        this._volume = value
    }

    set source (value) {
        this._source = value
    }

    get source () {
        return this._source
    }

    set timestamp (value) {
        this._timestamp = value
    }

    get timestamp () {
        return this._timestamp
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