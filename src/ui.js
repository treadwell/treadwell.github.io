require("./ui.scss")

const { NowPlaying } = require("./ui/now-playing.js")
const { Library } = require("./ui/library.js")
const { View } = require("./ui/common.js")

const $ = require("jquery")

module.exports = function (engine) {

    const pages = {
        nowPlaying: {
            view: NowPlaying(engine, {
                onAdd: () => $view.view("library")
            })
        },
        library: {
            view: Library(engine, {
                onBack: () => $view.view("nowPlaying")
            })
        },
    }

    const $app = $("<div>")
        .addClass("app")

    const $view = View(pages, null, $app)  // pages and $tabs

    $(document.body).append($view)

    $view.view("nowPlaying", true)

    engine.init()
}
