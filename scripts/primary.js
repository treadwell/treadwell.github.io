// destructure say args
// add tts preload to avoid change in voice
// add scaling visuals
// add Sury A in tts
// make responsive - done

let $asanaIdx = null
let $lineIdx = null
let $timer = null

function say({
        voice = 10,
        voiceURI = "native", 
        volume = 0.5,
        rate = 1.0,
        pitch = 0.8,
        m = "Hello world.",
        lang = "en-US"
    }) {
        var voices = window.speechSynthesis.getVoices();
        speechSynthesis.speak(Object.assign(new SpeechSynthesisUtterance(), {
            voice: voices[voice],  // en has 1, 10, 17
            voiceURI: voiceURI,
            volume: document.getElementById("volSlide").value,
            rate: rate,
            pitch: pitch,
            text: m,
            lang: lang
    }))
}

function readAloud() {

    const cycle = document.getElementById("secPerBreath").value / 2.0 * 1000

    let asansas = calc_asana_list()

    read_asanas(asanas.slice($asanaIdx), cycle)
}

function read_asanas([asana, ...asanas], cycle) {

    if (!asana) return

    console.log($asanaIdx, asana)
    
    let lines = document.getElementById(asana).innerText.split(/[\r\n]+/)
    // alert(JSON.stringify(lines, null, 2))
    
    document.getElementById("currentAsana").innerHTML = lines[0]

    read_lines(lines.slice($lineIdx), asanas, cycle)
    
    
}

function read_lines([line, ...lines], asanas, cycle) {
    cycle = document.getElementById("secPerBreath").value / 2.0 * 1000
    if (!line) {
        $asanaIdx++
        $lineIdx = 0
        read_asanas(asanas, cycle)
    } else {
        say({ m: line })
        $lineIdx++
        console.log($lineIdx, line)
        $timer = setTimeout(() => {
            read_lines (lines, asanas, cycle)
        }, cycle)
    }
}

function calc_duration() {

    halfBreathDuration = document.getElementById("secPerBreath").value / 2.0

    const asanas = calc_asana_list()
    console.log("Number asanas:", asanas.length)
    console.log(asanas)

    spokenLines = asanas.map((asana) => { return document.getElementById(asana).innerText.split(/[\r\n]+/).length - 1 })
                    .reduce((a, b) => a + b)
        
    spokenDurationMinutes = halfBreathDuration * spokenLines / 60.0
    // .reduce((a, b) => a + b)

    console.log(spokenDurationMinutes)
    // calculate duration
}

function calc_asana_list () {

    const suryAs = ["suryA", "suryA", "suryA", "suryA", "suryA" ]
    const suryBs = [ "suryB", "suryB", "suryB" ]
    const starting = [ ...suryAs, ...suryBs]
    const fundamentals = ["padangusthasana", "padahastasana", "utthitaTrikonasanaA", "utthitaTrikonasanaB", "utthitaParsvakonasanaA", "utthitaParsvakonasanaB", "prasaritaPadottanasanaA", "prasaritaPadottanasanaB", "prasaritaPadottanasanaC", "prasaritaPadottanasanaD", "parsvottanasana"]
    const standing = ["utthitaHastaPadangusthasana", "ardhaBaddhaPadmottanasana", "utkatasana", "virabhadrasana"]
    const seated_start = ["dandasana", "paschimottanasanaA", "paschimottanasanaBorD", "purvottanasana", "ardhaBaddhaPadmaPaschimottanasana", "triyangaMukhaEkaPadaPaschimottanasana", "januSirsasanaA", "januSirsasanaB", "januSirsasanaC", "maricasanaA", "maricasanaB", "maricasanaC", "maricasanaD", "navasana"]
    const seated_end = ["bhujapidasana", "kurmasana", "suptaKurmasana", "garbhaPindasana", "kukkutasana", "baddhaKonasana", "upavisthaKonasanaA", "upavisthaKonasanaB", "suptaKonasana", "suptaPadangusthasana", "ubhayaPadangusthasana", "urdhvaMukhaPaschimottanasana", "setthuBandhasana"]
    const finishing_start = ["urdhvaDhanurasana", "paschimottanasana", "salambaSarvangasana", "halasana", "karnapidasana", "urdhvaPadmasana", "pindasana", "matsyasana", "uttanaPadasana", "sirsasana"]
    const finishing_end = ["baddhaPadmasana", "yogaMudra", "padmasana", "utpluthih"]

    const primaryElements = ["suryAs", "suryBs", "fundamentals", "standing", "seated_start", "seated_end", "finishing_start", "finishing_end"]

    asanas = []
    for (element of primaryElements) {
        if (document.getElementById(element).checked) {
            asanas = asanas.concat(eval(element))
        }
    }

    return asanas
}
