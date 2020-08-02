const css = {
    icons: require("../common/icons.scss"),
    asanas: require("./asanas.scss"),
}

const $ = require("jquery")

const { mkEntry } = require("../common.js")

const {

    mkAsanaSteps

} = module.exports = {

    Asanas (engine) {

        const asanaCounts = new Map()
        const displayedAsanas = new Map()

        function mkEntryAsana (a) {
            return mkEntry(a.name, {
                action: () => engine.enqueue(a),
                scroll: "parent",
                content: mkAsanaSteps(a),
                right: [{
                    el: $("<span>")
                        .addClass(`${css.asanas.count} ` + (asanaCounts.get(a) ? css.asanas.nonzero : ""))
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
    },

    mkAsanaSteps (a) {
        return $("<div>")
            .addClass(css.asanas.steps)
            .append(a.steps.map(s => $("<div>")
                .addClass(css.asanas.step)
                .append([
                    s.counted
                        ? $("<i>")
                            .addClass(`${css.asanas.icon} ${css.icons.fa} ${css.icons["fa-sync"]}`)
                        : $("<span>")
                            .addClass(css.asanas.count)
                            .text(s.count),
                    $("<span>")
                        .text(s.counted
                            ? `Breathe ${s.breaths} times`
                            : s.text)
                ])))
    }

}
