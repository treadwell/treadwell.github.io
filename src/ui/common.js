require("./common.scss")

const $ = require("jquery")

let { 
    
    View,
    mkToolbarButton,
    revealScrollChild,
    mkToolbarBase

} = module.exports = {

    View (
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
    },

    formatTime (s) {
        let m = Math.trunc(s / 60)
        s -= m * 60
        let h = Math.trunc(m / 60)
        m -= h * 60
        const fmt = x =>
            String(x).padStart(2, "0")
        return `${fmt(h)}:${fmt(m)}:${fmt(s)}`
    },

    mkEntry (text, { action, content, scroll, left = [], right = [], data = {} } = {}) {

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
    },

    Tabs (pages) {
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
    },

    mkToolbarBase ({ shadow = true } = {}) {
        return $("<div>")
            .addClass("toolbar " + (
                shadow == "top" ? "toolbar__shadow-top" :
                shadow          ? "toolbar__shadow"     : ""))
    },
    
    mkToolbar ({ text = "", shadow, left = [], right = [] } = {}) {
        return mkToolbarBase({ shadow })
            .append(left.map((opts) =>
                opts.el = mkToolbarButton(opts.icon, opts.action)))
            .append($("<span>")
                .addClass("toolbar--text")
                .append(text))
            .append(right.map((opts) =>
                opts.el = mkToolbarButton(opts.icon, opts.action)))
    },
    
    mkToolbarButton (icon, action) {
    
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
    
    },
    
    mkDivider (text) {
        return $("<div>")
            .addClass("divider")
            .text(text)
    },
    
    revealScrollChild ($scroll, $child) {
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
    },

}
