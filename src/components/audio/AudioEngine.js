import pianoKeys from '../../components/midi/piano_keys'
import {SOURCE_KEYBOARD, SOURCE_MOUSE} from "../midi/constants";
import Utils from "../../utils/Utils";

const BASE_URL = process.env.VUE_APP_SERVER_URL
const DELAYED_STOP = 1
const ZERO = 0.000001

class AudioEngine {

    constructor() {
        this.volume = 0.6;
        this.context = new AudioContext()
        this.masterGain = this.context.createGain();
        this.masterGain.connect(this.context.destination);
        this.masterGain.gain.setValueAtTime(this.volume, 0);

        this.limiterNode = this.context.createDynamicsCompressor();
        this.limiterNode.threshold.setValueAtTime(-10, 0)
        this.limiterNode.knee.setValueAtTime(0, 0)
        this.limiterNode.ratio.setValueAtTime(20, 0)
        this.limiterNode.attack.setValueAtTime(0, 0)
        this.limiterNode.release.setValueAtTime(0.1, 0)
        this.limiterNode.connect(this.masterGain);

        this.pianoGain = this.context.createGain();
        this.pianoGain.gain.setValueAtTime(0.5, 0)
        this.pianoGain.connect(this.limiterNode);

        this.sounds = {}
        this.playings = {}
    }

    async init(soundType) {
        this.masterGain.gain.setValueAtTime(0., 0)
        this.sounds = await this.preloadSounds(soundType)
        this.masterGain.gain.setValueAtTime(this.volume, 0)
    }

    set onstatechange (value) {
        this.context.onstatechange = value
    }

    resume () {
        return this.context.resume()
    }

    get state () {
        return this.context.state
    }

    get BASE_URL() {
        return BASE_URL
    }

    get playingBuffers() {
        return this.playings
    }

    preloadSounds(type) {
        const basePath = `${BASE_URL}/${type}`
        const promises = []
        pianoKeys.forEach(key => {
            const path = encodeURI(`${basePath}/${key.keyname}.mp3`)
            const promise = fetch(path).then(async (response) => {
                this.sounds[key.keyname] = await this.context.decodeAudioData(await response.arrayBuffer())
            })
            promises.push(promise)
        })
        return Promise.all(promises).then(() => {
            return this.sounds
        })
    }

    /**
     * @param {Note} note
     * @param {Number} volume
     * @param {Number} stopDelay
     */
    play(note, volume = 0.5, stopDelay = 1.5) {
        const keyId = note.keyname + note.timestamp
        if (!this.sounds.hasOwnProperty(note.keyname)) return;
        const source = this.context.createBufferSource();
        source.onended = this.onEndedSound.bind(this, keyId)
        if (note.source === SOURCE_KEYBOARD || note.source === SOURCE_MOUSE) {
            const octave = note.octave + note.octaveOffset
            const keyname = Utils.replaceNumberFromString(note.keyname, octave)
            source.buffer = this.sounds[keyname];
        } else {
            source.buffer = this.sounds[note.keyname];
        }
        const gain = this.context.createGain();
        gain.gain.setValueAtTime(this.volume * volume, this.context.currentTime);
        source.connect(gain);
        gain.connect(this.pianoGain);
        source.start(0);
        if (this.playings[keyId]) {
            const playing = this.playings[keyId];
            this.playings[keyId].gain.gain.setValueAtTime(this.playings[keyId].gain.gain.value, this.context.currentTime);
            this.playings[keyId].gain.gain.exponentialRampToValueAtTime(ZERO, this.context.currentTime + DELAYED_STOP);
        }
        this.playings[keyId] = {
            source,
            gain
        };
    }

    stopBufferedSounds() {
        for(let key in this.playings) {
            this.playings[key].gain.gain.setValueAtTime(this.playings[key].gain.gain.value, this.context.currentTime);
            this.playings[key].gain.gain.exponentialRampToValueAtTime(ZERO, this.context.currentTime + DELAYED_STOP);
        }
    }


    stopBufferedSoundsExcept(notes) {
        for(let key in this.playings) {
            const playingKeynames = notes.map(note => note.keyname || note._keyname)
            if(playingKeynames.some(keyname => key.includes(keyname))) continue
            this.playings[key].gain.gain.setValueAtTime(this.playings[key].gain.gain.value, this.context.currentTime);
            this.playings[key].gain.gain.exponentialRampToValueAtTime(ZERO, this.context.currentTime + DELAYED_STOP);
            this.playings[key].source.stop(this.context.currentTime + 3)
            setTimeout(() => {
                delete this.playings[key]
            }, DELAYED_STOP + 0.01)
        }
    }

    stopBufferedSoundForNote(note) {
        const keyId = note.keyname + note.timestamp
        if(this.playings[keyId]) {
            this.playings[keyId].gain.gain.setValueAtTime(this.playings[keyId].gain.gain.value, this.context.currentTime);
            this.playings[keyId].gain.gain.exponentialRampToValueAtTime(ZERO, this.context.currentTime + DELAYED_STOP);
            this.playings[keyId].source.stop(this.context.currentTime + 3)
            setTimeout(() => {
                delete this.playings[keyId]
            }, DELAYED_STOP + 0.01)
        }
    }

    stop(note, stopDelay = 1.5, sustained = false) {
        const keyId = note.keyname + note.timestamp
        if (this.playings[keyId]) {
            if (!sustained) {
                this.playings[keyId].gain.gain.setValueAtTime(this.playings[keyId].gain.gain.value, this.context.currentTime);
                this.playings[keyId].gain.gain.exponentialRampToValueAtTime(ZERO, this.context.currentTime + DELAYED_STOP);
                this.playings[keyId].source.stop(this.context.currentTime + stopDelay)
                setTimeout(() => {
                    delete this.playings[keyId]
                }, stopDelay + 0.01)
            }
        }
    }

    onEndedSound(keyId) {
        delete this.playings[keyId]
    }

}

const instance = new AudioEngine()
export default instance
