qntAbrirAdmin = 0

function abrirAdmin() {
    qntAbrirAdmin++

    if (qntAbrirAdmin === 10) {
        qntAbrirAdmin = 0
        window.location.replace('painelAdmin.html')
    }
}