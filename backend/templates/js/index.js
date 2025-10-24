let qntAbrirAdmin = 0;
let pagina = window.location.href
let paginaSplit = pagina.split("/")
let paginaRaw = `http://${paginaSplit[2]}`

document.getElementById("btnProsseguir").onclick = function(e) {
    document.getElementById("carregandoTexto").style.display = "block"
    document.getElementById("btnProsseguir").style.display = "none"

    fetch(`${paginaRaw}/api/elevarEtapa`)
        .then(function() {
            location.reload()
        })
}

function abrirAdmin() {
    qntAbrirAdmin++;

    if (qntAbrirAdmin >= 10) {
        qntAbrirAdmin = 0;

        fetch(`${paginaRaw}/api/etapa?atualizarManualmente=8`)
            .then(function() {
                location.reload()
            })
    }
}