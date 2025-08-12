qntAbrirAdmin = 0

function abrirAdmin() {
    qntAbrirAdmin++

    if (qntAbrirAdmin >= 10) {
        qntAbrirAdmin = 0
        senhaInserida = prompt("Digite a senha de administrador")

        if (senhaInserida != "123"){
            alert("Senha incorreta!")
            return
        }
        
        window.location.replace('painelAdmin.html')
    }
}