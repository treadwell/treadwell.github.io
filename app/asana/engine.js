function Engine (callback) {

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
    function enqueue () {
        console.log("enqueue not implemented")
    }
    function dequeue () {
        console.log("dequeue not implemented")
    }
    function savePlaylist () {
        console.log("savePlaylist not implemented")
    }
    function deletePlaylist () {
        console.log("deletePlaylist not implemented")
    }

    const currentAsana = null
    const currentStep = null
    const enqueuedAsanas = []
    const totalTime = null
    const remainingTime = null
    const playlists = []

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