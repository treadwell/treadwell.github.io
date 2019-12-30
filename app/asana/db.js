function Db (asanas, groups) {

    asanas.sort((a, b) => a.seq - b.seq)

    function addGroup (id, name, idx_array) {
        groups.push({
            id: id,
            name: name,
            series: idx_array
        })
    }

    return {
        asanas,
        groups
    }
}
