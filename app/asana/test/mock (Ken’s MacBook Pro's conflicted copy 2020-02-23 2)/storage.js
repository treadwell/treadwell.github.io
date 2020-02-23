module.exports = function Storage () {
    const playlists = []
    return {
        savePlaylist (playlist) {
            playlists.push(playlist)
        },
        deletePlaylist (playlist) {
            const idx = playlists.indexOf(playlist)
            if (!~idx)
                return
            playlists.splice(idx, 1)
        },
        playlists,
    }
}
