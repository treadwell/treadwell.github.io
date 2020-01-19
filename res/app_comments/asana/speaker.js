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
        // speechSynthesis.cancel()
        var voices = window.speechSynthesis.getVoices()
        const timeStart = Date.now()
        speechSynthesis.speak(Object.assign(new SpeechSynthesisUtterance(), {
            voice: voices[voice],  // en has 1, 10, 17, hi-IN is 20
            volume: volume,
            text: m,
            onend: () => onEnd(Date.now() - timeStart),
        }))
    }

    function setVolume (v) {
        volume = v
    }

    function speak (count, text, callback) {
        if (!count && text) {
            say({
                m: text,
                onEnd: callback
            })
        } else {
            say({
                m: text ? numbers[count] + "." : count,
                onEnd: !text ? callback : () =>
                    say({
                        m: text,
                        onEnd: callback
                    })
            })
        }
    }

    return { speak, setVolume }

}
