function AsanaSelector (db) {

    const hooks = []

    const $choices =
        $("<select>")
            .prop("multiple", "multiple")
            .css("width", "40%")
            .append(db.asanas.map(asana =>
                $("<option>")
                    .data("asana", asana)
                    .html(asana.name)))

    const $chosen =
        $("<select>")
            .prop("multiple", "multiple")
            .css("width", "40%")

    const $html =
        $("<div>").append(
            $("<div>").append(
                $choices,
                $chosen),
            $("<div>").append(
                $("<button>")
                    .html("<-")
                    .on("click", () => moveSelected($chosen, $choices)),
                $("<button>")
                    .html("->")
                    .on("click", () => moveSelected($choices, $chosen))))

    function moveSelected (a, b) {
        a.find("option").filter(function () {
            return this.selected
        }).appendTo(b)
        b.find("option")
            .sort((x, y) => $(x).data("asana").seq - $(y).data("asana").seq)
            .appendTo(b)
        hooks.forEach(fn => fn())
    }

    function getChosen () {
        return $chosen
            .find("option")
            .toArray()
            .map(x => $(x).data("asana"))
    }

    function registerChangeCallback (fn) {
        hooks.push(fn)
    }

    return {
        $html,
        getChosen,
        registerChangeCallback
    }

}
