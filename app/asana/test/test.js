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
        setup(function() {
            engine.enqueue(engine.playlists[0])
            engine.play()
            engine.pause()
        })
        test("currentAsana should be null when engine.pause() is triggered", function() {
            assert(!engine.currentAsana)
        })
        test("asanaIdx and stepIdx should be >= 0 when engine.pause() is triggered", function() {
            assert(engine._asanaIdx >= 0 && engine._stepIdx >=0)
        })
        test("queue should not be empty when engine.pause() is triggered", function() {
            assert(Array.isArray(engine.queue) && engine.queue.length)
        })
        teardown(function() {
            engine.reset()
        })
    })

})
