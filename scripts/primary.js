// destructure say args
// add tts preload to avoid change in voice
// add scaling visuals
// add Sury A in tts
// make responsive - done



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
    
    // console.log("asanas:",asanas)

    read_asanas(asanas, cycle)
}

function read_asanas([asana, ...asanas], cycle) {

    if (!asana) return
    
    let lines = document.getElementById(asana).innerText.split('\n')

    // say({ m:lines[0] })
    // lines.shift()

    read_lines(lines, asanas, cycle)
}

function read_lines([line, ...lines], asanas, cycle) {
    if (!line) {
        read_asanas(asanas, cycle)
    } else {
        setTimeout (() => {
            say({ m:line })
            // console.log(line)
            read_lines (lines, asanas, cycle)
        }, cycle)
    }
}

