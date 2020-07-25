const Storage = require("./engine/storage.js")
const Speaker = require("./engine/speaker.js")
const Engine = require("./engine.js")
const Ui = require("./ui.js")

const asanas = require("../res/data.json")
const numbers = require("../res/sanskrit_numbers.json")
const playlists = require("../res/playlists.json")

const storage = Storage()
const speaker = Speaker(numbers)

window.engine = Engine(asanas, playlists, speaker, storage)
window.ui = Ui(window.engine)
