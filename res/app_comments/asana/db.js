function Db (asanas, groups) {

    asanas.sort((a, b) => a.seq - b.seq)

    return {
        asanas,
        groups
    }
}
