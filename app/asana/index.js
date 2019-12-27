fetch("/app/asana/data.json")
    .then(resp => resp.json())
    .then(json => {
 
        const db = Db(json)
        const asanaSelector = AsanaSelector(db)
        const player = Player(asanaSelector)
        const status = Status(player, asanaSelector)

        $(document).ready(() =>
            $(document.body).append(
                $("<h1>").append("Ashtanga Series Builder"),
                player,
                asanaSelector,
                status))

    })