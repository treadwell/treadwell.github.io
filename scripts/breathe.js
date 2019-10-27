let $bpm = null
let $duration = null
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
                $("<button>")
                    .html("Start Timer")
                    .on("click", () => $bpm.val($bpm.val() + 1)))
            .append(
                $("<button>")
                    .html("Stop Timer")
                    .on("click", () => {
                        console.log("stop")
                        timer = null
                }))))