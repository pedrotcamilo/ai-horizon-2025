let pagina = window.location.href;
let paginaSplit = pagina.split("/");
let paginaRaw = `http://${paginaSplit[2]}`

document.getElementById('iframe').src = paginaRaw

function atualizarIframe() {
    document.getElementById('iframe').src = document.getElementById('iframe').src
}

function atualizarNome() {
    let pagina = window.location.href;
    let paginaSplit = pagina.split("/");
    let paginaRaw = `http://${paginaSplit[2]}`;

    fetch(`${paginaRaw}/api/gerenciar/nome`)
        .then(response => response.text())
        .then(data => {
            const nomeElemento = document.getElementById("nome");
            if (!nomeElemento.innerHTML.includes(data)) {
                nomeElemento.innerHTML = `Nome do usuário: ${data}`;
            }
        })
        .catch(error => console.error("Erro ao buscar nome:", error));
}

function acoesimagem(n) {
    let pagina = window.location.href;
    let paginaSplit = pagina.split("/");
    let paginaRaw = `http://${paginaSplit[2]}`
    if (parseInt(n) == 1) {
        fetch(`${paginaRaw}/api/status_imagem?aprovacao=1`)
        alert("Imagem foi aprovada")
    }

    if (parseInt(n) == 2) {
        fetch(`${paginaRaw}/api/status_imagem?aprovacao=2`)
        alert("Imagem foi reprovada")
    }

    if (parseInt(n) == 3) {
        fetch(`${paginaRaw}/api/status_imagem?aprovacao=3`)
        alert("Regeneracao de imagem solicitada")
    }
}

function etapa(n) {
    let pagina = window.location.href;
    let paginaSplit = pagina.split("/");
    let paginaRaw = `http://${paginaSplit[2]}`
    if (parseInt(n) == 1) {
        fetch(`${paginaRaw}/api/elevarEtapa`)
        alert("Etapa elevada!")
    }

    if (parseInt(n) == 2) {
        fetch(`${paginaRaw}/api/descerEtapa`)
        alert("Etapa descida")
    }
}

function atualizarEtapa() {
    let pagina = window.location.href;
    let paginaSplit = pagina.split("/");
    let paginaRaw = `http://${paginaSplit[2]}`;

    fetch(`${paginaRaw}/api/etapa`)
        .then(response => response.text())
        .then(data => {
            const nomeElemento = document.getElementById("etapa");
            if (!nomeElemento.innerHTML.includes(data)) {
                nomeElemento.innerHTML = `Etapa: ${data}`;
            }
        })
        .catch(error => console.error("Erro ao buscar a etapa:", error));
}

function atualizarFrase() {
    let pagina = window.location.href;
    let paginaSplit = pagina.split("/");
    let paginaRaw = `http://${paginaSplit[2]}`;

    fetch(`${paginaRaw}/api/gerenciar/frase`)
        .then(response => response.text())
        .then(data => {
            const nomeElemento = document.getElementById("frase");
            if (!nomeElemento.innerHTML.includes(data)) {
                if (data != 'Olá, prazer, eu me chamo Líria, a minha pergunta é, como você imagina o mundo se a paz mundial fosse adquirida? Darei um tempinho para você pensar, não se preocupe.') {
                    nomeElemento.innerHTML = `Frase: ${data}`;
                }
            }
        })
        .catch(error => console.error("Erro ao buscar a frase:", error));
}

function receberImagem() {
    let pagina = window.location.href;
    let paginaSplit = pagina.split("/");
    let paginaRaw = `http://${paginaSplit[2]}`;

    fetch(`${paginaRaw}/api/imagem_gerada`)
        .then(response => response.text())
        .then(data => {
            if (data.length > 0) {
                document.getElementById("imagemRecebida").src = data
            } else {
                document.getElementById("imagemRecebida").src = `${paginaRaw}/gerenciar/js/image.png`
            }
        })
}

atualizarNome();
atualizarEtapa();
atualizarFrase();
receberImagem();

setInterval(atualizarNome, 5000);
setInterval(atualizarEtapa, 5000);
setInterval(atualizarFrase, 5000);
setInterval(atualizarIframe, 5000);
setInterval(receberImagem, 5000);