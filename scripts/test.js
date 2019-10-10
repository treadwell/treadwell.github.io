// destructure say args
// add tts preload to avoid change in voice
// add scaling visuals
// add Sury A in tts
// make responsive - done

window.onload = () => {
    document.getElementById('notImplemented').setAttribute('onclick','notImplemented()')
}

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

// if you have another AudioContext class use that one, as some browsers have a limit
// var audioCtx = new (window.AudioContext || window.webkitAudioContext || window.audioContext);

function beep({
    duration = 500, //duration of the tone in milliseconds. Default is 500
    frequency = 500, //frequency of the tone in hertz. default is 440
    volume = 0.5, //volume of the tone. Default is 1, off is 0.
    type = "triangle", //type of tone. Possible values are sine, square, sawtooth, triangle, and custom. Default is sine.
    callback = () => console.log("callback test") //callback to use on end of tone
}) {
    var audioCtx = new (window.AudioContext || window.webkitAudioContext || window.audioContext);
    var oscillator = audioCtx.createOscillator()
    var gainNode = audioCtx.createGain()

    gainNode.connect(audioCtx.destination)
    gainNode.gain.value = volume

    oscillator.connect(gainNode)
    oscillator.frequency.value = frequency
    oscillator.type = type
    oscillator.onended = callback
    oscillator.start()

    setTimeout(() => oscillator.stop(), duration)
}

function notImplemented() {
    console.log("feature not implemented")
    document.getElementById('testMsg').innerHTML = "Feature not implemented."
}

function command(message, cycle) {
    const playTone = document.getElementById("tones").checked
    const playVoice = document.getElementById("voice").checked
    const playBar = document.getElementById("bar").checked
    const volume = document.getElementById("volSlide").value

    document.getElementById('txt').innerHTML = message

    if (playTone) {
        if (message === "inhale") {
            beep({ frequency: 1000, volume: volume })
        } else {
            beep({ volume: volume })
        }
    }

    if (playVoice) {
        if (message === "inhale") {
            say({ m: "Inhale." })
        } else {
            say({ m: "Exhale." })
        }
    }

    if (playBar) {
        if (message === "inhale") {
            move(cycle)
        } else {
            // move(cycle)
        }
    }
}

// Destructuring example:
//      const test = { a: 1, c: [1, 2, 3], d: () => 4 }
//      let mike = test.b
//      let { c: [jake, cindy, kara, kenneth = 4] } = test
//      let { c: matt } = test
//      console.log(mike, jake, cindy, kara)

function breathe() {
    // change bpm to seconds and inhale / exhale cycles
    const bpm = document.getElementById("bpm").value
    const duration = document.getElementById("duration").value

    const cycle = 60.0 / bpm * 1000; // ms for a full breath cycle
    const duration_ms = duration * 60 * 1000

    const timers = []  // create separate inhale and exhale timers

    // initiate breathing before setInterval kicks in
    setTimeout(() => command("inhale", cycle), 0)
    setTimeout(() => command("exhale", cycle), cycle / 2)

    // inhale timer on cycle
    timers[0] = setInterval(() => command("inhale", cycle), cycle)

    setTimeout(() => {  // delays exhale timer by half a cycle

        // exhale timer
        timers[1] = setInterval(() => command("exhale", cycle), cycle)
        
        // clear timers.  
        // Position here to make sure there are available timer IDs
        setTimeout(() => {
            clearInterval(timers[0])
            clearInterval(timers[1])
        }, duration_ms)

    }, cycle / 2)

}

function move(cycle) {
    const elem = document.getElementById("breathBar")  
    let progress = 0
    let cumTime = 0
    const timerId = setInterval(frame, 10)
    
    function frame() {
        if (progress < 0) {
            console.log('finished')
            clearInterval(timerId)
        } else if (cumTime <= cycle / 2) {
            cumTime = cumTime + 10
            progress = progress + 10
            console.log('adding', progress, progress / cycle / 2)
            elem.style.width = (2 * 100 * progress / cycle) + '%'
        } else  if (cumTime <= cycle) {
            cumTime = cumTime + 10
            progress = progress - 10
            console.log('subtracting', progress, (100 * progress / cycle / 2))
            elem.style.width = (2 * 100 * progress / cycle) + '%'
        }
    }
  }

