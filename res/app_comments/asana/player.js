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
            $("<h2>").append("Player Controls"),
            $("<div>").append(
                "Seconds per breath cycle: ", $cycle),
            $("<div>").append(
                "Volume: ",
                $volume),
            $("<div>").append(
                $("<button>")
                    .html("Play / Resume")
                    .on("click", () => {
                        $html.breakFlag = false
                        $html.play()}),
                $("<button>")
                    .html("Pause")
                    .on("click", () => $html.pause()),
                $("<button>")
                    .html("Reset")
                    .on("click", () => $html.reset())))

    $html.prop("asanaIdx", null)
    $html.prop("stepIdx", null)

    let timer1 = null
    let timer2 = null

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

    $html.getCurrentStep = function () {
        return $html.stepIdx
    }

    $html.calcCurrentStep = function () {
        console.log("current step")
    }

    $html.play = function ([asana, ...asanas] = asanaSelector.getChosen().slice($html.asanaIdx),
            asanaIdx = $html.asanaIdx ? $html.asanaIdx : 0,
            stepIdx = $html.stepIdx ? $html.stepIdx : 0 ) {

        // COMMENT: I think you can just use $html.currentAsana as your "break
        // flag". When the user presses play, set currentAsana to the first
        // asana, when the user presses pause, just clear the timeouts, and
        // when the user presses reset, clear the timeouts and set currentAsana
        // to null.
        //
        // This will remove the need for the breakFlag variable.
        //
        //  QUESTION: I use the contents of currentAsana in a display element
        
        $html.breakFlag = false
        $html.asanaIdx = asanaIdx
        $html.stepIdx = stepIdx

        if (!asana) {
            $html.currentAsana = "None"
            $html.asanaIdx = null
            $html.trigger("change-asana")
            return
        }

        speaker.speak(undefined, asana.name, () => {
            console.log(asana.name)
            // COMMENT: Consider setting currentAsana to asana instead of
            // asana.name. Another option is to rename $html.currentAsana to
            // $html.currentAsanaName and continue setting it to asana.name,
            // but that will be less flexible.
            //
            $html.currentAsana = asana.name
            $html.trigger("change-asana")

            if ($html.breakFlag === true) return

            playSteps(asana.steps.slice($html.stepIdx), asanas)

        })
    }

    function playSteps ([step, ...steps] = [], asanas, remainingCount) {

        if (!step) {
            $html.asanaIdx++
            $html.stepIdx = null
            $html.play(asanas)
            return
        }

        console.log("Asana idx: ", $html.asanaIdx, "Step idx: ", $html.stepIdx)

        if ($html.breakFlag === true) return

        if (!step.counted) {  // normal step
            $html.stepIdx++
            console.log(step.count, step.text)
            speaker.speak(step.count, step.text, time => {
                timer1 = setTimeout(playSteps, (step.breaths * +$html.getCycle() * 1000) - time,
                    steps, asanas)
            })
        } else if (remainingCount == undefined) {
            playSteps([step, ...steps], asanas, step.breaths)
        } else if (remainingCount != 0) {   // counting down
            console.log(remainingCount)
            speaker.speak(remainingCount, undefined, time => {
                timer2 = setTimeout(playSteps, (+$html.getCycle() * 1000) - time,
                    [step, ...steps], asanas, remainingCount - 1)
            })
        } else {
            $html.stepIdx++
            playSteps(steps, asanas)
        }
    }

    $html.pause = function () {
        console.log("timers 1 and 2: ", timer1, timer2)
        clearTimeout(timer1)
        clearTimeout(timer2)
    }

    $html.reset = function () {
        console.log("reset clicked")
        asanaSelector.removeAll()
        $html.breakFlag = true
        // COMMENT: Delete this $html.pause() line if it's not needed instead
        // of committing it commented out.
        //
        // If, however, you plan on removing the breakFlag variable per my
        // previous suggestion, you may need this line.
        //
        // $html.pause()
        $html.asanaIdx = null
        $html.stepIdx = null
        // COMMENT: Consider setting currentAsana to null instead of "None".
        // This goes with my earlier comment regarding currentAsana.
        //
        $html.currentAsana = "None"
    }

    return $html
}
