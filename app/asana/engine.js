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
            play(remainingAsanas)
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
            engine.currentAsana = null
            clearTimeout(timer)
        },

        //clears everything
        reset () {
            engine.rewind()
            engine.queue = []
        },

        // resets the counters on the current playlist
        rewind () {
            engine.pause()
            asanaIdx = 0
            stepIdx = 0
        },

        enqueue (obj) {
            engine.queue.push(...(obj.asanas 
                ? obj.asanas.map(id => asanas.find(a => a.id == id))
                : [obj]))
        },

        dequeue (asana) {
            const idx = engine.queue.indexOf(asana)
            if (!~idx)
                return 
            engine.queue.splice(idx, 1)
        },

        savePlaylist: storage.savePlaylist.bind(storage),
        deletePlaylist: storage.deletePlaylist.bind(storage)

    }

    return engine
    
}

testAsanas = [
    {"id": "bbb", "name": "Testing: short 1","steps": [{"count": "1", "breaths": 0.5,"text": "Step 1."},
            { "count": "2", "breaths": 0.5,"text": "Step 2."},{ "count": "3","breaths": 0.5,"text": "Step 3."},
            {"breaths": 3,"counted": true},{"count": "4","breaths": 0.5,"text": "Step 4"}],"seq": 1000,"series": "test"},
    { "id": "ccc","name": "Testing: short 2","steps": [ {"count": "15","breaths": 0.5,"text": "Step 1."},
            {"count": "16","breaths": 0.5,"text": "Step 2."},{"count": "17","breaths": 0.5,"text": "Step 3."},
            {"breaths": 2,"counted": true},{"count": "18","breaths": 0.5,"text": "Step 4."}],"seq": 1001,"series": "test" },
    {"id": "ddd","name": "Testing: short 3","steps": [
            {"count": "15", "breaths": 0.5, "text": "Step 1."},
            {"count": "16", "breaths": 0.5,"text": "Step 2."},
            {"count": "17", "breaths": 0.5, "text": "Step 3."},
            {"breaths": 2,"counted": true},
            {"count": "18","breaths": 0.5,"text": "Step 4."}],"seq": 1002,"series": "test"}]

testPlaylists = [{"name 1": "Test", "series": ["bbb", "ccc", "ddd" ]},
            {"name 2": "Test", "series": ["ccc", "ddd" ]}]


function addOne (x) {return (x + 1)};

module.exports = {
    addOne,
    Engine,
    testAsanas,
    testPlaylists
}

