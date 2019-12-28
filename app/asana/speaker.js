function Speaker (numbers) {

    let volume = 0.5

    function say ({
        voice = 10, 
        voiceURI = "native", 
        rate = 1.0,
        pitch = 1.0,
        m = "Hello world.",
        lang = "en-US",
        onEnd = () => {}
    }) {
        var voices = window.speechSynthesis.getVoices();
        speechSynthesis.speak(Object.assign(new SpeechSynthesisUtterance(), {
            voice: voices[voice],  // en has 1, 10, 17, hi-IN is 20
            //voiceURI: voiceURI,
            //volume: volume,
            //rate: rate,
            //pitch: pitch,
            text: m,
            //lang: lang,
            onend: onEnd,
        }))
    }

    function setVolume (v) {
        volume = v
    }

    function speak (count, text) {
        if (!count && text) {
            say({
                m: text
            })
        } else {
            say({ 
                m: text ? numbers[count] + "." : count,
                onEnd: !text ? undefined : () => 
                    say({ 
                        m: text
                    }) 
            })
        }
    }

    return { speak, setVolume }

}