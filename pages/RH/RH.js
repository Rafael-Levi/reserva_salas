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

daysElement.innerHTML = daysHTML;

  
function openPopup() {
    document.getElementById("popup").style.display = "flex";
    document.body.style.overflow = "hidden"; 
}
  
function closePopup() {
    document.getElementById("popup").style.display = "none";
    document.body.style.overflow = "auto"; 
}
