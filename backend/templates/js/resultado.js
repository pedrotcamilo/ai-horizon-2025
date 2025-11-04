let pagina = window.location.href
let paginaSplit = pagina.split("/")
let paginaRaw = `http://${paginaSplit[2]}`

document.getElementById("btnVoltar").onclick = function () {
    fetch(`${paginaRaw}/api/etapa?atualizarManualmente=0`)
        .then(function() {
            location.reload()
        })
}

fetch(`${paginaRaw}/api/url_imagem`)
    .then(response => response.text())
    .then(data => {
            document.getElementById("imagem").src = data
        })