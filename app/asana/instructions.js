function Instructions(asanaSelector) {
    
    const $html = $("<div>").append(
        $("<div>").append(
            $("<h2>").append("Instructions"),
            $("<p>").append(showChosen)
            ))

    function showChosen() {
        asanas = asanaSelector.getChosen()
        if (asanas[0] === undefined) {
            return 
        } else {
            console.log(asanas[0]["name"])
        }
        // return asanas.map(a => a.name)
    }

    asanaSelector.on("change-chosen", showChosen)

    return $html
}