fetch("/app/asana/data.json")
    .then(resp => resp.json())
    .then(json => {
 
        const db = Db(json)
        const asanaSelector = AsanaSelector(db)
        const player = Player(asanaSelector)
        const controls = Controls(player)
        const status = Status(player)

        $(document).ready(() =>
            $(document.body).append(
                $("<h1>").append("Ashtanga Series Builder"),
                controls.$html,
                asanaSelector.$html,
                status.$html))

    })