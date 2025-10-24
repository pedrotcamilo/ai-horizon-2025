document.getElementById("btnTentarNovamente").onclick = function() {
    fetch(`${paginaRaw}/api/etapa?atualizarManualmente=3`)
        .then(function() {
            location.reload()
        })
}