const { Asanas } = require("./library/asanas.js")
const { Playlists } = require("./library/playlists.js")

const css = {
    icons: require("./common/icons.scss"),
    common: require("./common.scss"),
}

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
            .addClass(css.common.scrollY)

        $view.view("asanas", true)

        return [
            mkToolbar({
                text: "Library",
                left: [{ icon: "arrow-left", action: onBack }]
            }),
            $tabs,
            $view
        ]
    }

}
