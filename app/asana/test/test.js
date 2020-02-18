const assert = require("assert")

const engine = require("../engine.js")(
    require("./asanas.json"),
    require("./playlists.json"),
    require("./mock/speaker.js")(require("./numbers.json")),
    require("./mock/storage.js")())

suite("Engine creation", function() {

    suite("Basic properties initialized", function() {
        test("currentAsana, asanaIdx, stepIdx should be null when engine is first loaded", function() {
            assert(!engine.currentAsana && !engine._asanaIdx && !engine._stepIdx)
        })
        test("engine.asanas should not be empty when engine is first loaded", function() {
            assert(Array.isArray(engine.asanas) && engine.asanas.length)
        })
        test("engine.playlists should not be empty when engine is first loaded", function() {
            assert(Array.isArray(engine.playlists) && engine.playlists.length)
        })
    })

    suite("Playing", function() {
        // how to check if this is actually playing?
        // this needs a few enqueues...
        setup(function() {
            engine.enqueue(engine.playlists[0])
            engine.play()
        })
        test("currentAsana should not be null when engine.play() is triggered", function() {
            assert(engine.currentAsana)
        })
        test("queue should not be empty when engine.play() is triggered", function() {
            assert(Array.isArray(engine.queue) && engine.queue.length)
        })
        teardown(function() {
            engine.reset()
        })
    })

    suite("Pause", function() {
        // needs to check that engine isn't actually playing
        // currentAsana shouldn't be null, there's stuff in the queue
        setup(function() {
            engine.enqueue(engine.playlists[0])
            engine.play()
            engine.pause()
        })
        test("currentAsana should not be null when engine.pause() is triggered", function() {
            assert(engine.currentAsana)
        })
        test("queue should not be empty when engine.pause() is triggered", function() {
            assert(Array.isArray(engine.queue) && engine.queue.length)
        })
        teardown(function() {
            engine.reset()
        })
    })

    suite("Rewind", function() {
        // needs to check that engine isn't actually playing
        // currentAsana should be null, there's stuff in the queue
        setup(function() {
            engine.enqueue(engine.playlists[0])
            engine.play()
            engine.rewind()
        })
        test("currentAsana should be null when engine.rewind() is triggered", function() {
            assert(!engine.currentAsana)
        })
        test("queue should not be empty when engine.rewind() is triggered", function() {
            assert(Array.isArray(engine.queue) && engine.queue.length)
        })
        teardown(function() {
            engine.reset()
        })
    })

    suite("Reset", function() {
        // needs to check that engine isn't actually playing
        // currentAsana should be null, there's nothing in the queue
        setup(function() {
            engine.enqueue(engine.playlists[0])
            engine.play()
            engine.reset()
        })
        test("currentAsana should be null when engine.reset() is triggered", function() {
            assert(!engine.currentAsana)
        })
        test("queue should not be empty when engine.reset() is triggered", function() {
            assert(Array.isArray(engine.queue) && engine.queue.length == 0)
        })
        teardown(function() {
            engine.reset()
        })
    })

})
