
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
        console.log(testEngine)
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
      testEngine.engine.enqueue(testEngine.playlists[0])
      testEngine.engine.play()
      });
    it('currentAsana should not be null when engine.play() is triggered', function() {
        assert(testEngine.engine.currentAsana);
     });
     afterEach(function() {
      testEngine.engine.reset()
      });
  });
});

describe('Mocha testing', function() {
  // beforeEach(function() {
  //   engine.enqueue(engine.playlists[0])
  //   engine.play()
  // });
  describe('addOne', function() {
    it('addOne should return argument plus 1', function() {
        assert.equal(1, testEngine.addOne(0));
    });

  });
  
});