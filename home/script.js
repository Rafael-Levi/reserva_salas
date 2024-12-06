// Funções para interação com o formulário e o calendário

// Exemplo: função para exibir mensagem de sucesso após o agendamento
const formAgendamento = document.getElementById('form-agendamento');
formAgendamento.addEventListener('submit', (event) => {
    event.preventDefault(); // Previne o envio padrão do formulário

    // Lógica para processar o agendamento (ex: enviar dados para o servidor)

    alert('Agendamento realizado com sucesso!');
    formAgendamento.reset(); // Limpa o formulário
});

function openPopup() {
    document.getElementById("popup").style.display = "flex";
    document.body.style.overflow = "hidden"; 
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
    document.body.style.overflow = "auto"; 
}

function formatarDataAtual() {
    // Cria um novo objeto de data com a data e hora atuais
    const dataAtual = new Date();

    // Array com os nomes dos meses em português
    const meses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    // Obtém o nome do mês, o dia e o ano
    const nomeMes = meses[dataAtual.getMonth()];
    const dia = dataAtual.getDate();
    const ano = dataAtual.getFullYear();

    // Formata a data no modelo desejado
    return `${nomeMes} ${dia.toString().padStart(2, '0')}, ${ano}`;
             
}
