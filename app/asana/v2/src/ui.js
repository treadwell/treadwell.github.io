const colors = {
    primary: "#3f51b5",
    light: "#ffffff",
    offlight: "#cccccc",
    highlight: "rgba(0, 0, 0, 0.1)"
}

const shadows = {
    card1: "0 1px 3px rgba(0, 0, 0, 0.24), 0 1px 2px rgba(0, 0, 0, 0.24)"
}

function View (
    pages, 
    $tabs, 
    $view = $("<div>")
        .css("display", "flex")
        .css("flex-direction", "column")) 
{
    View.nextId = (View.nextId || 0) + 1

    $view.id = View.nextId

    $view.view = (requestedPageKey, tryLocal) => {
        const storageKey = `view-${$view.id}` // The actual key in local storage
        const pageKey = (tryLocal && localStorage.getItem(storageKey)) || requestedPageKey
        localStorage.setItem(storageKey, pageKey)
        $view.children().detach()
        $view.append(pages[pageKey].view)
        if ($tabs)
            $tabs.activate(pages[pageKey])
    }

    return $view
}

function Ui (engine) {

    const pages = {
        nowPlaying: {
            view: NowPlaying(engine, () => $view.view("library"))
        },
        library: {
            view: Library(engine, () => $view.view("nowPlaying"))
        },
    }

    const $app = $("<div>")
        .css("display", "flex")
        .css("flex-direction", "column")
        .css("border-radius", "3px")
        .css("overflow", "hidden")
        .css("box-shadow", shadows.card1)
        .css("max-width", "26rem")
        .css("max-height", "40rem")
        .css("width", "100%")
        .css("height", "100%")

    const $view = View(pages, null, $app)  // pages and $tabs

    $(document.body).append($view)

    $view.view("nowPlaying", true)
}

function NowPlaying (engine, toLibrary) {

    const $nowPlaying = $("<div>")
        .append(mkToolbar("Now Playing", {
            right: [{ icon: "plus", action: toLibrary }]
        }))
        .append($("<div>").text("List Queue"))

        console.log(engine.queue)

        engine.queue.map(a => console.log(a.name))

    return $nowPlaying
}

function Library (engine, toNowPlaying) {

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
        .css("overflow-y", "scroll")

    $view.view("asanas", true)

    return [
        mkToolbar("Library", {
            shadow: false,
            left: [{ icon: "arrow-left", action: toNowPlaying }]
        }),
        $tabs,
        $view
    ]
}

function Playlists (engine) {
    function mkEntry (p) {
        return $("<div>")
            .css("display", "flex")
            .css("padding" , "1rem")
            .css("cursor", "pointer")
            .css("border-bottom", `1px solid ${colors.highlight}`)
            .on("click", engine.enqueue(p))
            .append($("<span>").text(p.name))
            .append($("<span>").css("flex", "1"))
            .append($("<span>"))
    }
    return engine.playlists.map(p => 
        mkEntry(p))
}

function Asanas (engine) {
    function mkEntry (a) {
        return $("<div>")
            .css("display", "flex")
            .css("padding" , "1rem")
            .css("cursor", "pointer")
            .css("border-bottom", `1px solid ${colors.highlight}`)
            .on("click", ev => {
                engine.enqueue(a)
                $(ev.currentTarget).replaceWith(mkEntry(a))
            })
            .append($("<span>").text(a.name))
            .append($("<span>").css("flex", "1"))
            .append($("<span>")
                .css("color", colors.primary)
                .text(engine.queue.filter(x => x == a).length))
    }
    return engine.asanas.map(a => 
        mkEntry(a))
}

function Tabs (pages) {
    const $tabs = mkToolbarBase()
        .css("justify-content", "stretch")
        .css("align-items", "stretch")
        .css("font-size", "1rem")
        .append([... Object.values(pages)].map(page => {
            const { tabTitle, action } = page
            page.$el = $("<div>")
                .css("display", "flex")
                .css("align-items", "center")
                .css("justify-content", "center")
                .css("flex", "1")
                .css("cursor", "pointer")
                .text(tabTitle)
                .on("click", action)
            return page.$el
        }))
    $tabs.activate = page => {
        $tabs.children().css("color", colors.offlight)
        page.$el.css("color", colors.light)
    }
    return $tabs
}

function mkToolbarBase ({ shadow = true } = {}) {
    return $("<div>")
        .css("display", "flex")
        .css("align-items", "center")
        .css("flex-shrink", "0")
        .css("width", "100%")
        .css("height", "3rem")
        .css("font-size", "1.5rem")
        .css("color", colors.light)
        .css("background", colors.primary)
        .css("box-shadow", shadow ? shadows.card1 : undefined)
}

function mkToolbar (text, { shadow, left = [], right = [] } = {}) {
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

function mkToolbarButton (icon, action) {
    return $("<div>")
        .css("padding", "1rem")
        .css("cursor", "pointer")
        .append($("<i>")
            .addClass("fa")
            .addClass("fa-" + icon))
        .on("click", action)
}