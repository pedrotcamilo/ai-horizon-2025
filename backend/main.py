from flask import Flask, render_template, jsonify, send_file, request, redirect
from flask_cors import CORS
from dotenv import load_dotenv
from openai import OpenAI

import os
import base64
import uuid

load_dotenv()

etapa = 0
frase_global = "Olá, prazer, eu me chamo Líria, a minha pergunta é, como você imagina o mundo se a paz mundial fosse adquirida? Darei um tempinho para você pensar, não se preocupe."
usuario = "Nenhum"
url_imagem = ""
prompt_mundo_perfeito = ""
json_imagem_gerada = {}

client = OpenAI(
    api_key=os.getenv("OPENAI_CHAVE_API"),
    organization=os.getenv("OPENAI_CHAVE_ORGANIZACAO")
)

if not os.path.exists('imagens'): os.makedirs('imagens')
if not os.path.exists('audios'): os.makedirs('audios')
if not os.path.exists('qrcode'): os.makedirs('qrcode')

app = Flask(__name__)
CORS(app)

# Interface principal

@app.route('/')
def carregar_interface():
    global etapa
    global url_imagem
    global usuario
    global frase_global
    if etapa == 0: 
        url_imagem = "" 
        usuario = ""
        frase_global = "Olá, prazer, eu me chamo Líria, a minha pergunta é, como você imagina o mundo se a paz mundial fosse adquirida? Darei um tempinho para você pensar, não se preocupe."
        return render_template("index.html")
    elif etapa == 1: return render_template("apresentacao.html")
    elif etapa == 2: return render_template("IAra.html")
    elif etapa == 3: return render_template("imaginacao.html")
    elif etapa == 4: return render_template("imaginacaoResultado.html")
    elif etapa == 5: return render_template("IACarregando.html")
    elif etapa == 6: return render_template("resultado.html")
    elif etapa == 7: return render_template("indisponivel.html")
    elif etapa == 8: return render_template("pgDebug.html")
    else:
        etapa = 0
        return render_template("index.html")

@app.route('/js/<filename>')
def send_js_file(filename):
    return send_file(os.path.join(os.getcwd(), 'templates', 'js', filename))

@app.route('/css/<filename>')
def send_css_file(filename):
    return send_file(os.path.join(os.getcwd(), 'templates', 'css', filename))

@app.route('/content/<filename>')
def send_content_file(filename):
    return send_file(os.path.join(os.getcwd(), 'templates', 'content', filename))

@app.route('/content/icons/<filename>')
def send_icons_file(filename):
    return send_file(os.path.join(os.getcwd(), 'templates', 'content', 'icons', filename))

@app.route('/content/intf/<filename>')
def send_intf_file(filename):
    return send_file(os.path.join(os.getcwd(), 'templates', 'content', 'intf', filename))

# APIs

@app.route('/api/elevarEtapa')
def elevar_etapa():
    global etapa
    etapa += 1
    return redirect("/")

@app.route('/api/descerEtapa')
def descer_etapa():
    global etapa
    etapa -= 1
    return redirect("/")

@app.route('/api/etapa')
def devolver_etapa():
    args = request.args.get('atualizarManualmente')

    global etapa
    if args != None: etapa = int(args)
    return jsonify({"etapa": etapa})

@app.route('/api/imagem/<filename>')
def servir_imagem(filename):
    try:
        return send_file(os.path.join(os.getcwd(), 'imagens', filename))
    except Exception as e:
        return f"Erro carregando a imagem: <br> {str(e)}", 500
    
@app.route('/api/qrcode/<filename>')
def servir_qrcode(filename):
    try:
        return send_file(os.path.join(os.getcwd(), 'qrcode', filename))
    except Exception as e:
        return f"Erro carregando o qrcode: <br> {str(e)}", 500

@app.route('/api/audio/<filename>')
def servir_audio(filename):
    args = request.args.get('audioNomeFixo')

    try:
        if int(args) == 1:
            return send_file(os.path.join(os.getcwd(), 'audios', 'audio_SeuNome.mp3'))
        else:    
            return send_file(os.path.join(os.getcwd(), 'audios', filename))
    except Exception as e:
        return f"Erro carregando o audio: <br> {str(e)}", 500

# APIs (Gerações LLM)

@app.route('/api/gerar_audio/', methods=["POST"])
def gerar_audio():
    global frase_global
    global usuario
    global etapa

    data = request.json
    nome = data.get("nome").lower()

    usuario = nome

    if not nome:
        return jsonify({"erro": "Informe o nome"}), 400
    
    frase = f"Olá {nome.capitalize()}, prazer, eu me chamo Líria! Como você imagina o mundo se a paz mundial fosse alcançada?"
    frase_global = frase

    try:
        if not os.path.exists(os.getcwd(), 'audios', f'frase_{nome}.mp3'):
            resposta = client.audio.speech.create(
                model="tts-1",
                voice="alloy",
                input=frase
            )

            print(f"[Endpoint gerar_audio] Audio gerado para o nome: {nome}")
            with open(filepath, "wb") as f: f.write(resposta.read())

        filename = f"frase_{nome}.mp3"
        filepath = os.path.join(os.getcwd(), "audios", filename)

        url = f"http://{os.getenv("HOST")}:{os.getenv("PORTA")}/api/audio/{filename}"

        return jsonify({"audio_url": url})
    except Exception as e:
        return jsonify({"erro": f"Erro ao gerar áudio: {str(e)}"}), 500

@app.route("/api/listar_imagens/")
def listar_imagens():
    try:
        imagens = []
        if os.path.exists(os.path.join(os.getcwd(), "imagens")):
            for filename in os.listdir(os.path.join(os.getcwd(), "imagens")):
                if filename.endswith('.png'):
                    imagens.append({
                        'nome': filename,
                        'url': f'http://{os.getenv("HOST")}:{os.getenv("PORTA")}/api/imagem/{filename}'
                    })
                    # meu deus cara
                # faz
            # isso
        # parar

        return jsonify({'imagens': imagens})
    except Exception as e:
        return jsonify({'erro': str(e)}), 500
    
@app.route("/api/gerar_imagem", methods=["POST"])
def gerar():
    data = request.json
    nome = data.get("nome")
    mundo_perfeito = data.get("mundo_perfeito")
    global url_imagem
    global prompt_mundo_perfeito
    global json_imagem_gerada

    prompt_mundo_perfeito = mundo_perfeito

    if not nome: return jsonify({"erro": "Informe o nome"}), 400
    if not mundo_perfeito: return jsonify({"erro": "Informe como você imagina o mundo perfeito"}), 400

    try:
        resposta = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system",
                 "content": "Você é um especialista em prompts para geração de imagens. Crie prompts concisos e diretos (máximo 20 palavras) para imagens realistas. Responda APENAS com o prompt melhorado, sem explicações."},
                {"role": "user",
                 "content": f"Enriqueça este prompt de forma concisa para imagem realista: 'mundo perfeito com {mundo_perfeito}'. Adicione apenas detalhes essenciais de iluminação e realismo. Máximo 20 palavras. e não gere coisas que não poderam existir, que fuja da realidade, quando isso acontecer retire da imagem."}
            ]
        )

        prompt_enriquecido = resposta.choices[0].message.content

        imagem = client.images.generate(
            model="dall-e-3",
            prompt=f"Photorealistic: {prompt_enriquecido}. High quality, realistic lighting, detailed.",
            size="512x512",
            response_format="b64_json"
        )

        b64_imagem = imagem.data[0].b64_json
        img_bytes = base64.b64decode(b64_imagem)

        filename = f"{uuid.uuid4()}.png"
        filepath = os.path.join(os.getcwd(), "imagens", filename)

        with open(filepath, "wb") as f: f.write(img_bytes)

        local_url = f"http://{os.getenv("HOST")}:{os.getenv("PORTA")}/api/imagem/{filename}"
        url_imagem = local_url
        qr_local_url = f"http://{os.getenv("HOST")}:{os.getenv("PORTA")}/api/qrcode/{filename}"

        json_imagem_gerada = {
            "nome": nome,
            "mundo_perfeito": mundo_perfeito,
            "imagem_url": local_url,
        }

        return jsonify(json_imagem_gerada)

    except Exception as e:
        return jsonify({"erro": f"Erro ao gerar conteúdo: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host=os.getenv("HOST"), port=int(os.getenv("PORTA")))