export default class MIDIAccess {

    /**
     * @param {WebMidi.MIDIAccess} midiAccess
     */
    constructor (midiAccess) {
        this._inputs = []
        this._outputs = []
        this.midiAccess = midiAccess
    }

    /**
     * Get a list of connected inputs midi devices
     * @returns {Array<WebMidi.MIDIInput>}
     */
    get inputs () {
        this.midiAccess.inputs.forEach(input => {
            this._inputs.push(input)
        })

        return this._inputs
    }

    /**
     * Get a list of connected ouputs midi devices
     * @returns {Array<WebMidi.MIDIOutput>}
     */
    get outputs () {
        this.midiAccess.outputs.forEach(input => {
            this._outputs.push(input)
        })

        return this._outputs
    }

}