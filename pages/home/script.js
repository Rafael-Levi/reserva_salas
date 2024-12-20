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

  const weekDays = ["", "SEG", "TER", "QUA", "QUI", "SEX"];
  let daysHTML = "";

  for (let i = 0; i < 5; i++) {
    const currentDate = new Date(startOfWeek);
    currentDate.setDate(startOfWeek.getDate() + i);

    const dayName = weekDays[currentDate.getDay()];
    const dayNumber = currentDate.getDate();
    const monthNumber = currentDate.getMonth() + 1;
    const formattedDate = `${currentDate.getFullYear()}-${String(monthNumber).padStart(2, "0")}-${String(dayNumber).padStart(2, "0")}`;

    daysHTML += `
      <div data-date="${formattedDate}" class="day">
        <span class="dia">${dayName}</span>
        <span class="date">${dayNumber.toString().padStart(2, "0")}/${monthNumber.toString().padStart(2, "0")}</span>
      </div>
    `;
  }

  daysElement.innerHTML = daysHTML;

  // Adiciona eventos de clique
  document.querySelectorAll(".day").forEach(dayElement => {
    dayElement.addEventListener("click", event => {
      const selectedDate = event.currentTarget.getAttribute("data-date");
      fetchAndUpdateCards(selectedDate);
    });
  });
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

function openPopup(id) {
  const popup = document.getElementById(`popup-${id}`);
  const button = document.getElementById(`btn-${id}`);
  if (popup && button) {
    popup.style.display = "flex";
    button.style.display = "none"; // Esconde o botão "Personalizar"
  }
}

function closePopup(id) {
  const popup = document.getElementById(`popup-${id}`);
  const button = document.getElementById(`btn-${id}`);
  if (popup && button) {
    popup.style.display = "none";
    button.style.display = "block"; // Mostra o botão "Personalizar" novamente
  }
}


function openPopupPersonalisarHorario(id) {
  const popup = document.getElementById(`popup-perso-${id}`);
  const button = document.getElementById(`btn-perso-${id}`);
  if (popup && button) {
    popup.style.display = "flex";
    button.style.display = "none"; // Esconde o botão "Personalizar"
  }
}

function closePopupPersonalisarHorario(id) {
  const popup = document.getElementById(`popup-perso-${id}`);
  const button = document.getElementById(`btn-perso-${id}`);
  if (popup && button) {
    popup.style.display = "none";
    button.style.display = "block"; // Mostra o botão "Personalizar" novamente
  }
}

function fetchAndUpdateCards(selectedDate) {
  // Seleciona todos os cartões de sala
  const cards = document.querySelectorAll(".card");

  // Itera sobre cada cartão de sala para buscar agendamentos por ID
  cards.forEach(card => {
    const salaId = card.querySelector(".time-slot").getAttribute("data-sala-id");

    // Endpoint para buscar os agendamentos com base na sala e na data selecionada
    const url = `../../php/app/router.php?endpoint=agendamentos&sala_id=${salaId}&data=${selectedDate}`;

    fetch(url)
      .then(response => response.json())
      .then(agendamentos => {
        console.log(`Agendamentos recebidos para a sala ${salaId}:, agendamentos`);

        // Seleciona os botões de horários dentro do cartão
        const buttons = card.querySelectorAll(".time-slot");

        buttons.forEach(button => {
          // Obtém o horário do botão (exemplo: "08:00")
          const buttonTimeIni = button.getAttribute("data-ini");
          const buttonTimeFin = button.getAttribute("data-fin");


          // Verifica se o horário está na lista de agendamentos
          const isReserved = agendamentos.some(
            item => item.horario_inicio.substring(0, 5) === buttonTimeIni && 
            item.horario_fim.substring(0, 5) === buttonTimeFin);

          const isPerso = agendamentos.some(itemper => {
            if (itemper.personalizado == 1) {
              const startPerso = itemper.horario_inicio.substring(0, 5);
              const endPerso = itemper.horario_fim.substring(0, 5);

              // Verifique se o intervalo de tempo está dentro do personalizado
              return buttonTimeIni >= startPerso && buttonTimeFin <= endPerso;
            }
            return false;
          });

          // Atualiza o estado do botão com base em reservas regulares e personalizadas
          if (isReserved || isPerso) {
            button.classList.add("reserved");
            button.disabled = true;
          } else {
            button.classList.remove("reserved");
            button.disabled = false;
          }
        });
      })
      .catch(error => {
        console.error(`Erro ao buscar agendamentos para a sala ${salaId}:, error`);
    });
  });
}


const urlSalas = '../../php/app/router.php?endpoint=salas';

fetch(urlSalas)
  .then(response => response.json())
  .then(salas => {
    console.log("Salas recebidas:", salas);

    const container = document.getElementById("sala-cards-container");

    // Verifica se existem salas
    if (salas.length === 0) {
      container.innerHTML = "<p>Nenhuma sala cadastrada.</p>";
      return;
    }

    // Limpa o contêiner antes de adicionar os elementos
    container.innerHTML = "";

    // Cria os elementos de sala
    salas.forEach(sala => {
      const card = document.createElement("div");
      card.className = "card";
    
      card.innerHTML = `
      <div class="card-left">
          <img src="${sala.foto}" alt="${sala.nome}" class="card-image">
          <h3 class="card-title">${sala.nome}</h3>
          <p class="card-description">
            Capacidade: ${sala.capacidade} Pessoas
          </p>
      </div>
        <div class="card-right">
          <button onclick="openPopup(${sala.id})" id="btn-${sala.id}" class="time-slot" data-sala-id="${sala.id}" data-ini="08:00" data-fin="09:00">08:00 - 09:00</button>
          <button onclick="openPopup(${sala.id})" id="btn-${sala.id}" class="time-slot" data-sala-id="${sala.id}" data-ini="09:00" data-fin="10:00">09:00 - 10:00</button>
          <button onclick="openPopup(${sala.id})" id="btn-${sala.id}" class="time-slot" data-sala-id="${sala.id}" data-ini="10:00" data-fin="11:00">10:00 - 11:00</button>
          <button onclick="openPopup(${sala.id})" id="btn-${sala.id}" class="time-slot" data-sala-id="${sala.id}" data-ini="11:00" data-fin="12:00">11:00 - 12:00</button>
          <button onclick="openPopup(${sala.id})" id="btn-${sala.id}" class="time-slot" data-sala-id="${sala.id}" data-ini="12:00" data-fin="13:00">12:00 - 13:00</button>
          <button onclick="openPopup(${sala.id})" id="btn-${sala.id}" class="time-slot" data-sala-id="${sala.id}" data-ini="13:00" data-fin="14:00">13:00 - 14:00</button>
          <button onclick="openPopup(${sala.id})" id="btn-${sala.id}" class="time-slot" data-sala-id="${sala.id}" data-ini="14:00" data-fin="15:00">14:00 - 15:00</button>
          <button onclick="openPopup(${sala.id})" id="btn-${sala.id}" class="time-slot" data-sala-id="${sala.id}" data-ini="15:00" data-fin="16:00">15:00 - 16:00</button>
          <button onclick="openPopup(${sala.id})" id="btn-${sala.id}" class="time-slot" data-sala-id="${sala.id}" data-ini="16:00" data-fin="17:00">16:00 - 17:00</button>
          <div class="div-per">
            <button class="time-slot-perso" onclick="openPopupPersonalisarHorario(${sala.id})" id="btn-perso-${sala.id}">Personalizar</button>
            <div class="popup-personalizar" id="popup-perso-${sala.id}">
              <table class="popup-personalizar-content">
                <thead>
                    <tr class="table-header">
                        <th class="table-header-l">Horário de Início</th>
                        <th class="table-header-r">Horário de Término</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><input type="time"></td>
                        <td><input type="time"></td>
                        <td class="actions">
                            <button class="btn">Salvar</button>
                            <button class="bnt-danger" onclick="closePopupPersonalisarHorario(${sala.id})">Sair</button>
                        </td>
                    </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div> 
        </div>

      <div id="popup-${sala.id}" class="popup">
        <div class="popup-content">
          <h2>Reservar horário</h2>
          <form>
              <label for="matrícula">Matrícula</label>
              <input type="password" id="matricula" placeholder="Digite sua matrícula" required>
              <button type="submit" class="btn-submit">Confirmar Reserva</button>
              <button type="button" class="btn-close" onclick="closePopup(${sala.id})">Cancelar</button>
          </form>
        </div>
      </div>
      `;
    
      container.appendChild(card);
    });
    
  })
  .catch(error => {
    console.error("Erro ao carregar as salas:", error);
    const container = document.getElementById("sala-cards-container");
    container.innerHTML = "<p>Erro ao carregar as salas. Tente novamente mais tarde.</p>";
  });
