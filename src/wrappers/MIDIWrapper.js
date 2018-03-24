import MIDIAccess from "../components/midi/MIDIAccess";

export default class MIDIWrapper {

    /**
     * @returns {MIDIAccess}
     */
    static async requestMidiAccess () {
        let midiAccess = await navigator.requestMIDIAccess()
        midiAccess.onstatechange = e => {
            console.log(e.port.name, e.port.manufacturer, e.port.state)
        }
        return new MIDIAccess(midiAccess)
    }



}
