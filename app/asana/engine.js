function Engine (callback) {

    const asanas = []
    const currentAsana = null
    const currentStep = null
    const enqueuedAsanas = []
    const totalTime = null
    const remainingTime = null
    const playlists = []

    function play () {
        console.log("play not implemented")
    }

    function pause () {
        console.log("pause not implemented")
    }

    function reset () {
        console.log("reset not implemented")
    }

    function rewind () {
        console.log("rewind not implemented")
    }

    function enqueue (id, asanas, groups) {
        // add individual asana or playlist / group to enqueuedAsanas
        // input: id, (group, stored playlist or asana)
        // output: enqueuedAsanas
        // "window.engine.enqueue("suryA", window.engine.asanas, window.engine.groups)" in console
        // "window.engine.enqueue("shortest", window.engine.asanas, window.engine.groups)"

        // if id in asanas:  add it
        if (asanas.map(a => a.id).includes(id)) {
            enqueuedAsanas.push(asanas.find(a => a.id == id))
            console.log("asana added")
        }
        
        // if id in groups:  add them
        if (groups.map(g => g.id).includes(id)) {
            // get the group with the id
            groups.find(g => g.id == id).series  // ids
                .map(id => asanas.find(a => a.id == id)) // asanas
                .map(a => enqueuedAsanas.push(a))  // add to enqueuedAsanas

            console.log("group added")
        }

        // if name in stored playlists, add them (not inmplemented)

        console.log(id, enqueuedAsanas)
 
        return enqueuedAsanas
    }

    function dequeue (idx) {
        // remove individual asana from enqueuedAsanas by index
        // input: single id
        // output: enqueuedAsanas
        if (!~idx)
            return enqueuedAsanas
            console.log("Index not found")
        enqueuedAsanas.splice(idx, 1)
        return enqueuedAsanas
    }

    function savePlaylist () {
        console.log("savePlaylist not implemented")
    }

    function deletePlaylist () {
        console.log("deletePlaylist not implemented")
    }

    Promise.all([
    
        fetch("/app/asana/data.json")
            .then(resp => resp.json()),
        
        fetch("/app/asana/sanskrit_numbers.json")
            .then(resp => resp.json()),
    
        fetch("/app/asana/groups.json")
            .then(resp => resp.json())
    
    ]).then(([asanas, numbers, groups]) => callback({
        "asanas": asanas,
        "numbers": numbers,
        "groups" : groups,
        "playlist": enqueuedAsanas,
        play,
        pause,
        reset,
        rewind,
        enqueue,
        dequeue,
        savePlaylist,
        deletePlaylist
        }))
}