function AsanaSelector (db) {

    const $choices =
        $("<select>")
            .prop("multiple", "multiple")
            .css("width", "40%")
            .css("height", "2in")
            .append(db.asanas.map(asana =>
                $("<option>")
                    .data("asana", asana)
                    .html(asana.name)))

    const $chosen =
        $("<select>")
            .prop("multiple", "multiple")
            .css("width", "40%")
            .css("height", "2in")

    const $html =
        $("<div>").append(
            $("<div>").append(
                $choices,
                $chosen),
            $("<div>").append(
                $("<button>")
                    .html("Add")
                    .on("click", () => moveSelected($choices, $chosen)),
                $("<button>")
                    .html("Remove")
                    .on("click", () => removeSelected($chosen))
                    ))

    function removeSelected (a) {
        a.find("option").filter(function () {
            return this.selected
        }).remove()
        $html.trigger("change-chosen")
    }

    function moveSelected (a, b) {
        a.find("option").filter(function () {
            return this.selected
        }).clone(true).appendTo(b)
        b.find("option")
            .sort((x, y) => $(x).data("asana").seq - $(y).data("asana").seq)
            .appendTo(b)
        $html.trigger("change-chosen")
    }

    $html.getChosen = function () {
        return $chosen
            .find("option")
            .toArray()
            .map(x => $(x).data("asana"))
    }

    return $html
}
