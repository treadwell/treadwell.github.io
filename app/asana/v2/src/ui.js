const colors = {
    primary: "#3f51b5",
    light: "#ffffff",
    offlight: "#cccccc"
}

const shadows = {
    card1: "0 1px 3px rgba(0, 0, 0, 0.24), 0 1px 2px rgba(0, 0, 0, 0.24)"
}

function view ($view, $tabs, page) {
    $view.children().detach()
    $view.append(page.view)
    if ($tabs)
        $tabs.activate(page)
}

function Ui(engine) {

    const pages = {
        nowPlaying: {
            view: NowPlaying(engine, () => view($view, null, pages.library))
        },
        library: {
            view: Library(engine, () => view($view, null, pages.nowPlaying))
        }
    }

    const $view = $("<div>")
    const $app = $("<div>")
        .css("border-radius", "3px")
        .css("overflow", "hidden")
        .css("box-shadow", shadows.card1)
        .css("max-width", "26rem")
        .css("max-height", "40rem")
        .css("width", "100%")
        .css("height", "100%")
        .append($view)


    $(document.body).append($app)

    view($view, null, pages.nowPlaying)
}

function NowPlaying(engine, toLibrary) {

    const $nowPlaying = $("<div>")
        .append(mkToolbar("Now Playing", {
            right: [{ icon: "plus", action: toLibrary }]
        }))

    return $nowPlaying
}

function Library(engine, toNowPlaying) {

    const $view = $("<div>")

    const pages = {
        "asanas": {
            name: "Asanas",
            view: Asanas(engine),
            action: () => view($view, $tabs, pages.asanas)
        },
        "playlists": {
            name: "Playlists",
            view: Playlists(engine),
            action: () => view($view, $tabs, pages.playlists)
        }
    }

    const $tabs = mkTabs(pages)

    const $library = $("<div>")
        .append(mkToolbar("Library", {
            shadow: false,
            left: [{ icon: "arrow-left", action: toNowPlaying }]
        }))
        .append($tabs)
        .append($view)

    view($view, $tabs, pages.asanas)

    return $library
}

function Playlists(engine) {

    const $playlists = $("<div>")
        .text("Playlists")

    return $playlists
}

function Asanas(engine) {

    const $asanas = $("<div>")
        .text("Asanas")

    return $asanas
}

function mkToolbarBase({ shadow = true } = {}) {
    return $("<div>")
        .css("display", "flex")
        .css("align-items", "center")
        .css("width", "100%")
        .css("height", "3rem")
        .css("font-size", "1.5rem")
        .css("color", colors.light)
        .css("background", colors.primary)
        .css("box-shadow", shadow ? shadows.card1 : undefined)
}

function mkToolbar(text, { shadow, left = [], right = [] } = {}) {
    return mkToolbarBase({ shadow })
        .append(left.map(({ icon, action }) =>
            mkToolbarButton(icon, action)))
        .append($("<span>")
            .css("margin-left", "1rem")
            .text(text))
        .append($("<span>")
            .css("flex", "1"))
        .append(right.map(({ icon, action }) =>
            mkToolbarButton(icon, action)))
}

function mkTabs(pages) {
    const $tabs = mkToolbarBase()
        .css("justify-content", "stretch")
        .css("align-items", "stretch")
        .css("font-size", "1rem")
        .append([... Object.values(pages)].map(page => {
            const { name, action } = page
            page.$el = $("<div>")
                .css("display", "flex")
                .css("align-items", "center")
                .css("justify-content", "center")
                .css("flex", "1")
                .css("cursor", "pointer")
                .text(name)
                .on("click", action)
            return page.$el
        }))
    $tabs.activate = page => {
        $tabs.children().css("color", colors.offlight)
        page.$el.css("color", colors.light)
    }
    return $tabs
}

function mkToolbarButton(icon, action) {
    return $("<div>")
        .css("padding", "1rem")
        .css("cursor", "pointer")
        .append($("<i>")
            .addClass("fa")
            .addClass("fa-" + icon))
        .on("click", action)
}