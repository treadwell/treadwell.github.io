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

    const $subview = $("<div>")

    const $library = $("<div>")
        .text("Library")
        .on("click", toNowPlaying)
        .append($subview)

    const asanas = Asanas(engine, () => subview("playlists"))
    const playlists = Playlists(engine, () => subview("asanas"))

    
    function subview (sv) {
        $subview.children().detach()
        $subview.append({
            "asanas": asanas,
            "playlists": playlists
        }[sv])
    }

    // $($library).append($subview)

    subview("asanas")


    return () => $library
}

function Playlists (engine, toAsanas) {

    const $playlists = $("<div>")
        .text("Playlists")
        .on("click", toAsanas)

    return () => $playlists
}

function Asanas (engine, toPlaylists) {

    const $asanas = $("<div>")
        .text("Asanas")
        .on("click", toPlaylists)

    return () => $asanas
}