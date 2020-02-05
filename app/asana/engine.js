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

    function enqueue (id, asanas) {
        // add individual asana or playlist / group to enqueuedAsanas
        // input: id, (group, stored playlist or asana)
        // output: enqueuedAsanas
        // execute via:  "window.engine.enqueue("suryA", window.engine.asanas)" in console
        
        // if id in asanas:  add it
        enqueuedAsanas.push(asanas.find(a => a.id == id))
        
        // if id in groups:  add them

        // if name in stored playlists  add them

        console.log(id, asana, enqueuedAsanas)
 
        return enqueuedAsanas
    }

    function dequeue () {
        // remove individual asana from enqueuedAsanas
        // input: single id
        // output: enqueuedAsanas
        // if id in asanas:
        console.log("dequeue not implemented")
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