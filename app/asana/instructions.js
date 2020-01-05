function Instructions(asanaSelector) {
    
    let $instructions = 
        $("<h3>").append("test")
            
    const $html = $("<div>").append(
        $("<div>").append(
            $("<h2>").append("Instructions"),
            $instructions
            ))

    function showChosen() {
        asanas = asanaSelector.getChosen()  // this is an array of asana objects

        if (asanas[0] === undefined) {
            return 
        } else {
            console.log(asanas[0]["name"])

            $instructions =
                $("<h3>").append("New update happened"
                    // asanas[0]["name"]
                )

            // console.log($instructions)
        }
    }

    // figure out how to rerender instructions.$html via showChosen()
    //     same way that I change the current asana span
    // take first object in array, turn it into a table
    // map through entire array with a series of tables

    asanaSelector.on("change-chosen", showChosen)

    return $html
}