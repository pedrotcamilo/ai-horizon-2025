let qntAbrirAdmin = 0;

document.getElementById("btnProsseguir").onclick = function(e) {
    window.location.replace('apresentacao.html')
}

function abrirAdmin() {
    qntAbrirAdmin++;

    if (qntAbrirAdmin >= 10) {
        qntAbrirAdmin = 0;
        window.location.replace('admin/loginAdmin.html')
    }
}