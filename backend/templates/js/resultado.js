let pagina = window.location.href
let paginaSplit = pagina.split("/")
let paginaRaw = `http://${paginaSplit[2]}`

document.getElementById("btnVoltar").onclick = function () {
    fetch(`${paginaRaw}/api/etapa?atualizarManualmente=0`)
        .then(function() {
            location.reload()
        })
}

fetch(`${paginaRaw}/api/json_imagem_gerada`)
    .then(data => {
            document.getElementById("imagem").src = data.imagem_url
        })