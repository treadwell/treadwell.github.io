function Status (player, asanaSelector) {

    const $time =
        $("<span>").text(formatTime(0))

    const $currentAsana =
        $("<span>").text("None")

    const $html =
        $("<div>").append(
            $("<div>").append(
                $("<span>")
                    .text("Expected time: "),
                $time),
            $("<div>").append(
                $("<span>")
                    .text("Current asana: "),
                $currentAsana))

    function formatTime (t) {
        return new Date(t * 1000)
            .toISOString()
            .substr(11, 8)
    }

    function updateTime() {
        $time.text(formatTime(player.calcTotalTime()))
    }

    function updateAsana() {
        // $currentAsana.text("None")
        $currentAsana.text(player.getCurrentAsana())
    }

    asanaSelector.on("change-chosen", updateTime)
    player.on("change-cycle-duration", updateTime)
    player.on("change-asana", updateAsana)

    return $html
}
