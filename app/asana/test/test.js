
let testEngine = require("../engine.js")
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
        assert(!testEngine.currentAsana);
    });
    it('engine.asanas should not be empty when engine is first loaded', function() {
      assert(testEngine.asanas);
    });
    it('engine.playlists should not be empty when engine is first loaded', function() {
      assert(testEngine.playlists);
    });
  });
  describe('playing', function() {
    beforeEach(function() {
      testEngine.enqueue(testEngine.playlists[0])
      testEngine.play()
      });
    it('currentAsana should not be null when engine.play() is triggered', function() {
        assert(testEngine.currentAsana);
     });
     afterEach(function() {
      testEngine.reset()
      });
  });
});