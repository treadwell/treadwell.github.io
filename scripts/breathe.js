let $bpm = null
let $duration = null
let $playTone = null
let $playVoice = null
let $playBar = null
let $volume = null
let timer = null

$(document).ready(() =>
    $(document.body).append(
        $("<div>")
            .append(
                $("<p>")
                    .html("Breaths per minute (count): ")
                    .append(
                        $bpm = $("<input>", {
                            type: "number",
                            value: 5
                        })
                    )
            ),
        $("<div>")
            .append(
                $("<p>")
                    .html("Length of practice (minutes): ")
                    .append(
                        $duration = $("<input>", {
                            type: "number",
                            value: 20
                        })
                    )
            ),
        $("<div>")
            .append(
                $("<p>")
                    .html("Play tones")
                    .append(
                        $playTone = $("<input>", {
                            type: "checkbox",
                            id: "tones",
                            checked: false
                        })
                    )
            ),
        $("<div>")
            .append(
                $("<p>")
                    .html("Play voice")
                    .append(
                        $playTone = $("<input>", {
                            type: "checkbox",
                            id: "voice",
                            checked: false
                        })
                    )
            ),
        $("<div>")
            .append(
                $("<p>")
                    .html("Progress circle")
                    .append(
                        $playBar = $("<input>", {
                            type: "checkbox",
                            id: "bar",
                            checked: true
                        })
                    )
            ),
        $("<div>")
            .append(
                $("<p>")
                    .html("Volume")
                    .append(
                        $volume = $("<input>", {
                            type: "range",
                            id: "volSlide",
                            min: 0.0,
                            max: 1.0,
                            step: 0.01,
                            value: 0.5,
                            class: "slider"
                        })
                    )
            ),
        $("<div>")
            .append(
                $("<button>")
                    .html("Start Timer")
                    .on("click", () => $bpm.val($bpm.val() + 1)))
            .append(
                $("<button>")
                    .html("Stop Timer")
                    .on("click", () => {
                        console.log("stop")
                        timer = null
                })),
        $("<div>", {
            id: "breathProgressCircle"
        })
            .append(
                $("<div>", {
                    id: "breathCircle"
                }),
                $("<div>", {
                    id: "txt"
                })
            )
                
                ))