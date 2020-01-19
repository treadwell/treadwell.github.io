function AsanaSelector (db) {

    const $groups =
        $("<select>")
            .prop("multiple", "multiple")
            .css("width", "25%")
            .css("height", "2in")
            .append(db.groups.map(group =>
                // COMMENT: This exact construction has been repeated a few times,
                // perhaps we can factor out a 'makeOption(..)' function. See [1]
                // at the end of the file.
                //
                // makeOption("group", group, group.name)
                //
                $("<option>")
                    .data("group", group)
                    .html(group.name)))

    const $choices =
        $("<select>")
            .prop("multiple", "multiple")
            .css("width", "25%")
            .css("height", "2in")
            .append(db.asanas.map(asana =>
                // COMMENT: This exact construction has been repeated a few times,
                // perhaps we can factor out a 'makeOption(..)' function. See [1]
                // at the end of the file.
                //
                // makeOption("asana", asana, asana.name)
                //
                //
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
                    .on("click", () => removeSelected($chosen))))

    function addGroup (groups, chosen, asanas) {

        // extract the id's from selected groups
        ids = []

        // COMMMENT: Really nice job with this logic!
        //
        groups.find("option")
            .filter(function () {
                return this.selected  // gets selected options
            })
            .toArray()
            // COMMENT: That dangling ')' can be brought up to the end of the
            // ids.push((x)) line
            //
            .map(x => $(x).data("group").series
                .map(x => ids.push(x))  // put ids in an array
            )

        // COMMENT: This can be removed. See the next comment
        //
        // turn into the actual asana
        function find_asana(id, asanas) {
            return asanas.find(a => a.id === id)
        }

        // COMMMENT: This can be written as follows to avoid the need to define
        // find_asana above:
        //   selected_asanas = db.asanas.filter(x => ids.includes(x.id))
        // QUESTION: This only gets the first asana, where there can be duplicates
        //
        selected_asanas = ids.map(id => find_asana(id, db.asanas))

        // rebuild the options
        chosen.append(selected_asanas.map(asana =>
            // COMMENT: This exact construction has been repeated a few times,
            // perhaps we can factor out a 'makeOption(..)' function. See [1]
            // at the end of the file.
            //
            // makeOption("asana", asana, asana.name)
            //
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

    $html.removeAll = function () {
        $chosen.find("option").remove()
        $html.trigger("change-chosen")
    }

    function moveSelected (a, b) {
        a.find("option").filter(function () {
            return this.selected
        }).clone(true).appendTo(b)
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

// [1]: We can factor out the option creation with some function like this:
//
//   function makeOption(dataKey, dataVal, text) {
//      return $("<option>")
//          .data(dataKey, dataVal)
//          .text(text)
//   }
