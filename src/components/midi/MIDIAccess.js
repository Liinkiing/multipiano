/**
 * Callback used by midi events.
 *
 * @callback midiCallback
 * @param {MIDIMessage} message
 */

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
                if (this.listeners[message.note.keyname][message.signalType]) {
                    this.listeners[message.note.keyname][message.signalType](message)
                }
            }
        })
    }

    get inputsConnectionStatus() {
        let result = []
        this.inputs.forEach(input => {
            result.push({
                id: input.id,
                connection: input.connection,
                state: input.state,
            })
        })
        return result
    }

    get outputsConnectionStatus() {
        let result = []
        this.outputs.forEach(output => {
            result.push({
                id: output.id,
                connection: output.connection,
                state: output.state,
            })
        })
        return result
    }

    /**
     * @param eventName
     * @param {midiCallback} callback
     */
    addEventListener(eventName, callback) {
        if (!callback || typeof callback !== "function") {
            console.error('Please attach a valid callback to the listener!')
        }
        if (!this.listeners[eventName]) {
            this.listeners[eventName] = []
        }
        this.listeners[eventName].push(callback)

    }

    /**
     *
     * @param {string} eventName
     * @param {Note} note
     * @param {midiCallback} callback
     */
    listenToMidiForNote(eventName, note, callback) {
        if (!callback || typeof callback !== "function") {
            console.error('Please attach a valid callback to the listener!')
        }
        if(!this.listeners[note.keyname]) {
            this.listeners[note.keyname] = {
                [eventName]: callback
            }
        }
    }

    /**
     * @param eventName
     * @param {midiCallback} callback
     */
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