/**
 * @property {Array<WebMidi.MIDIInput>} inputs
 * @property {Array<WebMidi.MIDIOutput>} outputs
 */
import MIDIMessage from "./MIDIMessage";

export default class MIDIAccess {

    /**
     * @param {WebMidi.MIDIAccess} midiAccess
     */
    constructor(midiAccess) {
        this.midiAccess = midiAccess
        this.listeners = []
        this.inputs = []
        this.midiAccess.inputs.forEach(input => {
            this.inputs.push(input)
        })
        this.outputs = []
        this.midiAccess.outputs.forEach(output => {
            this.outputs.push(output)
        })
        this.init()
    }

    init() {
        this.midiAccess.onstatechange = e => {
            if (this.listeners['onstatechange']) {
                this.listeners['onstatechange'].forEach(callback => {
                    callback(e)
                })
            }
        }
        this.inputs.forEach(input => {
            input.onmidimessage = e => {
                let message = new MIDIMessage(e)
                if (this.listeners[message.signalType]) {
                    this.listeners[message.signalType].forEach(callback => {
                        callback(message)
                    })
                }
            }
        })
    }

    addEventListener(eventName, callback) {
        if (!callback || typeof callback !== "function") {
            console.error('Please attach a valid callback to the listener!')
        }
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = []
        }
        this.listeners[eventName].push(callback)

            }

    removeEventListener(eventName, callback) {
        if (!callback || typeof callback !== "function") {
            console.error('Please attach a valid callback to the listener!')
        }
        if (this.listeners[eventName]) {
            this.listeners[eventName] = this.listeners[eventName].filter(cb => cb !== callback)
        }
        this.inputs.forEach(input => {
            input.onmidimessage = null
        })
    }

}