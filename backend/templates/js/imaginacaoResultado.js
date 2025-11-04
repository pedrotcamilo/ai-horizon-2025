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