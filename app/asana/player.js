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
                        $html.play()
                    }),
                $("<button>")
                    .html("Pause")
                    .on("click", () => $html.pause()),
                $("<button>")
                    .html("Reset")
                    .on("click", () => $html.reset())))

    
    $html.reset(false)
    //$html.asanaIdx = 0
    //$html.stepIdx = 0
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

    $html.play = function (
            [asana, ...asanas] = asanaSelector.getChosen().slice($html.asanaIdx), 
            asanaIdx, // = $html.asanaIdx ? $html.asanaIdx : 0,
            stepIdx) { // = $html.stepIdx ? $html.stepIdx : 0) {

        //if (asanaIdx == undefined && !$html.asanaIdx)
        //    $html.asanaIdx = 0
        
        //if (stepIdx == undefined && !html.stepIdx) 
        //    $html.stepIdx = 0

        //$html.breakFlag = false
        //$html.asanaIdx = asanaIdx
        //$html.stepIdx = stepIdx

        if (!asana) {
            $html.reset(false)
            $html.trigger("change-asana")
            return
        }

        $html.currentAsana = asana
        $html.trigger("change-asana")

        speaker.speak(undefined, asana.name, () => {
            console.log(asana.name)

            //if ($html.breakFlag) return
            //if ($html.currentAsana == "None") return

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

        //if ($html.breakFlag) return
        if (!$html.currentAsana) return

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

    $html.reset = function (clear = true) {
        console.log("reset clicked")
        if (clear)
            asanaSelector.removeAll()
        //$html.breakFlag = true
        // $html.pause()
        $html.asanaIdx = 0
        $html.stepIdx = 0
        $html.currentAsana = null
    }

    return $html
}