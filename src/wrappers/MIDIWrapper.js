import MIDIAccess from "../components/midi/MIDIAccess";

export default class MIDIWrapper {

    /**
     * @returns {MIDIAccess}
     */
    static async requestMidiAccess () {
        return new MIDIAccess(await navigator.requestMIDIAccess())
    }



}
