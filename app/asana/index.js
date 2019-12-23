$(document).ready(() => 
    fetch("/app/asanas/data.xml").then(data => {
        const $data = $.parseXML($("#data").html())
        console.log($data)
        let timeDisplay = TimeDisplay()
        $(document.body).prepend(
            $("<h1>").append("Ashtanga Series Builder"),
            $("<div>").append(
                "Seconds per breath cycle: ",
                $("<input>")
                    .prop("type", "number")
                    .prop("id", "secPerBreath")
                    .prop("value", 6)),
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
                    .on("click", () => console.log("Reset")),),
            $("<div>").append(
                $("<div>").append(
                    $("<select>")
                        .prop("id", "options")
                        .prop("multiple", "multiple")
                        .css("width", "40%"),
                    $("<select>")
                        .prop("id", "selected")
                        .prop("multiple", "multiple")
                        .css("width", "40%")),
                $("<div>").append(
                    $("<button>")
                        .html("<-")
                        .on("click", () => console.log("Remove asanas")),
                    $("<button>")
                        .html("->")
                        .on("click", () => console.log("Add asanas")))),
            $("<div>").append(
                "Expected time: ",
                timeDisplay.render()),
            $("<div>").append("Current asana: None"))

    function TimeDisplay () {
        let seconds = 0
        let $el = null
        let self = null
        return self = {
            update(s) {
                seconds = s
                $el.replaceWith(self.render())
            },
            render() {
                const time = new Date(seconds * 1000)
                    .toISOString()
                    .substr(11, 8)
                return $el = $("<span>")
                .html(time)
            }
        }
    }
}))