function Db (text) {
    const $xml = $($.parseXML(text))
    return {
        $xml,
        getAsanas() {
            return $xml.find("asanas > asana").toArray().map(x => ({
                id: $(x).attr("id"),
                name: $(x).attr("name"),
                steps: $(x).find("step").toArray().map(y => ({
                    count: $(y).attr("count"),
                    breaths: $(y).attr("breaths"),
                    text: $(y).text(),
                }))
            }))
        }
    }
}

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
            return $el = $("<span>").html(time)
        }
    }
}

function AsanaSelector (db) {
    let options = $("<select>")
        .prop("id", "options")
        .prop("multiple", "multiple")
        .css("width", "40%")
        .append(db.getAsanas().map(asana => 
            $("<option>")
                .html(asana.name)))
    let selected = $("<select>")
        .prop("id", "selected")
        .prop("multiple", "multiple")
        .css("width", "40%")
    return {
        select() {
            let toMove = options.find("option").filter(function () {
                return this.selected
            })
            options.remove(toMove)
            selected.append(toMove)
        },
        deselect() {
            let toMove = selected.find("option").filter(function () {
                return this.selected
            })
            selected.remove(toMove)
            options.append(toMove)
        },
        render() {
            return $("<div>").append(options, selected)
        }
    }
}

fetch("/app/asana/data.xml")
    .then(resp => resp.text())
    .then(text => Db(text))
    .then(db => 

        $(document).ready(() => {

            console.log(db.getAsanas())

            let timeDisplay = TimeDisplay()
            let asanaSelector = AsanaSelector(db)

            $(document.body).append(
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
                    asanaSelector.render(),
                    $("<div>").append(
                        $("<button>")
                            .html("<-")
                            .on("click", () => asanaSelector.deselect()),
                        $("<button>")
                            .html("->")
                            .on("click", () => asanaSelector.select()))),
                $("<div>").append(
                    "Expected time: ",
                    timeDisplay.render()),
                $("<div>").append("Current asana: None"))

    }))