function Instructions(asanaSelector) {
    
    let $instructions = $("<div>")
            
    const $html = $("<div>").append(
        $("<div>").append(
            $("<h2>").append("Instructions"),
            $instructions))

    function addSteps(asana) {
        return asana["steps"].map(s => 
            $("<tr>").append(
                $("<td>").append(s["count"]),
                $("<td>").append(!s["counted"] ? s["text"] : "Breathe " + s["breaths"] + " times")))
    }

    function showChosen() {
        asanas = asanaSelector.getChosen()  // this is an array of asana objects

        if (asanas[0] === undefined) {
            $instructions.html($("<div>"))
        } else {
            $instructions.html(
                asanas.map(a =>
                    $("<div>").append(
                        $("<h3>").append(a["name"]),
                        $("<table>").append(
                            $("<tr>").append(
                                $("<th>").append("Count"),        // Vinyasa count
                                $("<th>").append("Instruction")  // step text
                            ),
                            addSteps(a)
                        ))))
        }
    }

    asanaSelector.on("change-chosen", showChosen)

    return $html
}