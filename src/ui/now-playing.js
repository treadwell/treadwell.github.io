require("./now-playing.scss")

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

}