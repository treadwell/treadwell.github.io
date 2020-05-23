function Engine (asanas, playlists, speaker, storage) {

    let currentNode = null
    let stepIdx = null
    const handlers = {}
    let timer = null

    playlists.push(...storage.playlists)

    function trigger (event) {
        (handlers[event] || [])
            .forEach(f => f())
    }

    function playSteps (node, [currentStep, ...remainingSteps] = [], remainingCount) {

        if (!currentStep) {
            stepIdx = null
            engine.play(node.next)
            return
        }

        console.log("Node: ", node, "Step idx: ", stepIdx)

        if (!engine.currentAsana) {
            engine.rewind()
            return
        }

        if (!currentStep.counted) {  // normal step
            stepIdx++
            console.log(currentStep.count, currentStep.text)
            speaker.speak(currentStep.count, currentStep.text, time => {
                timer = setTimeout(playSteps, (currentStep.breaths * engine.cycle * 1000) - time,
                    node.next, remainingSteps)
            })
        } else if (remainingCount == undefined) {
            playSteps(node.next, [currentStep, ...remainingSteps], currentStep.breaths)
        } else if (remainingCount != 0) {   // counting down
            console.log(remainingCount)
            speaker.speak(remainingCount, undefined, time => {
                timer = setTimeout(playSteps, (engine.cycle * 1000) - time,
                    node.next, [currentStep, ...remainingSteps], remainingCount - 1)
            })
        } else {
            stepIdx++
            playSteps(node.next, remainingSteps)
        }
    }

    const hooks = {}

    function trigger (event, ...args) {
        for (fn of (hooks[event] || []))
            fn(...args)
    }

    let qStart = null
    let qEnd = null

    const engine = {
        asanas,
        playlists,

        currentAsana: null,
        totalTime: null,
        remainingTime: null,
        cycle: 6,

        setVolume: speaker.setVolume.bind(speaker),

        play (node = currentNode || qStart) {

            engine.isPlaying = true
            trigger("play")

            currentNode = node

            if (!node) {
                engine.reset()
                trigger("change-asana")
                return
            }

            engine.currentAsana = node.asana
            trigger("change-asana")

            speaker.speak(undefined, node.asana.name, () => {
                console.log(node.asana.name)
                playSteps(node, node.asana.steps.slice(stepIdx))
            })

        },

        pause () {
            engine.isPlaying = false
            speaker.stop()
            if (stepIdx)
                stepIdx--
            clearTimeout(timer)
            trigger("pause")
        },

        //clears everything
        reset () {
            engine.rewind()
            qStart = qEnd = null
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
            for (let asana of enqueued) {
                const node = {
                    prev: qEnd,
                    next: null,
                    asana
                }
                if (!qStart) qStart = node
                if (qEnd) qEnd.next = node
                qEnd = node
                trigger("enqueue", node)
            }
                
        },

        dequeue (node) {
            if (node == qStart) qStart = node.next
            if (node == qEnd) qEnd = node.prev
            if (node.next) node.next.prev = node.prev
            if (node.prev) node.prev.next = node.next
            node.prev = null
            node.next = null
            trigger("dequeue", node)
        },

        savePlaylist: storage.savePlaylist.bind(storage),
        deletePlaylist: storage.deletePlaylist.bind(storage),

        on (eventName, fn) {
            hooks[eventName] = hooks[eventName] || []
            hooks[eventName].push(fn)
        },

    }

    return engine
}

// module will be defined when running via node.js
if (typeof module != "undefined")
    module.exports = Engine
