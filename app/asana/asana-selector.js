function AsanaSelector (db) {

    const $groups =
        $("<select>")
            .prop("multiple", "multiple")
            .css("width", "25%")
            .css("height", "2in")
            .append(db.groups.map(group =>
                $("<option>")
                    .data("group", group)
                    .html(group.name)))

    const $choices =
        $("<select>")
            .prop("multiple", "multiple")
            .css("width", "25%")
            .css("height", "2in")
            .append(db.asanas.map(asana =>
                $("<option>")
                    .data("asana", asana)
                    .html(asana.name)))

    const $chosen =
        $("<select>")
            .prop("multiple", "multiple")
            .css("width", "25%")
            .css("height", "2in")

    const $html =
        $("<div>").append(
            $("<h2>").append("Select Asanas"),
            $("<div>").append(
                $groups,
                $choices,
                $chosen),
            $("<div>").append(
                $("<button>")
                    .html("Add Group")
                    .on("click", () => addGroup($groups, $chosen, db.asanas)),
                $("<button>")
                    .html("Add Individual")
                    .on("click", () => moveSelected($choices, $chosen)),
                $("<button>")
                    .html("Remove")
                    .on("click", () => removeSelected($chosen))
                    ))

    function addGroup (groups, chosen, asanas) {
        
        // extract the id's from selected groups
        ids = []

        groups.find("option")
            .filter(function () {
                return this.selected})  // gets selected options
            .toArray()
            .map(x => $(x).data("group").series
                .map(x => ids.push(x))  // put ids in an array
            )
  
        // turn into the actual asana
        function find_asana(id, asanas) {
            return asanas.find(a => a.id === id)
        }

        selected_asanas = ids.map(id => find_asana(id, db.asanas))
        
        // rebuild the options
        chosen.append(selected_asanas.map(asana =>
            $("<option>")
                .data("asana", asana)
                .html(asana.name)))

        $html.trigger("change-chosen")
    }

    function removeSelected (a) {
        a.find("option").filter(function () {
            return this.selected
        }).remove()
        $html.trigger("change-chosen")
    }

    function removeAll () {
        console.log("asanaSelector.removeAll")
    }

    function moveSelected (a, b) {
        a.find("option").filter(function () {
            return this.selected
        }).clone(true).appendTo(b)
        // b.find("option")
        //     .sort((x, y) => $(x).data("asana").seq - $(y).data("asana").seq)
        //     .appendTo(b)
        $html.trigger("change-chosen")
    }

    $html.getChosen = function () {
        return $chosen
            .find("option")
            .toArray()
            .map(x => $(x).data("asana"))
    }

    // player.on("reset", removeAll)

    return $html
}
