Promise.all([
    
    fetch("/res/data.json")
        .then(resp => resp.json()),
    
    fetch("/res/sanskrit_numbers.json")
        .then(resp => resp.json()),

    fetch("/res/playlists.json")
        .then(resp => resp.json())

]).then(([asanas, numbers, playlists]) => {

    const storage = Storage()
    const speaker = Speaker(numbers)
    
    window.engine = Engine(asanas, playlists, speaker, storage)
    window.ui = Ui(engine)

})