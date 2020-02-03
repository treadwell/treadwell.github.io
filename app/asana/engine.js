function Engine (callback) {
    Promise.all([
    
        fetch("/app/asana/data.json")
            .then(resp => resp.json()),
        
        fetch("/app/asana/sanskrit_numbers.json")
            .then(resp => resp.json()),
    
        fetch("/app/asana/groups.json")
            .then(resp => resp.json())
    
    ]).then(([asanas, numbers, groups]) => callback(
        {"asanas": asanas,
    "numbers": numbers,
    "groups" : groups
}))
    



}