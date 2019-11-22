// destructure say args
// add tts preload to avoid change in voice
// add scaling visuals
// add Sury A in tts
// make responsive - done

let $asanaIdx = 1
let $lineIdx = 0

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

    const primarySeries = {
        suryAs: {
            key: "suryAs", 
            value: ["suryA", "suryA", "suryA", "suryA", "suryA" ]
        },
        suryBs: {
            key: "suryBs",
            value: ["suryA", "suryA", "suryA", "suryA", "suryA" ]
        }
    }

    const suryAs = ["suryA", "suryA", "suryA", "suryA", "suryA" ]
    const suryBs = [ "suryB", "suryB", "suryB" ]
    const starting = [ ...suryAs, ...suryBs]
    const fundamentals = ["padangusthasana", "padahastasana", "utthitaTrikonasanaA", "utthitaTrikonasanaB", "utthitaParsvakonasanaA", "utthitaParsvakonasanaB", "prasaritaPadottanasanaA", "prasaritaPadottanasanaB", "prasaritaPadottanasanaC", "prasaritaPadottanasanaD", "parsvottanasana"]
    const standing = ["utthitaHastaPadangusthasana", "ardhaBaddhaPadmottanasana", "utkatasana", "virabhadrasana"]
    const seated_start = ["dandasana", "paschimottanasanaA", "paschimottanasanaBorD", "purvottanasana", "ardhaBaddhaPadmaPaschimottanasana", "triyangaMukhaEkaPadaPaschimottanasana", "januSirsasanaA", "januSirsasanaB", "januSirsasanaC", "maricasanaA", "maricasanaB", "maricasanaC", "maricasanaD", "navasana"]
    const seated_end = ["bhujapidasana", "kurmasana", "suptaKurmasana", "garbhaPindasana", "kukkutasana", "baddhaKonasana", "upavisthaKonasanaA", "upavisthaKonasanaB", "suptaKonasana", "suptaPadangusthasana", "ubhayaPadangusthasana", "urdhvaMukhaPaschimottanasana", "setthuBandhasana"]
    const finishing_start = ["urdhvaDhanurasana", "paschimottanasana", "salambaSarvangasana", "halasana", "karnapidasana", "urdhvaPadmasana", "pindasana", "matsyasana", "uttanaPadasana", "sirsasana"]
    const finishing_end = ["baddhaPadmasana", "yogaMudra", "padmasana", "utpluthih"]

    const half = [...starting, ...fundamentals, ...standing, ...seated_start, ...finishing_start, ...finishing_end]
    
    const primaryElements = ["suryAs", "suryBs", "fundamentals", "standing", "seated_start", "seated_end", "finishing_start", "finishing_end"]
    
    asanas = []
    for (element of primaryElements) {
        if (document.getElementById(element).checked) {
            asanas = asanas.concat(eval(element))
        }
    }
    
    console.log("readAloud 0:", $asanaIdx, $lineIdx)

    read_asanas(asanas.slice($asanaIdx), cycle)
}

function read_asanas([asana, ...asanas], cycle) {
    console.log("read_asanas 0:", $asanaIdx, $lineIdx)

    if (!asana) return

    console.log(asana, "index:", $asanaIdx)
    
    let lines = document.getElementById(asana).innerText.split(/[\r\n]+/)
    // alert(JSON.stringify(lines, null, 2))
    document.getElementById("currentAsana").innerHTML = lines[0]
    say({ m: lines[0] })
    console.log($lineIdx, lines[0])
    $lineIdx = 1

    console.log("read_asanas 1:", $asanaIdx, $lineIdx)
    read_lines(lines.slice($lineIdx), asanas, cycle)
    
    $asanaIdx++
    console.log("read_asanas 2:", $asanaIdx, $lineIdx)
}

function read_lines([line, ...lines], asanas, cycle) {
    console.log("read_lines 0:", $asanaIdx, $lineIdx)
    if (!line) {
        console.log("read_lines 1:", $asanaIdx, $lineIdx)
        read_asanas(asanas, cycle)
    } else {
        console.log("read_lines 2:", $asanaIdx, $lineIdx)
        setTimeout(() => {
            say({ m: line })
            console.log($lineIdx, line)
            read_lines (lines, asanas, cycle)
            $lineIdx++
            console.log("read_lines 4:", $asanaIdx, $lineIdx)
        }, cycle)
        
        console.log("read_lines 5:", $asanaIdx, $lineIdx)
    }
}
