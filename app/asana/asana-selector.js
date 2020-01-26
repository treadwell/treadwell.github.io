function AsanaSelector (db) {

    const $presets =
        $("<select>")
            .prop("multiple", "multiple")
            .css("width", "25%")
            .css("height", "2in")
            .css("user-scalable", "no")
            .append(db.presets.map(preset =>
                $("<option>")
                    .data("preset", preset)
                    .html(preset.name)))
    
    const $groups =
        $("<select>")
            .prop("multiple", "multiple")
            .css("width", "25%")
            .css("height", "2in")
            .css("user-scalable", "no")
            .append(db.groups.map(group =>
                $("<option>")
                    .data("group", group)
                    .html(group.name)))

    const $choices =
        $("<select>")
            .prop("multiple", "multiple")
            .css("width", "25%")
            .css("height", "2in")
            .css("user-scalable", "no")
            .append(db.asanas.map(asana =>
                $("<option>")
                    .data("asana", asana)
                    .html(asana.name)))

    const $chosen =
        $("<select>")
            .prop("multiple", "multiple")
            .css("width", "25%")
            .css("height", "2in")
            .css("user-scalable", "no")

    const $html =
        $("<div>").append(
            $("<h2>").append("Select Asanas"),
            $("<div>").append(
                $presets, 
                $groups,
                $choices,
                $chosen),
            $("<div>").append(
                $("<button>")
                    .html("Add Preset")
                    .on("click", () => addGroup($presets, $chosen, "preset")),
                $("<button>")
                    .html("Add Group")
                    .on("click", () => addGroup($groups, $chosen)),
                $("<button>")
                    .html("Add Individual")
                    .on("click", () => moveSelected($choices, $chosen)),
                $("<button>")
                    .html("Save Preset")
                    .on("click", () => savePreset()),
                $("<button>")
                    .html("Remove")
                    .on("click", () => removeSelected($chosen))))

    function savePreset () { 
        const p = {
            name: prompt("Preset Name:"),
            series: $chosen.find("option").toArray().map(x => $(x).data("asana").id)
        }
        db.addPreset(p)
        $presets.append(
            $("<option>")
                .data("preset", p)
                .html(p.name))
    }

    function addGroup (groups, chosen, prop = "group") {
        
        // extract the id's from selected groups
        ids = []

        groups.find("option")
            .filter(function () {
                return this.selected  // gets selected options
            })
            .toArray()
            .map(x => $(x).data(prop).series
                .map(x => ids.push(x)))  // put ids in an array
  
        // turn into the actual asana
        function find_asana(id, asanas) {
            return asanas.find(a => a.id === id)
        }

        selected_asanas = ids.map(id => find_asana(id, db.asanas))
        // DISCUSS: selected_asanas = db.asanas.filter(x => ids.includes(x.id))
        
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
