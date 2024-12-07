document.addEventListener("DOMContentLoaded", () => {
    const daysElement = document.getElementById("days");
  
    // Função para gerar a semana atual
    function generateWeek() {
      const today = new Date();
      const currentDayIndex = today.getDay(); // 0 = Domingo, 1 = Segunda, ...
      const startOfWeek = new Date(today);
  
      // Ajustar para o primeiro dia da semana (segunda-feira)
      startOfWeek.setDate(today.getDate() - currentDayIndex + (currentDayIndex === 0 ? -6 : 1));
  
      // Dias da semana em português
      const weekDays = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
  
      let daysHTML = "";
  
      // Gerar os próximos 7 dias
      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(startOfWeek);
        currentDate.setDate(startOfWeek.getDate() + i);
  
        const dayName = weekDays[currentDate.getDay()];
        const dayNumber = currentDate.getDate();
        const monthNumber = currentDate.getMonth() + 1;
  
        daysHTML += `
          <div>
            <span class="day">${dayName}</span>
            <span class="date">${dayNumber.toString().padStart(2, "0")}/${monthNumber.toString().padStart(2, "0")}</span>
          </div>
        `;
      }
  
      daysElement.innerHTML = daysHTML;
    }
  
    generateWeek();
  });

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
