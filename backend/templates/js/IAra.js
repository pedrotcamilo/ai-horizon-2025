let frase = "";
let fraseSplit = [];
const texto = document.getElementById("texto");

let pagina = window.location.href;
let paginaSplit = pagina.split("/");
let paginaRaw = `http://${paginaSplit[2]}`;

let i = 0;

function animacao() {
    if (i < fraseSplit.length) {
        texto.innerHTML += fraseSplit[i];
        i++;
        setTimeout(animacao, 50);
    } else {
        setTimeout(() => {
            window.location.href = `${paginaRaw}/api/elevarEtapa`;
        }, 5000);
    }
}

fetch(`${paginaRaw}/api/frase`)
    .then(response => response.text())
    .then(data => {
        frase = data;
        fraseSplit = frase.split("");
        i = 0;
        texto.innerHTML = "";
        animacao();
    })
    .catch(error => {
        console.error("Error fetching frase:", error);
    });
