fetch("/app/asana/data.json")
    .then(resp => resp.json())
    .then(json => Db(json))
    .then(db =>

        $(document).ready(() => {

            const controls = Controls()
            const asanaSelector = AsanaSelector(db)
            const status = Status(controls, asanaSelector)

            $(document.body).append(
                $("<h1>").append("Ashtanga Series Builder"),
                controls.$html,
                asanaSelector.$html,
                status.$html
            )

    }))