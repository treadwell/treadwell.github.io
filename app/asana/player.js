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

    $html.calcCurrentAsana = function (asana) {
        return asana.name
    }

    $html.calcCurrentStep = function () {
        console.log("current step")
    }
    
    $html.play = function ([asana, ...asanas] = asanaSelector.getChosen()) {
        // TODO: Say name of asana
        if (!asana) return
        
        speaker.speak(undefined, asana.name, () => {
            console.log(asana.name)
            $html.trigger("change-asana")
            playSteps(asana.steps, asanas)
        })
    }

    function playSteps ([step, ...steps] = [], asanas, remainingCount) {
        
        if (!step) {
            $html.play(asanas)
            return
        }
        
        if (!step.counted) {
            console.log(step.count, step.text)
            speaker.speak(step.count, step.text, time => {
                setTimeout(playSteps, (step.breaths * +$html.getCycle() * 1000) - time, 
                    steps, asanas)
            })
        } else if (remainingCount == undefined) {
            playSteps([step, ...steps], asanas, step.breaths)
        } else if (remainingCount != 0) {
            console.log(remainingCount) 
            speaker.speak(remainingCount, undefined, time => {
                setTimeout(playSteps, (+$html.getCycle() * 1000) - time, 
                    [step, ...steps], asanas, remainingCount - 1)
            })
        } else {
            playSteps(steps, asanas)
        }
    }

    $html.pause = function () {
        console.log("pause")
    }

    $html.reset = function () {
        console.log("reset")
    }

    return $html
}