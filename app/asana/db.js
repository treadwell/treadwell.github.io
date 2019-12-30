function Db (asanas, groups) {

    asanas.sort((a, b) => a.seq - b.seq)

    function addGroup (id, name, idx_array) {
        groups.push({
            id: id,
            name: name,
            series: idx_array
        })
    }

    addGroup ("testGroup", "Test Group", ["suryA", "suryB", "aaaTest"])
  
    console.log(groups[0])
    console.log(groups[groups.length - 1])

    return {
        asanas,
        groups,
        addGroup

    }
}
