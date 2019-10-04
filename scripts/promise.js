const promise = new Promise(function(resolve, reject) {
    setTimeout(function() {
        resolve('resolved promise');
    }, 2000);
});

promise.then(function(data) {
    console.log(data);
});