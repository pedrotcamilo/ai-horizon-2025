senhaIns = ""
tentativasFaltando = 5

function addNumSenha(n) {
    if (senhaIns === "") {
        senhaIns = ""
    }
    senhaIns += n.toString()
    document.getElementById("senha").value = senhaIns
}

function removerNumSenha() {
    senhaIns = senhaIns.slice(0, -1)
    if (senhaIns === "") {
        senhaIns = ""
    }
    document.getElementById("senha").value = senhaIns
}

function autenticar() {
    if (tentativasFaltando <=0) {
        window.location.replace('index.html')
        return
    }

    if (senhaIns != "538769") {
        tentativasFaltando--
        alert(`Senha incorreta! Você tem mais ${tentativasFaltando} tentativas`)
        return
    }

    window.location.replace('painelAdmin.html')
}