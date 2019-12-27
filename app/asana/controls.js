function Controls (player) {

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
                    .on("click", () => player.play()),
                $("<button>")
                    .html("Pause")
                    .on("click", () => player.pause()),
                $("<button>")
                    .html("Reset")
                    .on("click", () => player.reset())))

    function getCycle () {
        return +$cycle.val()
    }

    function registerChangeCallback (fn) {
        hooks.push(fn)
    }

    return {
        $html,
        getCycle,
        registerChangeCallback
    }

}
