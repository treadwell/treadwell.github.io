// TODO: Validate correct playlist format on save/get
module.exports = function () {
    
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
        savePlaylist (playlist, name) {
            let isUpdate = false
            if (!name) {
                writeLastPlaylist(playlist)
            } else {
                playlist.name = name
                const idx = playlists.findIndex(p => p.name == name)
                if (~idx) {
                    isUpdate = true
                    playlists[idx] = playlist
                } else {
                    playlists.push(playlist)
                }
                writePlaylists(playlists)
            }
            return isUpdate
        },
        deletePlaylist (playlist) {
            const idx = playlists.indexOf(playlist)
            if (!~idx)
                return
            playlists.splice(idx, 1)
            writePlaylists(playlists)
        },
        getPlaylist (name) {
            return playlists.find(p => p.name == name)
        },
        playlists, 
        lastPlaylist
    }
    
} 