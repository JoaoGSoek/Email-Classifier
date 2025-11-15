# Classificador de Emails com IA 🤖

### _Solução para Triagem e Resposta Automática de Emails_

Este projeto foi desenvolvido como parte de um desafio técnico para uma vaga de desenvolvedor. O objetivo é criar uma solução digital que automatiza a leitura, classificação e sugestão de respostas para emails, otimizando o tempo de equipes que lidam com um alto volume de mensagens diariamente.

🔗 **Acessar a Aplicação:** **[LINK DA SUA APLICAÇÃO NO RENDER AQUI]**

🎥 **Assistir ao Vídeo de Demonstração:** **[LINK DO SEU VÍDEO NO YOUTUBE AQUI]**

---

## ✨ Funcionalidades Principais

*   **Classificação Inteligente:** Utiliza a API do Google Gemini para classificar emails em duas categorias principais: **Produtivo** e **Improdutivo**.
*   **Geração de Respostas:** Sugere respostas automáticas e coerentes com o contexto e a classificação do email.
*   **Geração de Título:** Cria um título curto e descritivo para cada email analisado, facilitando a identificação.
*   **Upload Flexível:** Permite a análise de emails colando o texto diretamente ou fazendo o upload de arquivos `.txt` e `.pdf`.
*   **Histórico de Análises:** Salva todas as análises no navegador (`localStorage`) para consulta posterior.
*   **Interface Interativa:** Apresenta uma barra lateral expansível para navegar pelo histórico de emails analisados de forma cronológica.

---

## 📸 Screenshot da Aplicação

*Substitua a imagem abaixo por um screenshot real da sua aplicação.*

![Screenshot da Aplicação](https://i.imgur.com/example.png "Interface do Classificador de Emails com IA")

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando um stack moderno e eficiente, focado em simplicidade e performance.

| Categoria | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Inteligência Artificial** | 🧠 Google Gemini API | Usada para a lógica principal de classificação, geração de resposta e criação de títulos. |
| **Backend** | 🐍 Python | Linguagem principal para a lógica do servidor. |
| | 🌶️ Flask | Micro-framework web para criar a API que serve a aplicação. |
| | 🦄 Gunicorn | Servidor WSGI para rodar a aplicação em produção. |
| **Frontend** | 🌐 HTML5, CSS3, JS (Vanilla) | Estrutura, estilo e interatividade da interface do usuário. |
| | 🎨 Pico.css | Framework CSS minimalista para um design limpo e responsivo sem esforço. |
| **Banco de Dados** | 🗂️ Browser `localStorage` | Utilizado para persistir o histórico de análises no lado do cliente, mantendo a simplicidade da arquitetura. |
| **Hospedagem** | ☁️ Render | Plataforma de nuvem para o deploy e hospedagem contínua da aplicação web. |

---

## 🚀 Como Executar o Projeto Localmente

Siga os passos abaixo para configurar e rodar a aplicação em sua máquina.

### Pré-requisitos

*   **Python 3.8+**
*   **Git**
*   Uma chave de API do **Google AI Studio (Gemini)**. Você pode obter uma gratuitamente [aqui](https://aistudio.google.com/).

### Passos para Instalação

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/seu-repositorio.git
    cd seu-repositorio
    ```

2.  **Crie e ative um ambiente virtual:**
    ```bash
    # Criar o ambiente
    python -m venv venv

    # Ativar no Windows
    .\venv\Scripts\activate

    # Ativar no macOS/Linux
    source venv/bin/activate
    ```

3.  **Instale as dependências:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure as variáveis de ambiente:**
    *   Crie um arquivo chamado `.env` na raiz do projeto.
    *   Adicione sua chave de API do Gemini a este arquivo:
    ```
    GOOGLE_API_KEY=SUA_CHAVE_API_AQUI
    ```

5.  **Inicie o servidor de desenvolvimento:**
    ```bash
    python app.py
    ```

6.  **Acesse a aplicação:**
    Abra seu navegador e acesse [http://127.0.0.1:5000](http://127.0.0.1:5000).

---

## 📂 Estrutura do Projeto

A estrutura de arquivos foi organizada para manter uma clara separação entre o backend, o frontend e os arquivos de configuração.

```
/classificador-emails
|
|-- app.py             # Lógica do backend (Flask API)
|-- requirements.txt   # Dependências Python
|-- Procfile           # Instruções para o servidor de produção (Render)
|-- .gitignore         # Arquivos ignorados pelo Git
|-- .env               # Arquivo para variáveis de ambiente (local)
|-- README.md          # Documentação do projeto
|
|-- /templates
|   |-- index.html     # Estrutura da página web
|
|-- /static
    |-- /css
    |   |-- style.css  # Estilos personalizados
    |-- /js
        |-- script.js  # Lógica do frontend e interatividade
```
