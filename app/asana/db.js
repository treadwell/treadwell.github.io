function Db (asanas) {
    return {
        asanas: asanas.sort((a, b) => a.seq - b.seq),
    }
}
