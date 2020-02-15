const assert = require("assert")

const engine = require("../engine.js")(
    require("./asanas.json"),
    require("./playlists.json"),
    require("./mock/speaker.js")(require("./numbers.json")),
    require("./mock/storage.js")())

suite("Engine creation", function() {

    suite("Basic properties initialized", function() {
        test("currentAsana should be null when engine is first loaded", function() {
            assert(!engine.currentAsana)
        })
        test("engine.asanas should not be empty when engine is first loaded", function() {
            assert(Array.isArray(engine.asanas) && engine.asanas.length)
        })
        test("engine.playlists should not be empty when engine is first loaded", function() {
            assert(Array.isArray(engine.playlists) && engine.playlists.length)
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
        teardown(function() {
            engine.reset()
        })
    })

})
