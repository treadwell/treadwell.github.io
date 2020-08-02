const $ = require("jquery")

const css = {
    icons: require("../common/icons.scss"),
    common: require("../common.scss"),
}

const {

    mkEntry,
    mkDivider

} = require("../common.js")

module.exports = {

    Playlists (engine) {

        const playlistElements = new Map()

        function mkEntryPlaylist (p) {
            return mkEntry(p.name, {
                action: () => engine.enqueue(engine.getSavedPlaylist(p.name)),
                right: [{
                    icon: "times",
                    action: () => engine.deletePlaylist(p.name),
                    classes: css.common.danger
                }]
            })
        }

        let savedPlaylists = null

        const elements = [
            mkDivider("Saved Playlists"),
            savedPlaylists = $("<div>")
                .append(engine.savedPlaylists.map(p => {
                    const entry = mkEntryPlaylist(p)
                    playlistElements.set(p.name, entry)
                    return entry
                })),
            mkDivider("Default Playlists"),
            $("<div>")
                .append(engine.defaultPlaylists.map(p => mkEntry(p.name, {
                    action: () => engine.enqueue(p)
                })))
        ]

        engine.on("playlist-saved", (p, isUpdate) => {
            if (!isUpdate) {
                const newEntry = mkEntryPlaylist(p)
                savedPlaylists.append(newEntry)
                playlistElements.set(p.name, newEntry)
            }

        })

        engine.on("playlist-deleted", name => {
            playlistElements.get(name).remove()
            playlistElements.delete(name)
        })

        return elements

    }

}
