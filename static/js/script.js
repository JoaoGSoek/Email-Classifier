// Variável para armazenar temporariamente a última análise
let currentAnalysis = null;

// --- Seletores do DOM ---
const emailForm = document.getElementById('email-form');
const submitBtn = document.getElementById('submit-btn');
const loadingIndicator = document.getElementById('loading');
const resultadoDiv = document.getElementById('resultado');
const errorDiv = document.getElementById('error-message');
const copyBtn = document.getElementById('copy-btn');

// Novos elementos do DOM
const sidebar = document.getElementById('sidebar');
const toggleSidebarBtn = document.getElementById('toggle-sidebar-btn');
const saveBtn = document.getElementById('save-btn');
const savedEmailsList = document.getElementById('saved-emails-list');
const clearWorkspaceBtn = document.getElementById('clear-workspace-btn');

// --- Funções do localStorage ---

/**
 * Obtém os emails salvos do localStorage.
 * @returns {Array} Um array de objetos de email.
 */
function getSavedEmails() {
    try {
        const savedEmails = localStorage.getItem('savedEmails');
        return savedEmails ? JSON.parse(savedEmails) : [];
    } catch (e) {
        console.error("Erro ao ler emails do localStorage:", e);
        return [];
    }
}

/**
 * Salva um array de emails no localStorage.
 * @param {Array} emails O array de emails para salvar.
 */
function saveEmails(emails) {
    try {
        localStorage.setItem('savedEmails', JSON.stringify(emails));
    } catch (e) {
        console.error("Erro ao salvar emails no localStorage:", e);
    }
}

/**
 * Limpa a área de trabalho, resetando o formulário e a área de resultado.
 */
function clearWorkspace() {
    // Limpa o textarea e o input de arquivo
    emailForm.reset();

    // Oculta a área de resultado e o botão de salvar
    resultadoDiv.classList.add('hidden');
    saveBtn.classList.add('hidden');

    // Reseta a variável de estado da análise atual
    currentAnalysis = null;
}
// --- Funções de Renderização ---

/**
 * Deleta um email salvo do localStorage e atualiza a sidebar.
 * @param {number} id O ID do email a ser deletado.
 */
function deleteEmail(id) {
    const emails = getSavedEmails();
    const updatedEmails = emails.filter(email => email.id !== id);
    saveEmails(updatedEmails);
    renderSidebar();

    // Se o email deletado era o que estava sendo exibido, limpa a área de trabalho
    // Uma forma simples de verificar é checar se o texto original corresponde
    if (document.getElementById('email_texto').value === emails.find(e => e.id === id)?.originalText) {
        clearWorkspace();
    }
}

/**
 * Renderiza a barra lateral com os emails salvos.
 */
function renderSidebar() {
    const emails = getSavedEmails();
    savedEmailsList.innerHTML = ''; // Limpa a lista atual

    // Ordena do mais novo para o mais antigo
    emails.sort((a, b) => b.id - a.id);

    emails.forEach(email => {
        const li = document.createElement('li');
        li.title = email.title;
        li.dataset.id = email.id;
        li.innerHTML = `
            <strong>${email.title}</strong>
            <span>${email.classification}</span>
            <small>${new Date(email.date).toLocaleString()}</small>
        `;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = 'EXCLUIR'; // Ícone de lixeira
        deleteBtn.title = 'Excluir análise';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Impede que o clique no botão acione o clique no 'li'
            deleteEmail(email.id);
        });

        li.addEventListener('click', () => displaySavedEmail(email.id)); // O listener do li continua aqui
        li.appendChild(deleteBtn);
        savedEmailsList.appendChild(li);
    });
}

/**
 * Exibe os detalhes de um email salvo na área de resultado.
 * @param {number} id O ID do email a ser exibido.
 */
function displaySavedEmail(id) {
    const emails = getSavedEmails();
    const email = emails.find(e => e.id === id);

    if (email) {
        document.getElementById('classificacao').textContent = email.classification;
        document.getElementById('titulo').textContent = email.title;
        document.getElementById('sugestao-resposta').textContent = email.response;
        document.getElementById('email_texto').value = email.originalText; // Exibe o texto original

        resultadoDiv.classList.remove('hidden');
        saveBtn.classList.add('hidden'); // Oculta o botão, pois já está salvo
    }
}

// --- Event Listeners ---

/**
 * Listener para o carregamento inicial da página.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Remove a classe 'hidden' e usa 'collapsed' para permitir a transição inicial
    if (sidebar.classList.contains('hidden')) {
        sidebar.classList.remove('hidden');
        sidebar.classList.add('collapsed');
    }
    renderSidebar();
});

/**
 * Listener para o botão de toggle da sidebar.
 */
toggleSidebarBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
});

/**
 * Listener para o botão de limpar a área de trabalho.
 */
clearWorkspaceBtn.addEventListener('click', () => {
    clearWorkspace();
});

/**
 * Listener para o botão de salvar análise.
 */
saveBtn.addEventListener('click', () => {
    if (!currentAnalysis) return;

    const emails = getSavedEmails();
    const newEmail = {
        id: Date.now(),
        date: new Date().toISOString(),
        title: currentAnalysis.titulo,
        classification: currentAnalysis.classificacao,
        response: currentAnalysis.sugestao_resposta,
        originalText: currentAnalysis.originalText
    };

    emails.push(newEmail);
    saveEmails(emails);
    renderSidebar();
    saveBtn.classList.add('hidden'); // Oculta após salvar
});

/**
 * Listener para o envio do formulário de análise.
 */
document.getElementById('email-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const form = event.target;
    const formData = new FormData(form);
    const originalText = formData.get('email_texto');

    // Resetar e mostrar loading
    submitBtn.disabled = true;
    loadingIndicator.classList.remove('hidden');
    resultadoDiv.classList.add('hidden');
    errorDiv.classList.add('hidden');
    errorDiv.textContent = '';

    try {
        const response = await fetch('/processar', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.erro || 'Ocorreu um erro desconhecido.');
        }

        // Preencher os resultados na tela
        currentAnalysis = { ...result, originalText }; // Armazena na variável global

        document.getElementById('classificacao').textContent = result.classificacao;
        document.getElementById('titulo').textContent = result.titulo;
        document.getElementById('sugestao-resposta').textContent = result.sugestao_resposta;

        resultadoDiv.classList.remove('hidden');
        saveBtn.classList.remove('hidden'); // Exibe o botão de salvar

    } catch (error) {
        console.error('Erro:', error);
        errorDiv.textContent = `Erro: ${error.message}`;
        errorDiv.classList.remove('hidden');
    } finally {
        // Habilitar botão e esconder loading
        submitBtn.disabled = false;
        loadingIndicator.classList.add('hidden');
    }
});

/**
 * Listener para o botão de copiar a sugestão de resposta.
 */
copyBtn.addEventListener('click', function() {
    const textoParaCopiar = document.getElementById('sugestao-resposta').textContent;
    const copyBtn = this;

    navigator.clipboard.writeText(textoParaCopiar).then(() => {
        // Feedback visual para o usuário
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copiado!';
        copyBtn.disabled = true;

        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.disabled = false;
        }, 2000); // Retorna ao texto original após 2 segundos
    }).catch(err => {
        console.error('Erro ao copiar texto: ', err);
    });
});