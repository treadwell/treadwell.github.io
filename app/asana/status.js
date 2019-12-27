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
        $time.text(formatTime(player.calcTotalTime()))
    }

    asanaSelector.on("change-chosen", updateTime)
    player.on("change-cycle-duration", updateTime)

    return $html
}
