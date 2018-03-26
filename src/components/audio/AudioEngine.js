import pianoKeys from '../../components/midi/piano_keys'
const BASE_URL = "http://localhost:5000/assets/sounds/piano"

class AudioEngine {

    constructor () {
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
        this.sounds = {}
    }

    async init (soundType) {
        this.sounds = await this.preloadSounds(soundType)
    }

    preloadSounds (type) {
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

}

const instance = new AudioEngine()
// Object.freeze(instance)
export default instance