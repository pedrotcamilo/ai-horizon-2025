qntAbrirAdmin = 0

function abrirAdmin() {
    qntAbrirAdmin++

    if (qntAbrirAdmin >= 10) {
        qntAbrirAdmin = 0
        senhaInserida = prompt("Digite a senha de administrador")

        if (senhaInserida === "123"){
            user="Pedro"
        } else {
            alert("Senha incorreta!")
            return
        }
        
        alert(`Bem-vindo, ${user}`)
        window.location.replace('painelAdmin.html')
    }
}