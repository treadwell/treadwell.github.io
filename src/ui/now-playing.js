const css = {
    icons: require("./common/icons.scss"),
    nowPlaying: require("./now-playing.scss"),
    common: require("./common.scss"),
}

const $ = require("jquery")

const { mkAsanaSteps } = require("./library/asanas.js")

const {

    mkToolbar,
    mkEntry,
    revealScrollChild,
    formatTime,

} = require("./common.js")

module.exports = {

    NowPlaying (engine, { onAdd }) {

        const $instructions = $("<div>")
            .addClass(css.nowPlaying.instructions)
            .append($("<p>")
                .append("Click ")
                .append($("<i>").addClass(`${css.common.iconInline} ${css.icons.fa} ${css.icons["fa-plus"]}`))
                .append(" above to add asanas or playlist from the Library view."))
            .append($("<p>")
                .append("Then, click ")
                .append($("<i>").addClass(`${css.common.iconInline} ${css.icons.fa} ${css.icons["fa-arrow-left"]}`))
                .append(" to return here."))

        const $scroll = $("<div>")
            .addClass(`${css.nowPlaying.nowplaying} ${css.common.scrollY}`)
            .append($instructions)

        engine.on("enqueue", node => {
            node.el = mkEntry(node.asana.name, {
                scroll: $scroll,
                content: mkAsanaSteps(node.asana),
                classes: {
                    main: css.nowPlaying.track
                },
                left: [{
                    action: () => {
                        const ip = engine.isPlaying
                        engine.pause()
                        if (!ip || node != currentNode)
                            engine.play(node)
                    },
                    classes: css.nowPlaying.indicator,
                    el: [
                        $("<i>")
                            .addClass(css.nowPlaying.play)
                            .addClass(`${css.icons.fa} ${css.icons["fa-fw"]} ${css.icons["fa-play"]}`),
                        $("<i>")
                            .addClass(css.nowPlaying.pause)
                            .addClass(`${css.icons.fa} ${css.icons["fa-fw"]} ${css.icons["fa-pause"]}`),
                        $("<i>")
                            .addClass(css.nowPlaying.playing)
                            .addClass(`${css.icons.fa} ${css.icons["fa-fw"]} ${css.icons["fa-volume-up"]}`),
                        $("<i>")
                            .addClass(css.nowPlaying.paused)
                            .addClass(`${css.icons.fa} ${css.icons["fa-fw"]} ${css.icons["fa-volume-off"]}`)
                    ]
                }],
                right: [{
                    icon: "times",
                    classes: css.common.danger,
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
                .removeClass(css.nowPlaying.playing)
            playAction.el.find("i").removeClass(css.icons["fa-pause"])
            playAction.el.find("i").addClass(css.icons["fa-play"])
        })

        engine.on("play", () => {
            $scroll
                .addClass(css.nowPlaying.playing)
            playAction.el.find("i").removeClass(css.icons["fa-play"])
            playAction.el.find("i").addClass(css.icons["fa-pause"])
        })

        engine.on("rewind", () => {
            updateTime()
        })

        engine.on("change-step", () => {
            updateTime()
        })

        engine.on("change-asana", node => {
            if (currentNode) currentNode.el.removeClass(css.nowPlaying.active)
            currentNode = node
            currentNode.el.addClass(css.nowPlaying.active)
            revealScrollChild($scroll, currentNode.el)
        })

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
                    .addClass(css.common.timer),
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

}
