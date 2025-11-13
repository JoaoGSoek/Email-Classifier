document.getElementById('email-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const form = event.target;
    const formData = new FormData(form);
    const submitBtn = document.getElementById('submit-btn');
    const loadingIndicator = document.getElementById('loading');
    const resultadoDiv = document.getElementById('resultado');
    const errorDiv = document.getElementById('error-message');

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
        document.getElementById('classificacao').textContent = result.classificacao;
        document.getElementById('sugestao-resposta').textContent = result.sugestao_resposta;
        resultadoDiv.classList.remove('hidden');

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