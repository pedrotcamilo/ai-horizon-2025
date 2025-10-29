let pagina = window.location.href;
let paginaSplit = pagina.split("/");
let paginaRaw = `http://${paginaSplit[2]}`
let imagem_aprovada = false
let imagem_proibida = false

function receber_status(status, nome) {
    switch (status) {
        case "ok": 
            imagem_aprovada = true
        case "no": 
            imagem_proibida = true

        case "regen":
            fetch(`${paginaRaw}/api/prompt_mp`)
                .then(response => response.text())
                .then(data => {
                    fetch(`${paginaRaw}/api/gerar_imagem`), {
                        method: "POST",
                        body: JSON.stringify({
                            nome: nome,
                            mundo_perfeito: data
                        }),
                        headers: {
                            "Content-Type": "application/json; charset=UTF-8"
                        }
                    }
                })
    }
}

fetch(`${paginaRaw}/api/status_imagem`)
    .then(response => response.text())
    .then(data => {
        fetch(`${paginaRaw}/api/gerenciar/nome`)
            .then(response => response.text())
            .then(nome => {
                while (imagem_aprovada != true || imagem_proibida != true) {
                    setInterval(receber_status(nome, data), 10000)
                }
            })
    })