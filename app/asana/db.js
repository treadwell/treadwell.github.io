function Db (asanas, groups) {

    // Validate presets from local storage
    const presets = readPresets()

    asanas.sort((a, b) => a.seq - b.seq)

    function addPreset (p) {
        presets.push(p)
        writePresets(presets)
    }

    function removePreset (p) {
        console.log("presets to remove: ", p)
        const idx = presets.indexOf(p)
        if (!~idx)
            return
        presets.splice(idx, 1)
        writePresets(presets)
    } 

    function writePresets (ps) {
        localStorage.setItem("presets", JSON.stringify(ps))
    }

    function readPresets () {
        const data = JSON.parse(localStorage.getItem("presets"))
        return Array.isArray(data) ? data : []
    }

    return {
        asanas,
        groups,
        presets,
        addPreset,
        removePreset
    }
}
