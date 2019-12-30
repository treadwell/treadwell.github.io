function Db (asanas, groups) {
    return {
        asanas: asanas.sort((a, b) => a.seq - b.seq),
        groups: groups
    }
}
