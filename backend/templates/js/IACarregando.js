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
            body: JSON.stringify({ nome: nome_recebido, mundo_perfeito: mp }),
        });

        if (!response.ok) {
            console.error("Erro ao gerar imagem, status:", response.status);
            alert("Houve um erro gerando a imagem, o totem será desabilitado temporáriamente.")
            await fetch("/api/etapa?atualizarManualmente=7")
            location.reload()
            return;
        }

        console.log("Imagem gerada com sucesso! Chamando /api/elevarEtapa...");

        const etapaResponse = await fetch("/api/elevarEtapa");
        if (!etapaResponse.ok) {
            console.error("Erro ao elevar etapa:", etapaResponse.status);
            return;
        }

        console.log("Etapa elevada com sucesso!");
    } catch (error) {
        console.error("Erro ao gerar a imagem:", error);
    }
}

async function receber_usuario() {
    try {
        const response = await fetch("/api/usuario");
        if (!response.ok) throw new Error(`Erro ao obter usuário, status: ${response.status}`);
        usuario = (await response.text()).trim();
        console.log("Usuário recebido:", usuario || "(vazio)");
    } catch (error) {
        console.error("Erro ao receber o usuário:", error);
    }
}

async function receber_mundo_perfeito() {
    try {
        const response = await fetch("/api/mundo_perfeito");
        if (!response.ok) throw new Error(`Erro ao obter mundo perfeito, status: ${response.status}`);
        mundo_perfeito = (await response.text()).trim();
        console.log("Mundo perfeito recebido:", mundo_perfeito || "(vazio)");
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

        console.log("Gerando imagem...");
        await gerar_imagem(usuario, mundo_perfeito);

        console.log("Fluxo concluído sem recarregar a página.");
    } catch (error) {
        console.error("Erro no fluxo de execução:", error);
    }
}

executar();