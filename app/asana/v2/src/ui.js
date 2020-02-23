function Ui (engine) {

    const nowPlaying = NowPlaying(engine, () => view("library"))
    const library = Library(engine, () => view("now-playing"))

    const $view = $("<div>")
    const $app = $("<div>").attr("id", "app").append($view)
    
    function view (v) {
        $view.children().detach()
        $view.append({
            "now-playing": nowPlaying,
            "library": library
        }[v])
    }

    $(document.body).append($app)

    view("now-playing")

}

function NowPlaying (engine, toLibrary) {

    const $nowPlaying = $("<div>")
        .text("Now Playing")
        .on("click", toLibrary)

    return () => $nowPlaying
}

function Library (engine, toNowPlaying) {

    const $library = $("<div>")
        .text("Library")
        .on("click", toNowPlaying)

    return () => $library
}