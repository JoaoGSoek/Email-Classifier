# app.py
import os
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import openai
import PyPDF2

# Carrega as variáveis de ambiente (sua chave da API)
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)

# Função para extrair texto de PDF
def extrair_texto_pdf(file_stream):
    try:
        reader = PyPDF2.PdfReader(file_stream)
        texto = ""
        for page in reader.pages:
            texto += page.extract_text()
        return texto
    except Exception as e:
        print(f"Erro ao ler PDF: {e}")
        return None

# Função que chama a IA para classificar e gerar resposta
def analisar_email_com_ia(conteudo_email):
    prompt = f"""
    Analise o seguinte texto de um email e retorne um objeto JSON com duas chaves: "classificacao" e "sugestao_resposta".

    As categorias de classificação são: "Produtivo" ou "Improdutivo".

    - "Produtivo": Emails que requerem uma ação, como solicitações, dúvidas técnicas ou atualizações de status. A resposta deve ser profissional e direcionada à ação.
    - "Improdutivo": Emails que não requerem ação imediata, como spams, felicitações ou agradecimentos. A resposta deve ser curta e cordial, ou sugerir o arquivamento.

    Texto do email:
    ---
    {conteudo_email}
    ---

    Retorne apenas o objeto JSON, sem nenhum texto adicional.
    Exemplo de retorno: {{"classificacao": "Produtivo", "sugestao_resposta": "Prezado(a), recebemos sua solicitação e nossa equipe já está analisando. Retornaremos em breve."}}
    """
    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Você é um assistente eficiente de triagem de emails para uma empresa financeira."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            response_format={"type": "json_object"} # Força a saída em JSON
        )
        # A resposta virá em formato JSON string dentro de 'content'
        return response.choices[0].message.content
    except Exception as e:
        print(f"Erro na API da OpenAI: {e}")
        return None

# Rota principal que renderiza a página HTML
@app.route('/')
def index():
    return render_template('index.html')

# Rota que processa os dados do formulário
@app.route('/processar', methods=['POST'])
def processar():
    texto_email = ""
    
    # Verifica se o texto foi enviado diretamente
    if 'email_texto' in request.form and request.form['email_texto'].strip():
        texto_email = request.form['email_texto']
    # Se não, verifica se um arquivo foi enviado
    elif 'email_arquivo' in request.files:
        arquivo = request.files['email_arquivo']
        if arquivo.filename != '':
            if arquivo.filename.endswith('.txt'):
                texto_email = arquivo.read().decode('utf-8')
            elif arquivo.filename.endswith('.pdf'):
                texto_email = extrair_texto_pdf(arquivo.stream)
                if texto_email is None:
                    return jsonify({"erro": "Não foi possível ler o arquivo PDF."}), 400
        else:
            return jsonify({"erro": "Nenhum texto ou arquivo válido enviado."}), 400
    
    if not texto_email:
        return jsonify({"erro": "Nenhum conteúdo de email para analisar."}), 400

    # Chama a função de IA
    resultado_ia = analisar_email_com_ia(texto_email)

    if resultado_ia:
        # O resultado já deve ser um JSON string, então vamos retorná-lo
        return resultado_ia, 200, {'Content-Type': 'application/json'}
    else:
        return jsonify({"erro": "Falha ao processar o email com a IA."}), 500

if __name__ == '__main__':
    app.run(debug=True)