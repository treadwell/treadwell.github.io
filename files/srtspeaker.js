function initdictation() {
    return "SpeechSynthesisUtterance"in window ? (utt = new SpeechSynthesisUtterance,
    !0) : !1
}
function removeOptions(e) {
    var t;
    for (t = e.options.length - 1; t >= 0; t--)
        e.remove(t)
}
function fillselvoices() {
    var e = speechSynthesis.getVoices();
    removeOptions(selvoices);
    for (var t = 0; t < e.length; t++) {
        var n = document.createElement("option");
        n.text = e[t].name,
        selvoices.add(n)
    }
    selvoices.selectedIndex = 2
}
function nextind(e) {
    writetime(),
    writelog("end of the sentence"),
    sind++,
    speaksent()
}
function speaksent() {
    return sind >= sents.length ? (writetime(),
    writelog("end of the subtitle"),
    void (utt.onend = null)) : (utt.text = sents[sind],
    utt.onend = nextind,
    writetime(),
    writelog("Start of the " + (sind + 1) + " sentence"),
    speechSynthesis.speak(utt),
    void 0)
}
function speakelem() {
    speechSynthesis.speaking ? logerror("the subtitle " + (arindex + 1) + " will not processed (TTS is busy)") : (sents = strar[arindex].match(/[^\.!\?]+[\.!\?]+/g),
    null === sents && (sents = [strar[arindex]]),
    sind = 0,
    writetime(),
    writelog("Start of the subtitle " + (arindex + 1)),
    speaksent()),
    arindex++,
    nextar()
}
function nextar() {
    timear.length != arindex && (startind > 0 && startind == arindex + 1 ? speakelem() : timerid = setTimeout(speakelem, timear[arindex]))
}
function speakme() {
    txterror.value = "",
    txtlog.value = "",
    stopme(),
    srttometka();
    var e = speechSynthesis.getVoices();
    utt.voice = e.filter(function(e) {
        return e.name == selvoices.options[selvoices.selectedIndex].value
    })[0],
    document.getElementById("txtfrom").value ? (arindex = document.getElementById("txtfrom").value - 1,
    startind = arindex + 1,
    start_time = Date.now() - timestart[arindex]) : (arindex = 0,
    startind = 0,
    start_time = Date.now()),
    writelog("Start"),
    nextar()
}
function stopme() {
    timerid && (clearTimeout(timerid),
    timerid = 0),
    utt.onend = null,
    speechSynthesis.speaking && speechSynthesis.cancel()
}
function srttometka() {
    function e(e, n, s, i, o, a) {
        var l = "";
        return n != c && (l = n + "###" + i,
        t = strtotime(n) - r,
        timear[timear.length] = t,
        r = strtotime(n),
        strar[strar.length] = i,
        timestart[timestart.length] = r),
        l
    }
    timear = new Array,
    strar = new Array,
    timestart = new Array;
    var t, n = document.domain, r = 0, s = /[0-9]+(?:\s)*([0-9][0-9]:[0-9][0-9]:[0-9][0-9],[0-9][0-9][0-9])\s-->\s([0-9][0-9]:[0-9][0-9]:[0-9][0-9],[0-9][0-9][0-9])(?:.*)(?:[\r\n]|[\n])((?:.+(?:[\r\n]|[\n]))+)(?:[\r\n]|[\n])/m, i = getdocel(), o = i.value + "\n\n", a = "", l = o.length, c = "00:00:00,000";
    for (-1 == n.indexOf("speech") && n.indexOf("voice") && (o = "00:00:00,000"); a != l; )
        a = l,
        o = o.replace(s, e),
        l = o.length;
    writelog("Processed " + timear.length + " subtitles")
}
function getdocel() {
    return txtspeak
}
function strtotime(e) {
    var t = /:|,/
      , n = e.split(t)
      , r = 0;
    return r = 3600 * parseInt(n[0]) * 1e3,
    r += 60 * parseInt(n[1]) * 1e3,
    r += 1e3 * parseInt(n[2]),
    r += parseInt(n[3])
}
function msectotime(e) {
    var t = Math.floor(e % 1e3);
    e = (e - t) / 1e3;
    var n = Math.floor(e / 3600)
      , r = e % 3600
      , s = Math.floor(r / 60)
      , i = r % 60
      , o = Math.floor(i)
      , a = (10 > n ? "0" + n : n) + ":" + (10 > s ? "0" + s : s) + ":" + (10 > o ? "0" + o : o) + "," + (10 > t ? "00" + t : 100 > t ? "0" + t : t);
    return a
}
function logerror(e) {
    txterror.value = txterror.value + e + "\n"
}
function writelog(e) {
    txtlog.value = txtlog.value + e + "\n"
}
function writetime() {
    var e = Date.now() - start_time;
    txtlog.value = txtlog.value + msectotime(e) + " "
}
function selall() {
    txtspeak.select()
}
function toggleme() {
    isred() ? (stopme(),
    setrecbtn(0)) : (speakme(),
    setrecbtn(1))
}
function isred() {
    return "orange" == btnspeak.style.backgroundColor ? !0 : !1
}
function setrecbtn(e) {
    1 == e ? (btnspeak.style.backgroundColor = "orange",
    btnspeak.value = otklzap) : (btnspeak.style.backgroundColor = "",
    btnspeak.value = vklzap)
}
var txtspeak, utt, selvoices, btnspeak, timerid, txterror, txtlog, plainstr = "", timear, strar, arindex, sents, sentsind, start_time, timestart, startind, otklzap = "Stop", vklzap = "Start";
window.onload = function() {
    txtspeak = document.getElementById("txtspeak"),
    selvoices = document.getElementById("selvoices"),
    btnspeak = document.getElementById("btnspeak"),
    txterror = document.getElementById("txterror"),
    txtlog = document.getElementById("txtlog"),
    initdictation() ? (fillselvoices(),
    setTimeout(fillselvoices, 3e3)) : btnspeak.disabled = !0
}
;
