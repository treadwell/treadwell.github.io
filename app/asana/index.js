Engine(engine => window.engine = engine)

Promise.all([
    
    fetch("/app/asana/data.json")
        .then(resp => resp.json()),
    
    fetch("/app/asana/sanskrit_numbers.json")
        .then(resp => resp.json()),

    fetch("/app/asana/groups.json")
        .then(resp => resp.json())

]).then(([asanas, numbers, groups]) => {

    const db = Db(asanas, groups)
    const speaker = Speaker(numbers)
    const asanaSelector = AsanaSelector(db)
    const player = Player(asanaSelector, speaker)
    const instructions = Instructions(asanaSelector)
    const status = Status(player, asanaSelector)

    $(document).ready(() =>
        $(document.body).append(
            $("<h1>").append("Ashtanga Series Builder"),
            asanaSelector,
            status,
            player,
            instructions))

})