var t = 10
var timerDisplay = document.getElementById("timer")

function startTimer(seconds) {
    let seg = seconds;
    const timer = setInterval(() => {
        timerDisplay.innerHTML = '00:' + ('0' + seg).slice(-2);
        seg--;
        if (seg < 0) {
            clearInterval(timer);
            window.location.replace("imaginacaoResultado.html")
        }
    }, 1000);
}

startTimer(t)