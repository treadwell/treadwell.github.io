const msg = false

const promise = new Promise( (resolve, reject) => {
    if (msg) {
        setTimeout( () => resolve('resolved promise'), 2000)
    } else {
        setTimeout( () => reject('rejected promise'), 2000)
    }
})

// there should be error handling implicit in this.  I'm 
// using else to short-circuit error handling.

promise.then( 
    (data) => console.log(data),  // success condition
    (data) => console.log(data)   // implicit error condition
)