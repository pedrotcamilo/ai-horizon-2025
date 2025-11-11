window.addEventListener("load", () => {
    let frase = "";
    let fraseSplit = [];
    const texto = document.getElementById("texto");
    const audioElement = document.getElementById("tocador_audio");

    if (!audioElement) {
        console.error("Error: Element with id 'tocador_audio' not found.");
        return;
    }

    if (audioElement.tagName.toLowerCase() !== "audio") {
        console.error("Error: 'tocador_audio' must be an <audio> element.");
        console.log("Found element:", audioElement.outerHTML);
        return;
    }

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

    // Step 1: Fetch and play audio first
    fetch(`${paginaRaw}/api/audio/url`)
        .then(response => response.text())
        .then(audioUrl => {
            audioElement.src = audioUrl;
            return audioElement.play()
                .then(() => console.log("Audio playback started."))
                .catch(err => console.warn("Audio autoplay blocked or failed:", err));
        })
        .then(() => {
            // Step 2: Fetch and animate phrase
            return fetch(`${paginaRaw}/api/frase`);
        })
        .then(response => response.text())
        .then(data => {
            frase = data;
            fraseSplit = frase.split("");
            i = 0;
            texto.innerHTML = "";
            animacao();
        })
        .catch(error => console.error("Error:", error));
});