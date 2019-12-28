function Player(asanaSelector, speaker) {

    const $cycle =
      $("<input>")
          .prop("type", "number")
          .prop("id", "secPerBreath")
          .prop("value", 6)
          .on("input", () => $html.trigger("change-cycle-duration"))

    const $volume = 
        $("<input>")
            .prop("type", "range")
            .prop("min", 0.0)
            .prop("max", 1.0)
            .prop("step", 0.1)
            .prop("value", 0.5)
            .prop("id", "volSlide")
            .on("change", () => speaker.setVolume($volume.val()))

    const $html =
        $("<div>").append(
            $("<div>").append(
                "Seconds per breath cycle: ", $cycle),
            $("<div>").append(
                "Volume: ",
                $volume),
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
        return $html.getCycle() *
            asanaSelector.getChosen().reduce((a0, asana) =>
                a0 + asana.steps.reduce((a1, step) =>
                    a1 + step.breaths, 0), 0)
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
    
    $html.play = function ([asana, ...asanas] = asanaSelector.getChosen()) {
        // TODO: Say name of asana
        if (!asana) return
        playSteps(asana.steps, asanas)
    }

    function playSteps ([step, ...steps] = [], asanas, remainingCount) {
        
        if (!step) {
            $html.play(asanas)
            return
        }
        
        let args = [ steps, asanas ]
        let breaths = 0
        
        if (!step.counted) {
            speaker.speak(step.count, step.text)
            breaths = step.breaths
        } else if (remainingCount == undefined) {
            args = [ [step, ...steps], asanas, step.breaths ]
        } else if (remainingCount != 0) {
            speaker.speak(remainingCount)
            args = [ [step, ...steps], asanas, remainingCount - 1 ]
            breaths = 1
        }  

        setTimeout(playSteps, breaths * $html.getCycle() * 1000, ...args)
    }


    $html.pause = function () {
        console.log("pause")
    }

    $html.reset = function () {
        console.log("reset")
    }

    return $html
}