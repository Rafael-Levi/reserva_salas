document.addEventListener("DOMContentLoaded", () => {
  generateWeek();

  const rhButton = document.getElementById("rh-button");
  const popup = document.getElementById("popup-rh");
  const closeButton = document.getElementById("close-popup-rh");
  const form = document.getElementById("registration-form-rh");
 
  rhButton.addEventListener("click", () => {
    popup.style.display = "flex";
    popup.body.style.overflow = "hidden";
  });
 
  closeButton.addEventListener("click", () => {
    popup.style.display = "none";
    popup.body.style.overflow = "auto"; 
  });
 

  form.addEventListener("submit", (event) => {
    event.preventDefault();
 
    const mat = document.getElementById("mat-rh").value.trim();
    const password = document.getElementById("senha-rh").value.trim();
 
    if (mat == 'rafael' && password == '1234') {
      alert("Cadastro validado com sucesso!");
      window.location.href = "../RH/RH.html"; // Redireciona para outra página
    } else {
      alert("Por favor, preencha todos os campos.");
    }
  });
});

function generateWeek() {
  const daysElement = document.getElementById("days");
  const today = new Date();
  const currentDayIndex = today.getDay();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - currentDayIndex + (currentDayIndex === 0 ? -6 : 1));

  const weekDays = ["","SEG", "TER", "QUA", "QUI","SEX"];
  let daysHTML = "";

  for (let i = 0; i < 5; i++) {
    const currentDate = new Date(startOfWeek);
    currentDate.setDate(startOfWeek.getDate() + i);

    const dayName = weekDays[currentDate.getDay()];
    const dayNumber = currentDate.getDate();
    const monthNumber = currentDate.getMonth() + 1;

    daysHTML += `
      <div>
        <span class="dia">${dayName}</span>
        <span class="date">${dayNumber.toString().padStart(2, "0")}/${monthNumber.toString().padStart(2, "0")}</span>
      </div>
    `;
  }

  daysElement.innerHTML = daysHTML;
}

document.addEventListener("DOMContentLoaded", () => {
  const cfgButton = document.getElementById("cfg-button");
  const cfgClose = document.getElementById("close-popup-cfg");
  const cfgPopup = document.getElementById("popup-cfg");
  const submit = document.getElementById("registration")
 
  // Abre o pop-up
  cfgButton.addEventListener("click", () => {
    cfgPopup.style.display = "flex";
    cfgPopup.body.style.overflow = "hidden";
  });

  cfgClose.addEventListener("click", () => {
    cfgPopup.style.display = "none";
    cfgPopup.body.style.overflow = "auto"; 
  });

  // Valida o formulário e redireciona
    submit.addEventListener("submit", (event) => {
    event.preventDefault();

    const mat = document.getElementById("mat-cfg").value.trim();
    const senha = document.getElementById("senha-cfg").value.trim();

    if (mat == 'rafael' && senha == '1234') {
      window.alert("Cadastro validado com sucesso!");
      window.location.href = "../configurador/config.html";
    } else {
      alert("Por favor, preencha todos os campos.");
    }
  });
});

function openPopup() {
    document.getElementById("popup").style.display = "flex";
    document.body.style.overflow = "hidden"; 
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
    document.body.style.overflow = "auto"; 
}