module.exports = function Speaker (numbers) {

    let timer = null

    function say ({
        voice = 10,
        m = "Hello world.",
        onEnd = () => {}
    }) {
        const timeStart = Date.now()
        console.log(`\t\tSpeaking: ${m}`)
        timer = setTimeout(() => {
            console.log("=> Done!")
            onEnd(Date.now() - timeStart)
        }, m.split(/\s*/).length * 50)
    }

    function setVolume (v) {
        console.log("(not) setting the volume")
    }

    function stop () {
        clearTimeout(timer)
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
