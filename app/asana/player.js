function Player(asanaSelector) {

    const $cycle =
      $("<input>")
          .prop("type", "number")
          .prop("id", "secPerBreath")
          .prop("value", 6)
          .on("input", () => $html.trigger("change-cycle-duration"))

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
                    .on("click", () => $html.play()),
                $("<button>")
                    .html("Pause")
                    .on("click", () => $html.pause()),
                $("<button>")
                    .html("Reset")
                    .on("click", () => $html.reset())))

    $html.getCycle = function () {
        return +$cycle.val()
    }

    $html.calcTotalTime = function () {
        console.log("total time")
    }

    $html.calcElapsedTime = function () {
        console.log("elapsed time")
    }

    $html.calcCurrentAsana = function () {
        console.log("current asana")
    }

    $html.calcCurrentStep = function () {
        console.log("current step")
    }
    
    $html.play = function () {
        console.log("play")
    }

    $html.pause = function () {
        console.log("pause")
    }

    $html.reset = function () {
        console.log("reset")
    }

    return $html
}