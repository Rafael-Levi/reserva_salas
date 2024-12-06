// Funções para interação com o formulário e o calendário

// Exemplo: função para exibir mensagem de sucesso após o agendamento
const formAgendamento = document.getElementById('form-agendamento');
formAgendamento.addEventListener('submit', (event) => {
    event.preventDefault(); // Previne o envio padrão do formulário

    // Lógica para processar o agendamento (ex: enviar dados para o servidor)

    alert('Agendamento realizado com sucesso!');
    formAgendamento.reset(); // Limpa o formulário
});

// ... outras funções para:
// - Carregar a disponibilidade de salas no calendário
// - Implementar a lógica de agendamento
// - Enviar notificações (requer integração com servidor)
// - Permitir cancelamento e reagendamento