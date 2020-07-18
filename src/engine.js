module.exports = function (asanas, defaultPlaylists, speaker, storage) {

    let currentNode = null
    let stepIdx = null
    let timer = null

    function playSteps (node, [currentStep, ...remainingSteps] = [], remainingCount) {

        if (!currentStep) {
            stepIdx = null
            engine.play(node.next)
            return
        }

        console.log("Node: ", node, "Step idx: ", stepIdx)

        if (!engine.currentAsana)
            return

        trigger("change-step")

        if (!currentStep.counted) {  // normal step
            stepIdx++
            console.log(currentStep.count, currentStep.text)
            speaker.speak(currentStep.count, currentStep.text, time => {
                timer = setTimeout(playSteps, (currentStep.breaths * engine.cycle * 1000) - time,
                    node, remainingSteps)
            })
        } else if (remainingCount == undefined) {
            playSteps(node, [currentStep, ...remainingSteps], currentStep.breaths)
        } else if (remainingCount != 0) {   // counting down
            console.log(remainingCount)
            speaker.speak(remainingCount, undefined, time => {
                timer = setTimeout(playSteps, (engine.cycle * 1000) - time,
                    node, [currentStep, ...remainingSteps], remainingCount - 1)
            })
        } else {
            stepIdx++
            playSteps(node, remainingSteps)
        }
    }

    function serializeQueue () {
        return {
            asanas: (() => {
                const xs = []
                let n = qStart
                while (n) {
                    xs.push(n.asana.id)
                    n = n.next
                }
                return xs
            })()
        }
    }

    const hooks = {}

    function trigger (event, ...args) {
        for (let fn of (hooks[event] || []))
            fn(...args)
    }

    let qStart = null
    let qEnd = null

    const engine = {
        asanas,
        defaultPlaylists,
        savedPlaylists: storage.playlists,

        currentAsana: null,
        timeTotal: 0,
        timeRemaining: 0,
        cycle: 6,

        setVolume: speaker.setVolume.bind(speaker),

        play (node = currentNode || qStart) {

            engine.isPlaying = true
            trigger("play")

            currentNode = node

            if (!node) {
                engine.rewind()
                trigger("playlist-end")
                return
            }

            engine.currentAsana = node.asana
            trigger("change-asana", node)

            speaker.speak(undefined, node.asana.pronunciation, () => {
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
            engine.pause()
            currentNode = engine.currentAsana = qStart = qEnd = null
            stepIdx = 0
            trigger("reset")
            trigger("queue-modified")
        },

        // resets the counters on the current playlist
        rewind () {
            engine.pause()
            stepIdx = 0
            currentNode = qStart
            engine.currentAsana = null
            trigger("rewind")
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
            trigger("queue-modified")
        },

        dequeue (node) {
            trigger("dequeue", node)
            if (node == currentNode)
                engine.next()
            if (node == qStart) qStart = node.next
            if (node == qEnd) qEnd = node.prev
            if (node.next) node.next.prev = node.prev
            if (node.prev) node.prev.next = node.next
            node.prev = null
            node.next = null
            trigger("queue-modified")
        },

        prev () {
            const cn = currentNode || {}
            const ip = engine.isPlaying
            engine.rewind()
            currentNode = cn.prev
            if (ip) engine.play()
        },

        next () {
            const cn = currentNode || {}
            const ip = engine.isPlaying
            engine.rewind()
            currentNode = cn.next
            if (ip) engine.play()
        },

        savePlaylist (name) {
            const playlist = serializeQueue()
            const isUpdate = storage.savePlaylist(playlist, name)
            trigger("playlist-saved", playlist, isUpdate)
        },

        deletePlaylist (name) {
            storage.deletePlaylist(storage.getPlaylist(name))
            trigger("playlist-deleted", name)
        },

        getSavedPlaylist: storage.getPlaylist.bind(storage),

        on (eventName, fn) {
            hooks[eventName] = hooks[eventName] || []
            hooks[eventName].push(fn)
        },

        calcTimeTotal(n, i = 0) {
            n = n || qStart
            let total = 0
            while (n) {
                total += n.asana.steps.slice(i).reduce((a, s) =>
                    a + s.breaths * engine.cycle, 0)
                i = 0
                n = n.next
            }
            return total
        },

        calcTimeRemaining() {
            return engine.calcTimeTotal(currentNode, stepIdx)
        },

        init () {
            if (storage.lastPlaylist)
                engine.enqueue(storage.lastPlaylist)
        }

    }
    
    engine.on("queue-modified", () => 
        storage.savePlaylist(serializeQueue()))

    return engine
}