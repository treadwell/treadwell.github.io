function Db (json) {
    json = json.sort((a, b) => a.seq - b.seq)
    return {
        getAsanas() {
            return json
        }
    }
}

function AsanaSelector (db) {

    let choices = 
        $("<select>")
            .prop("multiple", "multiple")
            .css("width", "40%")
            .append(db.getAsanas().map(asana => 
                $("<option>")
                    .data("asana", asana)
                    .html(asana.name)))
    
    let chosen = 
        $("<select>")
            .prop("multiple", "multiple")
            .css("width", "40%")

    const hooks = []

    function getChosen() {
        return chosen
            .find("option")
            .toArray()
            .map(x => $(x).data("asana"))
    }

    function moveSelected(a, b) {
        a.find("option").filter(function () {
            return this.selected
        }).appendTo(b)
        b.find("option")
            .sort((x, y) => $(x).data("asana").seq - $(y).data("asana").seq)
            .appendTo(b)
        hooks.forEach(fn =>
            fn(getChosen()))
    }

    const self = {
        getChosen: getChosen,
        onUpdate(fn) {
            hooks.push(fn)
        },
        render() {
            return $("<div>").append(
                $("<div>").append(
                    choices, 
                    chosen),
                $("<div>").append(
                    $("<button>")
                        .html("<-")
                        .on("click", () => moveSelected(chosen, choices)),
                    $("<button>")
                        .html("->")
                        .on("click", () => moveSelected(choices, chosen))))
        }
    }

    return self
}

function Controls() {

    const $cycle = $("<input>")
        .prop("type", "number")
        .prop("id", "secPerBreath")
        .prop("value", 6)
        .on("input", () => hooks.forEach(fn => fn(getCycle())))

    function getCycle() {
        return +$cycle.val()
    }

    const hooks = []

    return {
        onUpdate(fn) {
            hooks.push(fn)
        },
        getCycle: getCycle,
        render() {
            return $("<div>").append(
                $("<div>").append(
                    "Seconds per breath cycle: ",
                    $cycle),
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
                        .on("click", () => console.log("Reset"))))
        }
    }
}

function Status (controls, asanaSelector) {

    let currentAsana = null

    function formatTime (t) {
        return new Date(t * 1000)
            .toISOString()
            .substr(11, 8)
    }

    const $time = $("<span>")
        .text(formatTime(0))

    const self = {
        render() {
            return $("<div>").append(
                $("<div>").append(
                    $("<span>")
                        .text("Expected time: "),
                    $time),
                $("<div>").append(
                    $("<span>")
                        .text("Current asana: "),
                    $("<span>")
                        .text(currentAsana ? currentAsana.name : "None")))
        }
    }

    function updateTime(cycle, chosen) { 
        $time.text(formatTime(cycle *
            chosen.reduce((a0, asana) => 
                a0 + asana.steps.reduce((a1, step) => 
                    a1 + step.breaths, 0), 0)))
    }

    asanaSelector.onUpdate(chosen => 
        updateTime(controls.getCycle(), chosen))

    controls.onUpdate(cycle => 
        updateTime(cycle, asanaSelector.getChosen()))

    return self
}

fetch("/app/asana/data.json")
    .then(resp => resp.json())
    .then(json => Db(json))
    .then(db => 

        $(document).ready(() => {

            let controls = Controls()
            let asanaSelector = AsanaSelector(db)
            let status = Status(controls, asanaSelector)

            $(document.body).append(
                $("<h1>").append("Ashtanga Series Builder"),
                controls.render(),
                asanaSelector.render(),
                status.render())

    }))