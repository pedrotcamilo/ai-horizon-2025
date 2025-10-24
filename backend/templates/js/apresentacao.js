const timerDisplay = document.getElementById('timer');
let audioContext;
let mediaStream;
let mediaStreamSource;
let scriptProcessor;
let audioData = [];

let pagina = window.location.href
let paginaSplit = pagina.split("/")
let paginaRaw = `http://${paginaSplit[2]}`

function floatTo16BitPCM(float32Array) {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    let offset = 0;
    for (let i = 0; i < float32Array.length; i++, offset += 2) {
        let s = Math.max(-1, Math.min(1, float32Array[i]));
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
    return view;
}

function encodeWAV(samples, sampleRate) {
    const buffer = new ArrayBuffer(44 + samples.byteLength);
    const view = new DataView(buffer);

    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + samples.byteLength, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, samples.byteLength, true);

    for (let i = 0; i < samples.byteLength; i++) {
        view.setUint8(44 + i, samples.getUint8(i));
    }

    return new Blob([view], { type: 'audio/wav' });
}

function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

async function startRecording() {
    mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    mediaStreamSource = audioContext.createMediaStreamSource(mediaStream);
    scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);

    mediaStreamSource.connect(scriptProcessor);
    scriptProcessor.connect(audioContext.destination);

    scriptProcessor.onaudioprocess = function(e) {
        audioData.push(new Float32Array(e.inputBuffer.getChannelData(0)));
    };

    startTimer(10);
}

function startTimer(seconds) {
    let seg = seconds;
    const timer = setInterval(() => {
        timerDisplay.innerHTML = '00:' + ('0' + seg).slice(-2);
        seg--;
        if (seg < 0) {
            clearInterval(timer);
            stopRecording();
            fetch(`${paginaRaw}/api/etapa?atualizarManualmente=3`)
                .then(function() {
                    location.reload()
                })
        }
    }, 1000);
}

function stopRecording() {
    scriptProcessor.disconnect();
    mediaStreamSource.disconnect();
    mediaStream.getTracks().forEach(track => track.stop());

    let length = audioData.reduce((acc, cur) => acc + cur.length, 0);
    let merged = new Float32Array(length);
    let offset = 0;
    for (let i = 0; i < audioData.length; i++) {
        merged.set(audioData[i], offset);
        offset += audioData[i].length;
    }

    const wavBlob = encodeWAV(floatTo16BitPCM(merged), audioContext.sampleRate);
    const url = URL.createObjectURL(wavBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recording.wav';
    a.click();
    URL.revokeObjectURL(url);
}

window.addEventListener('load', startRecording);