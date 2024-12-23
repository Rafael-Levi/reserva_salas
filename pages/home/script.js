const urlSalas = '../../php/app/router.php?endpoint=salas';
const horarios = [
  { ini: "08:00", fin: "09:00" },
  { ini: "09:00", fin: "10:00" },
  { ini: "10:00", fin: "11:00" },
  { ini: "11:00", fin: "12:00" },
  { ini: "12:00", fin: "13:00" },
  { ini: "13:00", fin: "14:00" },
  { ini: "14:00", fin: "15:00" },
  { ini: "15:00", fin: "16:00" },
  { ini: "16:00", fin: "17:00" }

]


document.addEventListener("DOMContentLoaded", () => {
  const daysElement = document.getElementById("days");
  const today = new Date();
  let currentDayIndex = today.getDay();

  if (currentDayIndex === 6) {
      today.setDate(today.getDate() + 2); 
  } else if (currentDayIndex === 0) {
      today.setDate(today.getDate() + 1); 
  }

  const weekDays = ["", "SEG", "TER", "QUA", "QUI", "SEX"];
  let daysHTML = "";

  for (let i = 0; i < 5; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      if (currentDate.getDay() === 6) { 
          currentDate.setDate(currentDate.getDate() + 2);
      } else if (currentDate.getDay() === 0) { 
          currentDate.setDate(currentDate.getDate() + 1);
      }

      const dayName = weekDays[currentDate.getDay()];
      const dayNumber = currentDate.getDate();
      const monthNumber = currentDate.getMonth() + 1;
      const formattedDate = `${currentDate.getFullYear()}-${String(monthNumber).padStart(2, "0")}-${String(dayNumber).padStart(2, "0")}`;

      daysHTML += `
          <div data-date="${formattedDate}" class="day${i === 0 ? " selected" : ""}">
              <span class="dia">${dayName}</span>
              <span class="date">${dayNumber.toString().padStart(2, "0")}/${monthNumber.toString().padStart(2, "0")}</span>
          </div>
      `;
  }

  daysElement.innerHTML = daysHTML;

  // Seleciona o primeiro dia automaticamente e chama fetchAndUpdateCards
  const firstDayElement = document.querySelector(".day.selected");
  const firstSelectedDate = firstDayElement.getAttribute("data-date");
  fetchAndUpdateCards(firstSelectedDate);
  
  // Adiciona eventos de clique para os dias
  document.querySelectorAll(".day").forEach(dayElement => {
      dayElement.addEventListener("click", event => {
          document.querySelectorAll(".day").forEach(el => el.classList.remove("selected")); // Remove seleção
          event.currentTarget.classList.add("selected"); // Adiciona ao elemento clicado

          const selectedDate = event.currentTarget.getAttribute("data-date");
          fetchAndUpdateCards(selectedDate); 
      });
  });
});


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
    button.style.display = "none"; 
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

function reservarSala(id) {
  const mat = document.getElementById("mat").value.trim(); // Corrigir para buscar pelo id fixo

  if (mat === '1') {
      // Seleciona o botão clicado usando o id
      const button = document.getElementById(`btn-${id}`);
      if (!button) {
          console.error(`Botão com id btn-${id} não encontrado.`);
          return;
      }

      const sala_id = button.getAttribute("data-sala-id");
      const horario_inicio = button.getAttribute("data-ini");
      const horario_fim = button.getAttribute("data-fin");
      const personalizado = 0;
      // Captura a data selecionada no calendário
      const selectedDay = document.querySelector(".day.selected");
      const data_agendamento = selectedDay ? selectedDay.getAttribute("data-date") : null;

      if (!data_agendamento) {
          alert("Por favor, selecione uma data válida no calendário.");
          return;
      }

      console.log(`data selecionada: ${data_agendamento}, sala_id: ${sala_id}, horario_inicio: ${horario_inicio}, horario_fim: ${horario_fim}`);

    
      // Configura o URL para o endpoint
      const url = `../../php/app/router.php?endpoint=adicionar_agendamento&sala_id=${sala_id}&data=${data_agendamento}&horario_inicio=${horario_inicio}&horario_fim=${horario_fim}&personalizado=${personalizado}`;

      // Faz a requisição para o endpoint
      fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sala_id: sala_id, 
          data_agendamento: data_agendamento, 
          horario_inicio: horario_inicio, 
          horario_fim: horario_fim, 
          personalizado: 0
        }),
    })
          .then(data => {
              console.log("Agendamento adicionado com sucesso:", data);
              alert("Agendamento realizado com sucesso!");
          })
          .catch(error => {
            console.error("Erro ao adicionar o agendamento:", error);
            console.error("Detalhes do erro:", error.message);
            alert("Erro ao adicionar o agendamento. Verifique o console para mais detalhes.");
        });
  } else {
      alert("Por favor, preencha o campo matrícula corretamente.");
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
    const url = `../../php/app/router.php?endpoint=agendamentos&sala_id=${salaId}&data_agendamento=${selectedDate}`;

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
        <div class="horario">
          ${horarios.map((horario, index) => `
          
            <button 
              onclick="openPopup('${sala.id}${index}')" 
              id="btn-${sala.id}${index}" 
              class="time-slot" 
              data-sala-id="${sala.id}" 
              data-ini="${horario.ini}" 
              data-fin="${horario.fin}">
              ${horario.ini} - ${horario.fin}
            </button>
            
        
            

          <div id="popup-${sala.id}${index}" class="popup">
            <div class="popup-content">
              <h2>Reservar horário</h2>
              <form>
                  <label for="matrícula">Matrícula</label>
                  <input type="text" id="mat" placeholder="Digite sua matrícula" required>
                  <button type="submit" class="btn-submit" onclick="reservarSala(${sala.id}${index})">Confirmar Reserva</button>
                  <button type="button" class="btn-close" onclick="closePopup(${sala.id}${index})">Cancelar</button>
              </form>
            </div>
          </div>
          `).join('')}

        </div>
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

      `;
    
      container.appendChild(card);
    });
    
  })
  .catch(error => {
    console.error("Erro ao carregar as salas:", error);
    const container = document.getElementById("sala-cards-container");
    container.innerHTML = "<p>Erro ao carregar as salas. Tente novamente mais tarde.</p>";
  });
