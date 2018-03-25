/**
 * @property {Array<WebMidi.MIDIInput>} inputs
 * @property {Array<WebMidi.MIDIOutput>} outputs
 */
export default class MIDIAccess {

    /**
     * @param {WebMidi.MIDIAccess} midiAccess
     */
    constructor (midiAccess) {
        this.midiAccess = midiAccess
        this.inputs = []
        this.midiAccess.inputs.forEach(input => {
            this.inputs.push(input)
        })
        this.outputs = []
        this.outputs.forEach(output => {
            this.outputs.push(output)
        })
    }

}