// TODO: Validate correct playlist format on save/get
function Storage () {
    
    const playlists = readPlaylists()
    const lastPlaylist = readLastPlaylist()

    function readJSON (key, def) {
        const str = localStorage.getItem(key)
        return str ? JSON.parse(str) : def
    }

    function readPlaylists () {
        return readJSON("playlists", [])
    }

    function readLastPlaylist () {
        return readJSON("last-playlist")
    }

    function writeJSON (key, json) {
        localStorage.setItem(key, JSON.stringify(json))
    }

    function writePlaylists () {
        writeJSON("playlists", playlists)
    }

    function writeLastPlaylist (p) {
        writeJSON("last-playlist", p)
    }

    return {
        savePlaylist (playlist) {
            if (!playlist.id) {
                writeLastPlaylist(playlist)
            } else {
                playlists.push(playlist)
                writePlaylists(playlists)
            }
        },
        deletePlaylist (playlist) {
            const idx = playlists.indexOf(playlist)
            if (!~idx)
                return
            playlists.splice(idx, 1)
            writePlaylists(playlists)
        },
        playlists, 
        lastPlaylist
    }
    
} 