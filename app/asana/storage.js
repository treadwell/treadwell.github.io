// TODO: Validate correct playlist format on save/get
function Storage () {
    
    const playlists = readPlaylists()

    function readPlaylists () {
        const strPlaylists = localStorage.getItem("playlists")
        return strPlaylists ? JSON.parse(strPlaylists) : []
    }

    function writePlaylists () {
        localStorage.setItem("playists", JSON.stringify(playlists))
    }

    return {
        savePlaylist (playlist) {
            playlists.push(playlist)
            writePlaylists()
        },
        deletePlaylist (playlist) {
            const idx = playlists.indexOf(playlist)
            if (!~idx)
                return
            playlists.splice(idx, 1)
            writePlaylists()
        },
        playlists, 
    }
    
}