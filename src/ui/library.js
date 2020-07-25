const { Asanas } = require("./library/asanas.js")
const { Playlists } = require("./library/playlists.js")

const {

    Tabs,
    View,
    mkToolbar

} = require("./common.js")

module.exports = {

    Library (engine, { onBack }) {

        const pages = {
            asanas: {
                tabTitle: "Asanas",
                view: Asanas(engine),
                action: () => $view.view("asanas")
            },
            playlists: {
                tabTitle: "Playlists",
                view: Playlists(engine),
                action: () => $view.view("playlists")
            }
        }

        const $tabs = Tabs(pages)
        const $view = View(pages, $tabs)
            .addClass("scroll-y")

        $view.view("asanas", true)

        return [
            mkToolbar({
                text: "Library",
                shadow: false,
                left: [{ icon: "arrow-left", action: onBack }]
            }),
            $tabs,
            $view
        ]
    }

}
