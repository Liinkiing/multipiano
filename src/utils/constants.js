const octaves = 7
let activeOctave = 2
const gamme = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

let final = []
let midiCode = 24
for(let i = 2; i < octaves + 2; i++) {

    let octave = []
    gamme.forEach(note => {
        let result = {}
        result.keyname = note + activeOctave
        result.midiCode = midiCode
        midiCode++
        octave.push(result)
    })
    final.push(octave)

    activeOctave++

}

console.log(final)