const colors = {
    primary: "#3f51b5",
    light: "#ffffff",
    offlight: "#cccccc",
    highlight: "rgba(0, 0, 0, 0.1)",
    danger: "#f44336"
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
        // .css("display", "flex")
        // .css("flex-direction", "column")
        // .css("border-radius", "3px")
        // .css("overflow", "hidden")
        // .css("box-shadow", shadows.card1)
        // .css("max-width", "26rem")
        // .css("max-height", "40rem")
        // .css("width", "100%")
        // .css("height", "100%")

    const $view = View(pages, null, $app)  // pages and $tabs

    $(document.body).append($view)

    $view.view("nowPlaying", true)
}

function NowPlaying (engine, { onAdd }) {

    const $scroll = $("<div>")
        .addClass("nowplaying--scroll")
        // .css("display", "flex")
        // .css("flex-direction", "column")
        // .css("overflow-y", "scroll")

    engine.on("enqueue", node => {
        node.el = mkEntry(node.asana.name, {
            right: [{
                icon: "minus",
                color: colors.danger,
                action: () => engine.dequeue(node)
            }]
        })
        $scroll.append(node.el)
    })

    engine.on("dequeue", node => {
        node.el.remove()
    })

    engine.on("reset", () => {
        $scroll.children().remove()
    })

    return [
        mkToolbar("Now Playing", {
            right: [{ 
                icon: "plus", 
                action: onAdd 
            }, { 
                icon: "ellipsis-v", 
                dropdown: [{
                    text: "Clear", 
                    action: () => engine.reset()
                }] 
            }]
        }),
        $scroll
    ]
}

function Library (engine, { onBack }) {

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
        .addClass("view")
        // .css("overflow-y", "scroll")

    $view.view("asanas", true)

    return [
        mkToolbar("Library", {
            shadow: false,
            left: [{ icon: "arrow-left", action: onBack }]
        }),
        $tabs,
        $view
    ]
}

function Playlists (engine) {
    return engine.playlists.map(p => 
        mkEntry(p.name, {
            action: () => engine.enqueue(p),
        }))
}

function Asanas (engine) {

    const asanaCounts = new Map()
    const displayedAsanas = new Map()

    function mkEntryAsana (a) {
        return mkEntry(a.name, {
            action: () => engine.enqueue(a),
            right: [{
                el: $("<span>")
                    .addClass("entry--el")
                    // .css("padding", "1rem")
                    // .css("color", colors.primary)
                    .text(asanaCounts.get(a) || 0)
            }]
        })
    }

    function setCount (asana, diff) {

        // Update count
        let c = asanaCounts.get(asana) || 0
        c = diff ? c + diff : 0

        if (c) 
            asanaCounts.set(asana, c)
        else
            asanaCounts.delete(asana)

        // Update DOM
        const ent = displayedAsanas.get(asana)
        const nent = mkEntryAsana(asana)

        // NOTE: since ent.replaceWith(nent) doesn't work for detached nodes, 
        // we have to replace the contents of ent with the contents of nent. As 
        // a result, changes to properties, classes, etc. will not be changed. 
        ent.children().remove()
        ent.append(nent.contents())
    }
   
    engine.on("enqueue", node => setCount(node.asana, 1)) 
    engine.on("dequeue", node => setCount(node.asana, -1))
    
    engine.on("reset", () => {
        for (const asana of asanaCounts.keys())
            setCount(asana, 0)
        asanaCounts.clear()
    })

    return engine.asanas.map(a => {
        const ent = mkEntryAsana(a)
        displayedAsanas.set(a, ent)
        return ent
    })
}

function mkEntry (text, { action, right = [], data = {} } = {}) {
    return $("<div>")
        .addClass("entry")
        .data(data)
        .append($("<div>")
            .addClass("entry--main " + (action ? "entry--main__action" : ""))
            .on("click", action)
            .text(text))
        .append(right.map(({ action, el, icon, color }) => 
            icon 
                ? $("<i>")
                    .addClass(`fa fa-${icon} entry--action ` + (action ? "entry--action__action" : ""))
                    .on("click", action)
                : el))
}

function Tabs (pages) {
    const $tabs = mkToolbarBase()
        .addClass("tab")
        // .css("justify-content", "stretch")
        // .css("align-items", "stretch")
        // .css("font-size", "1rem")
        .append([... Object.values(pages)].map(page => {
            const { tabTitle, action } = page
            page.$el = $("<div>")
                .addClass("tab--el")
                // .css("display", "flex")
                // .css("align-items", "center")
                // .css("justify-content", "center")
                // .css("flex", "1")
                // .css("cursor", "pointer")
                .text(tabTitle)
                .on("click", action)
            return page.$el
        }))
    $tabs.activate = page => {
        $tabs.children()
            .addClass("tab__inactive")
            .removeClass("tab__active")
        page.$el
            .addClass("tab__active")
            .removeClass("tab__inactive")
    }
    return $tabs
}

function mkToolbarBase ({ shadow = true } = {}) {
    return $("<div>")
        .addClass("toolbar--base")
        // .css("display", "flex")
        // .css("align-items", "center")
        // .css("flex-shrink", "0")
        // .css("width", "100%")
        // .css("height", "3rem")
        // .css("font-size", "1.5rem")
        // .css("color", colors.light)
        // .css("background", colors.primary)
        .css("box-shadow", shadow ? shadows.card1 : undefined)
}

function mkToolbar (text, { shadow, left = [], right = [] } = {}) {
    return mkToolbarBase({ shadow })
        .append(left.map(({ icon, action }) =>
            mkToolbarButton(icon, action)))
        .append($("<span>")
            .addClass("toolbar--spacerleft")
            .text(text))
        .append($("<span>")
            .addClass("toolbar--spacerright"))
        .append(right.map(({ icon, action }) =>
            mkToolbarButton(icon, action)))
}

function mkToolbarButton (icon, action) {
    return $("<div>")
        .addClass("toolbar--button")
        // .css("padding", "1rem")
        // .css("cursor", "pointer")
        .append($("<i>")
            .addClass("fa")
            .addClass("fa-" + icon))
        .on("click", action)
}