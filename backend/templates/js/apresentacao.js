let qntAbrirAdmin = 0;
let pagina = window.location.href
let paginaSplit = pagina.split("/")
let paginaRaw = `http://${paginaSplit[2]}`

document.getElementById("btnProsseguir").onclick = function(e) {
    document.getElementById("btnProsseguir").style.display = "none"
    let nome = document.getElementById("nome").value
    let nome_formatado = nome.split(" ")

    fetch(`${paginaRaw}/api/gerar_audio`, {
        method: "POST",
        body: JSON.stringify({
            nome: nome_formatado[0]
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
        .then(function() {
            fetch(`${paginaRaw}/api/elevarEtapa`)
                .then(function() {
                    location.reload()
                })
        })

}