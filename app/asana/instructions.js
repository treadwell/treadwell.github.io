function Instructions(asanaSelector) {
    
    const $html = $("<div>").append(
        $("<div>").append(
            $("<h2>").append("Instructions")))

    function showChosen() {
        asanas = asanaSelector.getChosen()
        console.log(asanas)
    }

    asanaSelector.on("change-chosen", showChosen)

    return $html
}