function Player(asanaSelector) {

    function calcTotalTime () {
        console.log("total time")
    }

    function calcElapsedTime () {
        console.log("elapsed time")
    }

    function calcCurrentAsana () {
        console.log("current asana")
    }

    function calcCurrentStep () {
        console.log("current step")
    }
    
    function play () {
        console.log("play")
    }

    function pause () {
        console.log("pause")
    }

    function reset () {
        console.log("reset")
    }

    return {
        calcTotalTime,
        calcElapsedTime,
        calcCurrentAsana,
        calcCurrentStep,
        play,
        pause,
        reset
    }
}