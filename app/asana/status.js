function Status (player, asanaSelector) {

    const $time =
        $("<span>").text(formatTime(0))

    const $html =
        $("<div>").append(
            $("<div>").append(
                $("<span>")
                    .text("Expected time: "),
                $time),
            $("<div>").append(
                $("<span>")
                    .text("Current asana: "),
                $("<span>")
                    .text("None")))

    function formatTime (t) {
        return new Date(t * 1000)
            .toISOString()
            .substr(11, 8)
    }

    function updateTime() {
        $time.text(formatTime(player.getCycle() *
            asanaSelector.getChosen().reduce((a0, asana) =>
                a0 + asana.steps.reduce((a1, step) =>
                    a1 + step.breaths, 0), 0)))
    }

    asanaSelector.on("change-chosen", updateTime)
    player.on("change-cycle-duration", updateTime)

    return $html
}
