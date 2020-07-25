module.exports = function (numbers) {

    let volume = 0.5
    let utterance = null

    function say ({
        voice = 10, 
        m = "Hello world.",
        onEnd = () => {}
    }) {
        var voices = window.speechSynthesis.getVoices()
        const timeStart = Date.now()
        utterance = Object.assign(new SpeechSynthesisUtterance(), {
            voice: voices[voice],  // en has 1, 10, 17, hi-IN is 20
            volume: volume,
            text: m,
            onend: () => onEnd(Date.now() - timeStart),
        })
        speechSynthesis.speak(utterance)
    }

    function setVolume (v) {
        volume = v
    }

    function stop () {
        if (utterance)
            utterance.onend = null
        speechSynthesis.cancel()
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

    return { speak, setVolume, stop }

}
