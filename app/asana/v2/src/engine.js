function Engine (asanas, playlists, speaker, storage) {

    let asanaIdx = null
    let stepIdx = null
    const handlers = {}
    let timer = null

    playlists.push(...storage.playlists)

    function trigger (event) {
        (handlers[event] || [])
            .forEach(f => f())
    }

    function playSteps ([currentStep, ...remainingSteps] = [], remainingAsanas, remainingCount) {

        if (!currentStep) {
            asanaIdx++
            stepIdx = null
            engine.play(remainingAsanas)
            return
        }

        console.log("Asana idx: ", asanaIdx, "Step idx: ", stepIdx)

        if (!engine.currentAsana) return

        if (!currentStep.counted) {  // normal step
            stepIdx++
            console.log(currentStep.count, currentStep.text)
            speaker.speak(currentStep.count, currentStep.text, time => {
                timer = setTimeout(playSteps, (currentStep.breaths * engine.cycle * 1000) - time,
                remainingSteps, remainingAsanas)
            })
        } else if (remainingCount == undefined) {
            playSteps([currentStep, ...remainingSteps], remainingAsanas, currentStep.breaths)
        } else if (remainingCount != 0) {   // counting down
            console.log(remainingCount)
            speaker.speak(remainingCount, undefined, time => {
                timer = setTimeout(playSteps, (engine.cycle * 1000) - time,
                    [currentStep, ...remainingSteps], remainingAsanas, remainingCount - 1)
            })
        } else {
            stepIdx++
            playSteps(remainingSteps, remainingAsanas)
        }
    }

    const hooks = {}

    function trigger (event, ...args) {
        for (fn of (hooks[event] || []))
            fn(...args)
    }

    const engine = {
        asanas,
        playlists,
        queue: [],

        currentAsana: null,
        totalTime: null,
        remainingTime: null,
        cycle: 6,

        setVolume: speaker.setVolume.bind(speaker),

        on (event, handler) {
            handlers[event] = handlers[event] || []
            handlers[event].push(handler)
        },

        play ([currentAsana, ...remainingAsanas] = engine.queue.slice(asanaIdx)) {

            if (!currentAsana) {
                engine.reset(false)
                trigger("change-asana")
                return
            }

            engine.currentAsana = currentAsana
            trigger("change-asana")

            speaker.speak(undefined, currentAsana.name, () => {
                console.log(currentAsana.name)
                playSteps(currentAsana.steps.slice(stepIdx), remainingAsanas)
            })

        },

        pause () {
            speaker.stop()
            if (stepIdx)
                stepIdx--
            clearTimeout(timer)
        },

        //clears everything
        reset () {
            engine.rewind()
            engine.queue = []
            trigger("reset")
        },

        // resets the counters on the current playlist
        rewind () {
            engine.pause()
            asanaIdx = 0
            stepIdx = 0
            engine.currentAsana = null
        },

        enqueue (obj) {
            const enqueued = obj.asanas
                ? obj.asanas.map(id => asanas.find(a => a.id == id))
                : [obj]
            engine.queue.push(...enqueued)
            for (let e of enqueued)
                trigger("enqueue", e)
        },

        on (eventName, fn) {
            hooks[eventName] = hooks[eventName] || []
            hooks[eventName].push(fn)
        },

        dequeue (idx) {
            engine.queue.splice(idx, 1)
            trigger("dequeue", idx)
        },

        savePlaylist: storage.savePlaylist.bind(storage),
        deletePlaylist: storage.deletePlaylist.bind(storage)

    }

    return engine
}

// module will be defined when running via node.js
if (typeof module != "undefined")
    module.exports = Engine
