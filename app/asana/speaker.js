function Speaker (numbers) {

    function speak (count, text) {
        thing.speak(count)
        if (text)
            thing.onend = () => 
                thing.speak(text)
    }

    return { speak }

}