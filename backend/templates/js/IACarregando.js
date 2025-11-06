let usuario = "";
let mundo_perfeito = "";

async function gerar_imagem(nome_recebido, mp) {
    if (!nome_recebido || !mp) {
        console.error("Nome ou mundo perfeito inválido:", { nome_recebido, mp });
        return;
    }

    try {
        console.log("Enviando dados para gerar imagem:", { nome_recebido, mp });

        const response = await fetch("/api/gerar_imagem", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nome: nome_recebido,
                mundo_perfeito: mp,
            }),
        });

        if (!response.ok) {
            console.error("Erro ao gerar imagem, status:", response.status);
            return;
        }

        console.log("Imagem gerada com sucesso! Elevando etapa...");
        await fetch("/api/elevarEtapa");

        location.reload()

    } catch (error) {
        console.error("Erro ao gerar a imagem:", error);
    }
}

async function receber_usuario() {
    try {
        const response = await fetch("/api/usuario");
        if (!response.ok) {
            throw new Error(`Erro ao obter usuário, status: ${response.status}`);
        }

        usuario = (await response.text()).trim(); // 👈 usa texto simples e remove espaços
        console.log("Usuário recebido:", usuario || "(vazio)");

    } catch (error) {
        console.error("Erro ao receber o usuário:", error);
    }
}

async function receber_mundo_perfeito() {
    try {
        const response = await fetch("/api/mundo_perfeito");
        if (!response.ok) {
            throw new Error(`Erro ao obter mundo perfeito, status: ${response.status}`);
        }

        mundo_perfeito = (await response.text()).trim(); // 👈 também texto simples
        console.log("Mundo perfeito recebido:", mundo_perfeito || "(vazio)");
        mundo_perfeito = "Um mundo futurista com paz mundial"

    } catch (error) {
        console.error("Erro ao receber o mundo perfeito:", error);
    }
}

async function executar() {
    try {
        console.log("Iniciando a execução...");

        await receber_usuario();
        await receber_mundo_perfeito();

        if (!usuario || !mundo_perfeito) {
            console.error("Erro: nome do usuário ou mundo perfeito não receberam valores válidos.");
            return;
        }

        console.log("Chamada para gerar a imagem...");
        await gerar_imagem(usuario, mundo_perfeito);

        location.reload()

    } catch (error) {
        console.error("Erro no fluxo de execução:", error);
    }
}

// Inicia a execução
executar();