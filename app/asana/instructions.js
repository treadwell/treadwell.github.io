function Instructions(asanaSelector) {
    
    let $instructions = $("<div>")
            
    const $html = $("<div>").append(
        $("<div>").append(
            $("<h2>").append("Instructions"),
            $instructions
            ))

    function addSteps(asana) {
        return asana["steps"].map(s => 
            $("<tr>").append(
                $("<td>").append(s["count"]),
                $("<td>").append(s["breaths"]),
                $("<td>").append(s["text"])
            ))
    }

    function showChosen() {
        asanas = asanaSelector.getChosen()  // this is an array of asana objects

        if (asanas[0] === undefined) {
            $instructions.html($("<div>"))
        } else {
            console.log(asanas[0]["name"])
            console.log(asanas[0])

            $instructions.html(
                asanas.map(a =>
                    $("<div>").append(
                        $("<h3>").append(a["name"]),
                        $("<table>").append(
                            $("<tr>").append(
                                $("<th>").append("Count"),        // Vinyasa count
                                $("<th>").append("Breath"),       // will be inhale or exhale or nBR
                                $("<th>").append("Instruction")  // step text
                            ),
                            addSteps(a)
                        )
                    )
                    
                ))
        }
    }

    // figure out how to rerender instructions.$html via showChosen()
    //     same way that I change the current asana span
    // take first object in array, turn it into a table
    // map through entire array with a series of tables

    asanaSelector.on("change-chosen", showChosen)

    return $html
}