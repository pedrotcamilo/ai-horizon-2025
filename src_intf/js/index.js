qntAbrirAdmin = 0

function abrirAdmin() {
    qntAbrirAdmin++

    if (qntAbrirAdmin >= 10) {
        qntAbrirAdmin = 0
        senhaInserida = prompt("Digite a senha de administrador")

        if (senhaInserida === "123"){
            window.location.replace('painelAdmin.html')
        } else {
            alert("Senha incorreta!")
        }
    }
}