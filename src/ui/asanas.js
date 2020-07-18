const $ = require("jquery")

const { mkEntry } = require("./common.js")

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
    },
    
    mkAsanaSteps (a) {
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

}