
let engine = require("../index.js")
let assert = require("assert")

// check that engine.currentAsana is null when engine created
//  check that engine.currentAsana is not null after play has been pressed.


describe('Engine creation', function() {
  // beforeEach(function() {
  //   engine.enqueue(engine.playlists[0])
  //   engine.play()
  // });
  describe('loading', function() {
    it('currentAsana should be null when engine is first loaded', function() {
        assert(!engine.currentAsana);
    });
    it('engine.asanas should not be empty when engine is first loaded', function() {
      assert(engine.asanas);
    });
    it('engine.playlists should not be empty when engine is first loaded', function() {
      assert(engine.playlists);
    });
  });
  describe('playing', function() {
    beforeEach(function() {
        engine.enqueue(engine.playlists[0])
        engine.play()
      });
    it('currentAsana should not be null when engine.play() is triggered', function() {
        assert(engine.currentAsana);
     });
     afterEach(function() {
        engine.reset()
      });
  });
});