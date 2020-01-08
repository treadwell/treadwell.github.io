function Instructions(asanaSelector) {
    
    let $instructions = $("<div>")
            
    const $html = $("<div>").append(
        $("<div>").append(
            $("<h2>").append("Instructions"),
            $instructions))

    function addSteps(asana) {
        return asana["steps"].map(s => 
            $("<span class=\"asana_step\">").append(
                $("<span class=\"asana_count\">").append(s["count"]),
                $("<span  class=\"asana_text\">").append(!s["counted"] ? s["text"] : "Breathe " + s["breaths"] + " times")))
    }

    function showChosen() {
        asanas = asanaSelector.getChosen()  // this is an array of asana objects

        if (asanas[0] === undefined) {
            $instructions.html($("<div>"))
        } else {
            $instructions.html(
                asanas.map(a =>
                    $("<div class=\"asana\">").append(
                        $("<h3 class=\"asana_name\">").append(a["name"]),
                        $("<div class=\"asana_steps\">").append(
                            $("<span class=\"asana_step_header\">").append(
                                $("<span class=\"asana_count_header\">").append("Count"),        // Vinyasa count
                                $("<span class=\"asana_text_header\">").append("Instruction")  // step text
                            ),
                            addSteps(a)
                        ))))
        }
    }

    asanaSelector.on("change-chosen", showChosen)

    return $html
}