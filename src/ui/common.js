const css = {
    dropdown: require("./common/dropdown.scss"),
    entry: require("./common/entry.scss"),
    tabs: require("./common/tabs.scss"),
    icons: require("./common/icons.scss"),
    common: require("./common.scss"),
}

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
            .addClass(css.common.view))
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

    mkEntry (text, {

        action,
        classes: {
            main: classMain = "",
            header: classHeader = ""
        } = {},
        content,
        scroll,
        left = [],
        right = [],
        data = {}

    } = {}) {

        function renderAction ({ action, el, icon, classes = "" }) {
            if (action && el)
                el.on("click", action)
            return icon
                ? $("<i>")
                    .addClass(`${css.icons.fa} ${css.icons["fa-fw"]} ${css.icons["fa-" + icon]} ${classes} ${css.entry.action} ${action ? css.entry.clickable : ""}`)
                    .on("click", action)
                : el
                    .addClass(css.entry.action)
        }

        const $entry = $("<div>")
            .addClass(`${css.entry.main} ${classMain}`)
            .data(data)
            .append($("<div>")
                .addClass(`${css.entry.header} ${classHeader}`)
                .append(left.map(o => renderAction(o)))
                .append($("<div>")
                    .addClass(`${css.entry.text} ${action ? css.entry.clickable : ""}`)
                    .on("click", action)
                    .text(text))
                .append(!content ? [] : mkToolbarButton("chevron-down", ev => {
                    const $ent = $(ev.target)
                        .closest(`.${css.entry.main}`)
                    $ent.toggleClass(css.entry.open)
                    if (scroll)
                        setTimeout(() =>
                            revealScrollChild(scroll == "parent"
                                ? $ent.parent()
                                : scroll, $ent))
                }).addClass(css.entry.opener))
                .append(right.map(o => renderAction(o))))
            .append(!content ? [] : content
                .addClass(css.entry.content))

        return $entry
    },

    Tabs (pages) {
        const $tabs = mkToolbarBase()
            .addClass(css.tabs.main)
            .append([... Object.values(pages)].map(page => {
                const { tabTitle, action } = page
                page.$el = $("<div>")
                    .addClass(css.tabs.tab)
                    .text(tabTitle)
                    .on("click", action)
                return page.$el
            }))
        $tabs.activate = page => {
            $tabs.children()
                .removeClass(css.tabs.active)
            page.$el
                .addClass(css.tabs.active)
        }
        return $tabs
    },

    mkToolbarBase ({ shadow = true } = {}) {
        return $("<div>")
            .addClass(`${css.common.toolbar} ` + (
                shadow == "top" ? css.common.shadowTop :
                shadow          ? css.common.shadow    : ""))
    },

    mkToolbar ({ text = "", shadow, left = [], right = [] } = {}) {
        return mkToolbarBase({ shadow })
            .append(left.map((opts) =>
                opts.el = mkToolbarButton(opts.icon, opts.action)))
            .append($("<span>")
                .addClass(css.common.text)
                .append(text))
            .append(right.map((opts) =>
                opts.el = mkToolbarButton(opts.icon, opts.action)))
    },

    mkToolbarButton (icon, action) {

        const $button = $("<div>")
            .addClass(css.common.button)
            .append($("<i>")
            .addClass(`${css.icons.fa} ${css.icons["fa-fw"]} ${css.icons["fa-" + icon]}`))

        if (Array.isArray(action)) {

            const $dropdown = $("<div>")
                .addClass(css.dropdown.main)
                .append($("<div>")
                    .addClass(css.dropdown.actions)
                    .append(action.map(({ text, action }) => $("<div>")
                        .addClass(css.dropdown.action)
                        .text(text)
                        .on("click", ev => {
                            ev.stopPropagation()
                            action()
                            $dropdown
                                .removeClass(css.dropdown.active)
                        }))))
                .on("click", ev => {
                    ev.stopPropagation()
                    $dropdown
                        .removeClass(css.dropdown.active)
                })

            $button
                .append($dropdown)
                .on("click", () => $dropdown
                    .addClass(css.dropdown.active))

        } else {
            $button.on("click", action)
        }

         return $button

    },

    mkDivider (text) {
        return $("<div>")
            .addClass(css.common.divider)
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
