function View (
    pages, 
    $tabs, 
    $view = $("<div>")
        .addClass("view")) 
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

    const $view = View(pages, null, $app)  // pages and $tabs

    $(document.body).append($view)

    $view.view("nowPlaying", true)
}

function NowPlaying (engine, { onAdd }) {

    const $scroll = $("<div>")
        .addClass("nowplaying scroll-y")

    engine.on("enqueue", node => {
        node.el = mkEntry(node.asana.name, {
            right: [{
                icon: "minus",
                classes: "danger",
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
                action: [{
                    text: "Clear", 
                    action: () => engine.reset()
                }, {
                    text: "Save playlist",
                    action: () => alert("Save playlist!")
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
        .addClass("scroll-y")

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
                    .addClass("entry--asana-count " + (asanaCounts.get(a) ? "entry--asana-count__nonzero" : ""))
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
        .append(right.map(({ action, el, icon, classes = "" }) => 
            icon 
                ? $("<i>")
                    .addClass(`fa fa-fw fa-${icon} ${classes} entry--action ` + (action ? "entry--action__action" : ""))
                    .on("click", action)
                : el
                    .addClass("entry--action")))
}

function Tabs (pages) {
    const $tabs = mkToolbarBase()
        .addClass("tabs")
        .append([... Object.values(pages)].map(page => {
            const { tabTitle, action } = page
            page.$el = $("<div>")
                .addClass("tabs--tab")
                .text(tabTitle)
                .on("click", action)
            return page.$el
        }))
    $tabs.activate = page => {
        $tabs.children()
            .addClass("tabs--tab__inactive")
            .removeClass("tabs--tab__active")
        page.$el
            .addClass("tabs--tab__active")
            .removeClass("tabs--tab__inactive")
    }
    return $tabs
}

function mkToolbarBase ({ shadow = true } = {}) {
    return $("<div>")
        .addClass("toolbar " + (shadow ? "toolbar__shadow" : ""))
}

function mkToolbar (text, { shadow, left = [], right = [] } = {}) {
    return mkToolbarBase({ shadow })
        .append(left.map(({ icon, action }) =>
            mkToolbarButton(icon, action)))
        .append($("<span>")
            .addClass("toolbar--text")
            .text(text))
        .append(right.map(({ icon, action }) =>
            mkToolbarButton(icon, action)))
}

function mkToolbarButton (icon, action) {
    
    const $button = $("<div>")
        .addClass("toolbar--button")
        .append($("<i>")
            .addClass("fa fa-fw fa-" + icon))

    if (Array.isArray(action)) {

        const $dropdown = $("<div>")
            .addClass("dropdown")
            .append(action.map(({ text, action }) => $("<div>")
                .addClass("dropdown--action")
                .text(text)
                .on("click", ev => {
                    action()
                    $(ev.target.parentNode)
                        .removeClass("dropdown__active")
                })))

        $button
            .append($dropdown)
            .on("click", () => $dropdown
                .addClass("dropdown__active"))

    } else {
        $button.on("click", action)
    }
    
     return $button

}