/*
// texto generico só pra funcionar

fetch("/api/receberMundoPerfeito", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        mundo_perfeito: 'Imagine um mundo perfeito com a paz mundial'
    }),
});

fetch('/api/elevarEtapa')
location.reload()
*/

window.addEventListener("DOMContentLoaded", async () => {
    const timerElement = document.getElementById("timer");
    let mediaRecorder;
    let audioChunks = [];

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = (e) => {
            audioChunks.push(e.data);
        };

        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
            const formData = new FormData();
            formData.append("audio", audioBlob, "gravacao.wav");

            try {
                if (!formData > 0) {
                    formData = "Imagine um mundo perfeito com a paz mundial" // fallback
                }

                const res = await fetch("/api/receberAudio", {
                    method: "POST",
                    body: formData,
                });

                const data = await res.json();
                const texto = data.transcricao || "";

                await fetch("/api/receberMundoPerfeito", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ mundo_perfeito: texto }),
                });

                await fetch("/api/elevarEtapa");
                location.reload();

            } catch (err) {
                console.error("Erro ao enviar o áudio:", err);
            }
        };

        mediaRecorder.start();

        startTimer(timerElement, 10, () => {
            mediaRecorder.stop();
        });

    } catch (err) {
        timerElement.textContent = "Err PN";
    }
});

function startTimer(element, seconds, onEnd) {
    let remaining = seconds;
    element.textContent = formatTime(remaining);

    const interval = setInterval(() => {
        remaining--;
        element.textContent = formatTime(remaining);

        if (remaining <= 0) {
            clearInterval(interval);
            element.textContent = "00:00";
            if (onEnd) onEnd();
        }
    }, 1000);
}

function formatTime(sec) {
    return `00:${sec.toString().padStart(2, "0")}`;
}