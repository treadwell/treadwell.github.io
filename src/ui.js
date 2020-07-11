require("../node_modules/font-awesome/css/font-awesome.min.css")
require("../node_modules/font-awesome/fonts/fontawesome-webfont.woff")
require("../node_modules/font-awesome/fonts/fontawesome-webfont.woff2")
require("../node_modules/font-awesome/fonts/fontawesome-webfont.eot")
require("../node_modules/font-awesome/fonts/fontawesome-webfont.ttf")
require("../node_modules/font-awesome/fonts/fontawesome-webfont.svg")
require("./ui.css")

const $ = require("jquery")

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

function NowPlaying (engine, { onAdd }) {

    const $instructions = $("<div>")
        .addClass("instructions")
        .append($("<p>")
            .append("Click ")
            .append($("<i>").addClass("icon-inline fa fa-plus"))
            .append(" above to add asanas or playlist from the Library view."))
        .append($("<p>")
            .append("Then, click ")
            .append($("<i>").addClass("icon-inline fa fa-arrow-left"))
            .append(" to return here."))

    const $scroll = $("<div>")
        .addClass("nowplaying scroll-y")
        .append($instructions)

    engine.on("enqueue", node => {
        node.el = mkEntry(node.asana.name, {
            scroll: $scroll,
            content: mkAsanaSteps(node.asana),
            left: [{
                action: () => {
                    const ip = engine.isPlaying
                    engine.pause()
                    if (!ip || node != currentNode)
                        engine.play(node)
                },
                el: $("<span>")
                    .addClass("entry-nowplaying--indicator")
                    .append([
                        $("<i>")
                            .addClass("entry-nowplaying--indicator--play")
                            .addClass("fa fa-fw fa-play"),
                        $("<i>")
                            .addClass("entry-nowplaying--indicator--pause")
                            .addClass("fa fa-fw fa-pause"),
                        $("<i>")
                            .addClass("entry-nowplaying--indicator--playing")
                            .addClass("fa fa-fw fa-volume-up"),
                        $("<i>")
                            .addClass("entry-nowplaying--indicator--paused")
                            .addClass("fa fa-fw fa-volume-off")
                    ])
                
            }],
            right: [{
                icon: "times",
                classes: "danger",
                action: () => engine.dequeue(node)
            }]
        })
        $scroll.append(node.el)
        updateTime()
    })

    engine.on("dequeue", node => {
        if (currentNode == node) {
            currentNode = null
            engine.pause()
        }
        node.el.remove()
        setTimeout(() => {
            updateTime()
        }, 0)
    })

    engine.on("reset", () => {
        $instructions.siblings().remove()
        updateTime()
    })

    let playAction = null
    let timeDisplay = null
    let currentNode = null
    let activePlaylistName = ""

    engine.on("pause", () => {
        $scroll
            .removeClass("nowplaying__playing")
        playAction.el.find("i").removeClass("fa-pause")
        playAction.el.find("i").addClass("fa-play")
    })

    engine.on("play", () => {
        $scroll
            .addClass("nowplaying__playing")
        playAction.el.find("i").removeClass("fa-play")
        playAction.el.find("i").addClass("fa-pause")
    })  

    engine.on("rewind", () => {
        updateTime()
    })

    engine.on("change-step", () => {
        updateTime()
    })

    engine.on("change-asana", node => {
        if (currentNode) currentNode.el.removeClass("entry-nowplaying__active")
        currentNode = node
        currentNode.el.addClass("entry-nowplaying__active")
        revealScrollChild($scroll, currentNode.el)
    })

    function formatTime (s) {
        let m = Math.trunc(s / 60)
        s -= m * 60
        let h = Math.trunc(m / 60)
        m -= h * 60
        const fmt = x => 
            String(x).padStart(2, "0")
        return `${fmt(h)}:${fmt(m)}:${fmt(s)}`
    }

    function updateTime () {
        const rem = formatTime(engine.calcTimeRemaining())
        const tot = formatTime(engine.calcTimeTotal())
        timeDisplay.text(`${rem} / ${tot}`)
    }

    requestAnimationFrame(() => 
        updateTime())

    return [
        mkToolbar({
            text: "Now Playing",
            right: [
                {
                    icon: "plus",
                    action: onAdd
                },
                {
                    icon: "ellipsis-v",
                    action: [
                        {
                            text: "Clear",
                            action: () => engine.reset()
                        },
                        {
                            text: "Save playlist",
                            action: () => {
                                activePlaylistName = prompt("Name of Playlist?", activePlaylistName)
                                engine.savePlaylist(activePlaylistName)
                            }
                        }
                    ]
                }
            ]
        }),
        $scroll,
        mkToolbar({
            shadow: "top",
            text: timeDisplay = $("<span>")
                .addClass("toolbar--timer"),
            left: [
                {
                    icon: "chevron-left",
                    action: () => engine.prev()
                },
                playAction = {
                    icon: "play",
                    action: () => {
                        if (engine.isPlaying)
                            engine.pause()
                        else
                            engine.play()
                    },
                },
                {
                    icon: "chevron-right",
                    action: () => engine.next()
                }
            ],
            right: [
                {
                    icon: "stop",
                    action: () => engine.rewind()
                }
            ]
        })
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
        mkToolbar({
            text: "Library",
            shadow: false,
            left: [{ icon: "arrow-left", action: onBack }]
        }),
        $tabs,
        $view
    ]
}

function Playlists (engine) {
    const playlistElements = new Map()
    function mkEntryPlaylist (p) {
        return mkEntry(p.name, {
            action: () => engine.enqueue(engine.getSavedPlaylist(p.name)),
            right: [{
                icon: "times",
                action: () => engine.deletePlaylist(p.name),
                classes: "danger"
            }]
        })
    }
    let savedPlaylists = null
    const elements = [
        mkDivider("Saved Playlists"),
        savedPlaylists = $("<div>")
            .append(engine.savedPlaylists.map(p => {
                const entry = mkEntryPlaylist(p)
                playlistElements.set(p.name, entry)
                return entry
            })),
        mkDivider("Default Playlists"),
        $("<div>")
            .append(engine.defaultPlaylists.map(p => mkEntry(p.name, {
                action: () => engine.enqueue(p)
            })))
    ]
    engine.on("playlist-saved", (p, isUpdate) => {
        if (!isUpdate) {
            const newEntry = mkEntryPlaylist(p)
            savedPlaylists.append(newEntry) 
            playlistElements.set(p.name, newEntry)
        }
        
    })
    engine.on("playlist-deleted", name => {
        playlistElements.get(name).remove()
        playlistElements.delete(name)
    })
    return elements
}

function Asanas (engine) {

    const asanaCounts = new Map()
    const displayedAsanas = new Map()

    function mkEntryAsana (a) {
        return mkEntry(a.name, {
            action: () => engine.enqueue(a),
            scroll: "parent",
            content: mkAsanaSteps(a),
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

function mkEntry (text, { action, content, scroll, left = [], right = [], data = {} } = {}) {
    
    function renderAction ({ action, el, icon, classes = "" }) {
        if (action && el)
            el.on("click", action)
        return icon 
            ? $("<i>")
                .addClass(`fa fa-fw fa-${icon} ${classes} entry--action ` + (action ? "entry--action__action" : ""))
                .on("click", action)
            : el
                .addClass("entry--action")
    }

    const $entry = $("<div>")
        .addClass("entry")
        .data(data)
        .append($("<div>")
            .addClass("entry--main")
            .append(left.map(o => renderAction(o)))
            .append($("<div>")
                .addClass("entry--text " + (action ? "entry--text__action" : ""))
                .on("click", action)
                .text(text))
            .append(!content ? [] : mkToolbarButton("chevron-down", ev => {
                const $ent = $(ev.target)
                    .closest(".entry")
                $ent.toggleClass("entry__open")
                if (scroll)
                    setTimeout(() =>
                        revealScrollChild(scroll == "parent"
                            ? $ent.parent()
                            : scroll, $ent))
            }).addClass("entry--open"))
            .append(right.map(o => renderAction(o))))
        .append(!content ? [] : content
            .addClass("entry--content"))

    return $entry
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

function mkAsanaSteps (a) {
    return $("<div>")
        .addClass("entry-asana--steps")
        .append(a.steps.map(s => $("<div>")
            .addClass("entry-asana--step")
            .append([
                s.counted 
                    ? $("<i>")
                        .addClass("entry-asana--step--icon fa fa-refresh")
                    : $("<span>")
                        .addClass("entry-asana--step--count")
                        .text(s.count),
                $("<span>")
                    .addClass("entry-asana--step-text")
                    .text(s.counted
                        ? `Breathe ${s.breaths} times`
                        : s.text)
            ])))
}

function mkToolbarBase ({ shadow = true } = {}) {
    return $("<div>")
        .addClass("toolbar " + (
            shadow == "top" ? "toolbar__shadow-top" : 
            shadow          ? "toolbar__shadow"     : ""))
}

function mkToolbar ({ text = "", shadow, left = [], right = [] } = {}) {
    return mkToolbarBase({ shadow })
        .append(left.map((opts) =>
            opts.el = mkToolbarButton(opts.icon, opts.action)))
        .append($("<span>")
            .addClass("toolbar--text")
            .append(text))
        .append(right.map((opts) =>
            opts.el = mkToolbarButton(opts.icon, opts.action)))
}

function mkToolbarButton (icon, action) {
    
    const $button = $("<div>")
        .addClass("toolbar--button")
        .append($("<i>")
            .addClass("fa fa-fw fa-" + icon))

    if (Array.isArray(action)) {

        const $dropdown = $("<div>")
            .addClass("dropdown")
            .append($("<div>")
                .addClass("dropdown--actions")
                .append(action.map(({ text, action }) => $("<div>")
                    .addClass("dropdown--action")
                    .text(text)
                    .on("click", ev => {
                        ev.stopPropagation()
                        action()
                        $dropdown
                            .removeClass("dropdown__active")
                    }))))
            .on("click", ev => {
                ev.stopPropagation()
                $dropdown
                    .removeClass("dropdown__active")
            })

        $button
            .append($dropdown)
            .on("click", () => $dropdown
                .addClass("dropdown__active"))

    } else {
        $button.on("click", action)
    }
    
     return $button

}

function mkDivider (text) {
    return $("<div>")
        .addClass("divider")
        .text(text)
}

function revealScrollChild ($scroll, $child) {
    const scrollHeight = $scroll[0].offsetHeight
    const scrollTop = $scroll.scrollTop()
    const scrollBottom = scrollTop + scrollHeight
    const elHeight = $child[0].offsetHeight
    const elTop = $child[0].offsetTop
    const elBottom = elTop + elHeight
    let newScrollTop = scrollTop
    if (elHeight > scrollHeight)
        newScrollTop = elTop
    else if (elTop < scrollTop)
        newScrollTop = scrollTop - (scrollTop - elTop)
    else if (elBottom > scrollBottom)
        newScrollTop = scrollTop + (elBottom - scrollBottom)
    $scroll.animate({
        scrollTop: newScrollTop
    }, 250)
}