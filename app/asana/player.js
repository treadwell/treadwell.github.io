function Player(asanaSelector) {

    const hooks = []

    const $cycle =
      $("<input>")
          .prop("type", "number")
          .prop("id", "secPerBreath")
          .prop("value", 6)
          .on("input", () => hooks.forEach(fn => fn()))

    const $html =
        $("<div>").append(
            $("<div>").append(
                "Seconds per breath cycle: ", $cycle),
            $("<div>").append(
                "Volume: ",
                $("<input>")
                    .prop("type", "range")
                    .prop("min", 0.0)
                    .prop("max", 1.0)
                    .prop("step", 0.1)
                    .prop("value", 0.5)
                    .prop("id", "volSlide")),
            $("<div>").append(
                $("<button>")
                    .html("Start")
                    .on("click", () => play()),
                $("<button>")
                    .html("Pause")
                    .on("click", () => pause()),
                $("<button>")
                    .html("Reset")
                    .on("click", () => reset())))

    function getCycle () {
        return +$cycle.val()
    }

    function registerChangeCallback (fn) {
        hooks.push(fn)
    }

    function calcTotalTime () {
        console.log("total time")
    }

    function calcElapsedTime () {
        console.log("elapsed time")
    }

    function calcCurrentAsana () {
        console.log("current asana")
    }

    function calcCurrentStep () {
        console.log("current step")
    }
    
    function play () {
        console.log("play")
    }

    function pause () {
        console.log("pause")
    }

    function reset () {
        console.log("reset")
    }

    return {
        $html,
        getCycle,
        registerChangeCallback,
        calcTotalTime,
        calcElapsedTime,
        calcCurrentAsana,
        calcCurrentStep,
        play,
        pause,
        reset
    }
}