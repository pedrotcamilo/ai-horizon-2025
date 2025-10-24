var t = 10
var timerDisplay = document.getElementById("timer")

let pagina = window.location.href
let paginaSplit = pagina.split("/")
let paginaRaw = `http://${paginaSplit[2]}`

function startTimer(seconds) {
    let seg = seconds;
    const timer = setInterval(() => {
        timerDisplay.innerHTML = '00:' + ('0' + seg).slice(-2);
        seg--;
        if (seg < 0) {
            clearInterval(timer);
            fetch(`${paginaRaw}/api/etapa?atualizarManualmente=4`)
                .then(function() {
                    location.reload()
                })
        }
    }, 1000);
}

startTimer(t)