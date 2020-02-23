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

    suite("Enqueue", function() {
        setup(function() {
            engine.enqueue(engine.asanas[0])
            engine.enqueue(engine.playlists[0])
        })
        test("queue[] should be an array and length 4", function() {
            assert(Array.isArray(engine.queue) && engine.queue.length == 4)
        })
        test("queue[0] should equal asanas[0]", function() {
            assert(engine.queue[0].name == engine.asanas[0].name)
        })
        test("queue[1] should equal playlists[0]", function() {
            assert(engine.queue[1].id == engine.playlists[0].asanas[0])
        })
        teardown(function() {
            engine.reset()
        })
    })

    suite("Dequeue", function() {
        setup(function() {
            engine.enqueue(engine.asanas[0])
            engine.enqueue(engine.playlists[0])
            engine.dequeue(engine.queue[0])
        })
        test("queue[] should be an array and length 3", function() {
            assert(Array.isArray(engine.queue) && engine.queue.length == 3)
        })
        test("queue[0] should equal playlists[0]", function() {
            assert(engine.queue[0].id == engine.playlists[0].asanas[0])
        })
        teardown(function() {
            engine.reset()
        })
    })

    suite("Playing", function() {
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
        // after pressing play, current asana is the first asana in the queue
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
        // after pressing play, current asana is still null and the queue is still empty
        setup(function() {
            engine.enqueue(engine.playlists[0])
            engine.play()
            engine.reset()
        })
        test("currentAsana should be null when engine.reset() is triggered", function() {
            assert(!engine.currentAsana)
        })
        test("queue should be empty when engine.reset() is triggered", function() {
            assert(Array.isArray(engine.queue) && engine.queue.length == 0)
        })
        teardown(function() {
            engine.reset()
        })
    })

})
