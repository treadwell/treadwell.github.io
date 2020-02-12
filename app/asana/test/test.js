
let engine = require("../engine.js")
let assert = require("assert")

// check that engine.currentAsana is null when engine created
//  check that engine.currentAsana is not null after play has been pressed.


describe('Engine creation', function() {
  describe('loading', function() {
    it('currentAsana should be null when engine is first loaded', function() {
        assert.equal(null, engine.currentAsana);
     });
  });
  describe('playing', function() {
    beforeEach(function() {
        engine.enqueue(playlists[0])
        engine.play()
      });
    it('currentAsana should not be null when engine.play() is triggered', function() {
        assert.equal(null, engine.currentAsana);
     });
     afterEach(function() {
        engine.reset()
      });
  });
});