Promise.all([
    
    fetch("/app/asana/data.json")
        .then(resp => resp.json()),
    
    fetch("/app/asana/sanskrit_numbers.json")
        .then(resp => resp.json())

]).then(([asanas, numbers]) => {

    const db = Db(asanas)
    const speaker = Speaker(numbers)
    const asanaSelector = AsanaSelector(db)
    const player = Player(asanaSelector, speaker)
    const status = Status(player, asanaSelector)

    $(document).ready(() =>
        $(document.body).append(
            $("<h1>").append("Ashtanga Series Builder"),
            player,
            asanaSelector,
            status))

})