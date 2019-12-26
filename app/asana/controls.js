function Controls () {

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
                    .html("Start Reading")
                    .on("click", () => console.log("Start Reading")),
                $("<button>")
                    .html("Pause")
                    .on("click", () => console.log("Pause")),
                $("<button>")
                    .html("Resume")
                    .on("click", () => console.log("Resume")),
                $("<button>")
                    .html("Reset")
                    .on("click", () => console.log("Reset"))))

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
