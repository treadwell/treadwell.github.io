function AsanaSelector (db) {

    const $presets =
        mkSelect()
            .append(db.presets.map(preset =>
                mkOption("preset", preset, preset.name)))
    
    const $groups =
        mkSelect()
            .append(db.groups.map(group =>
                mkOption("group", group, group.name)))

    const $choices =
        mkSelect()
            .append(db.asanas.map(asana =>
                mkOption("asana", asana, asana.name)))

    const $chosen =
        mkSelect()

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
                    .html("Add Preset to Playlist")
                    .on("click", () => addGroup($presets, $chosen, "preset")),
                $("<button>")
                    .html("Save Preset")
                    .on("click", () => savePreset()),
                $("<button>")
                    .html("Delete Preset")
                    .on("click", () => removePreset()),
                $("<button>")
                    .html("Add Group to Playlist")
                    .on("click", () => addGroup($groups, $chosen, "group")),
                $("<button>")
                    .html("Add Posture to Playlist")
                    .on("click", () => moveSelected($choices, $chosen)),
                $("<button>")
                    .html("Remove from Playlist")
                    .on("click", () => removeSelected($chosen))))

    function savePreset () { 
        const p = {
            name: prompt("Preset Name:"),
            series: $chosen.find("option").toArray().map(x => $(x).data("asana").id)
        }
        db.addPreset(p)
        $presets.append(
            mkOption("preset", p, p.name))
    }

    function addGroup (groups, chosen, dataAttributeName) {
        
        // extract the id's from selected groups
        const ids = []

        groups.find("option")
            .filter(function () {
                return this.selected  // gets selected options
            })
            .toArray()
            .map(x => $(x).data(dataAttributeName).series
                .map(x => ids.push(x)))  // put ids in an array
  
        const selected_asanas = ids.map(id => db.asanas.find(a => a.id == id))

        // rebuild the options
        chosen.append(selected_asanas.map(asana =>
            mkOption("asana", asana, asana.name)))

        $html.trigger("change-chosen")
    }

    function removePreset () {
        $presets.find("option")  // gets selected options
            .filter(function () {
                return this.selected 
            })
            .each(function () {
                db.removePreset($(this).data("preset"))
            })  
            .remove()
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

    function mkOption (dataAttributeName, dataAttributeValue, html) {
        return $("<option>")
            .data(dataAttributeName, dataAttributeValue)
            .html(html)
    }

    function mkSelect () {
        return $("<select>")
            .prop("multiple", "multiple")
            .css("width", "25%")
            .css("height", "2in")
            .css("user-scalable", "no")
    }

    return $html
}
