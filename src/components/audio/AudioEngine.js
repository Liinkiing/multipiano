import pianoKeys from '../../components/midi/piano_keys'

const BASE_URL = "http://localhost:5000/assets/sounds/piano"

class AudioEngine {

    constructor() {
        this.volume = 0.6;
        this.context = new AudioContext()
        this.masterGain = this.context.createGain();
        this.masterGain.connect(this.context.destination);
        this.masterGain.gain.value = this.volume;

        this.limiterNode = this.context.createDynamicsCompressor();
        this.limiterNode.threshold.value = -10;
        this.limiterNode.knee.value = 0;
        this.limiterNode.ratio.value = 20;
        this.limiterNode.attack.value = 0;
        this.limiterNode.release.value = 0.1;
        this.limiterNode.connect(this.masterGain);

        this.pianoGain = this.context.createGain();
        this.pianoGain.gain.value = 0.5;
        this.pianoGain.connect(this.limiterNode);

        this.sounds = {}
        this.playings = {}
    }

    async init(soundType) {
        this.masterGain.gain.value = 0.0
        this.sounds = await this.preloadSounds(soundType)
        this.masterGain.gain.value = this.volume
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
        source.buffer = this.sounds[note.keyname];
        const gain = this.context.createGain();
        gain.gain.value = this.volume * volume;
        source.connect(gain);
        gain.connect(this.pianoGain);
        source.start(0);
        if (this.playings[keyId]) {
            const playing = this.playings[keyId];
            playing.gain.gain.exponentialRampToValueAtTime(0.000001, this.context.currentTime + stopDelay);
        }
        this.playings[keyId] = {
            source,
            gain
        };
    }

    stopBufferedSounds() {
        for(let key in this.playings) {
            this.playings[key].gain.gain.exponentialRampToValueAtTime(0.000001, this.context.currentTime + 3);
        }
    }

    stop(note, stopDelay = 1.5, sustained = false) {
        const keyId = note.keyname + note.timestamp
        if (this.playings[keyId]) {
            if (!sustained) {
                this.playings[keyId].gain.gain.exponentialRampToValueAtTime(0.000001, this.context.currentTime + stopDelay);
                this.playings[keyId].source.stop(this.context.currentTime + stopDelay)
            }
        }
    }

    onEndedSound(keyId) {
        delete this.playings[keyId]
    }

}

const instance = new AudioEngine()
export default instance