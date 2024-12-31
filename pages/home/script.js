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

  // Ajusta o dia inicial para evitar finais de semana
  while (today.getDay() === 0 || today.getDay() === 6) {
      today.setDate(today.getDate() + 1);
  }

  const weekDays = ["", "SEG", "TER", "QUA", "QUI", "SEX"];
  let daysHTML = "";

  for (let i = 0, daysAdded = 0; i < 5; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + daysAdded);

      // Pula finais de semana no cálculo do dia
      while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
          currentDate.setDate(currentDate.getDate() + 1);
          daysAdded++;
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

      daysAdded++; // Incrementa o contador apenas após verificar o final de semana
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


function validarReserva(sala_id,data_agendamento,horario_inicio,horario_fim){
  verficarHorarioUrl = `../../php/app/router.php?endpoint=verificar_horario&sala_id=${sala_id}&data_agendamento=${data_agendamento}&horario_inicio=${horario_inicio}&horario_fim=${horario_fim}`
  
  fetch(verficarHorarioUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erro HTTP! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data && typeof data.conflito !== "undefined") {
            if (data.conflito) {
                alert("Este horário já está ocupado. Por favor, escolha outro horário.");
            } else {
                return false;
            }
        } else {
            throw new Error("Formato de resposta inválido.");
        }
    })
    .catch(error => {
        console.error("Erro ao verificar disponibilidade de horário:", error);
        alert("Erro ao verificar a disponibilidade do horário. Tente novamente.");
    });



}





function reservarSala(id) {
  const mat = document.getElementById(`mat-${id}`)?.value.trim();
  const button = document.getElementById(`btn-${id}`);
  if (!mat) {
      alert("Por favor, preencha o campo matrícula corretamente.");
      return;
  }
  if (!button) {
      console.error(`Botão com id btn-${id} não encontrado.`);
      return;
  }
  const nome_salas = document.getElementsByClassName("card-title")[0].textContent;
  const sala_id = button.getAttribute("data-sala-id");
  const horario_inicio = button.getAttribute("data-ini");
  const horario_fim = button.getAttribute("data-fin");
  const personalizado = 0;

  const selectedDay = document.querySelector(".day.selected");
  const data_agendamento = selectedDay ? selectedDay.getAttribute("data-date") : null;
  
  if (!data_agendamento) {
      alert("Por favor, selecione uma data válida no calendário.");
      return;
  }

  alert(`Sala:${nome_salas} agendada para:${data_agendamento} | início: ${horario_inicio} | fim: ${horario_fim}`);

  const url = `../../php/app/router.php?endpoint=adicionar_agendamento&sala_id=${sala_id}&matricula=${mat}&data_agendamento=${data_agendamento}&horario_inicio=${horario_inicio}&horario_fim=${horario_fim}&personalizado=${personalizado}`;

  fetch(url, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
          sala_id: sala_id,
          matricula:mat,
          data_agendamento: data_agendamento,
          horario_inicio: horario_inicio,
          horario_fim: horario_fim,
          personalizado: 0,
      }),
  })  
      .then(response => {
          if (!response.ok) {
              throw new Error(`Erro HTTP! status: ${response.status}`);
          }else{
            location.reload();
          }
          return response.json();
      })
      .then(data => {
          console.log("Agendamento adicionado com sucesso:", data);
          alert("Agendamento realizado com sucesso!");
      })
      
} 



function salvarHorarioPersonalizado(sala_id) {
  // Seleciona os inputs de horário de início e término
  const popup = document.getElementById(`popup-perso-${sala_id}`);
  const inputs = popup.querySelectorAll("input[type='time']");
  const mat = document.getElementById(`descricao-perso-${sala_id}`)?.value.trim();

  
  if (!inputs || inputs.length < 2) {
    alert("Por favor, preencha os horários de início e término corretamente.");
    return;
  }

  const horario_inicio = inputs[0].value;
  const horario_fim = inputs[1].value;

  // Captura a data selecionada no calendário
  const selectedDay = document.querySelector(".day.selected");
  const data_agendamento = selectedDay ? selectedDay.getAttribute("data-date") : null;

  if (!data_agendamento) {
    alert("Por favor, selecione uma data válida no calendário.");
    return;
  }
  
  if (!data_agendamento) {
    alert("Por favor, selecione uma data válida no calendário.");
    return;
  }
  // Validação dos horários preenchidos
  if (!horario_inicio || !horario_fim || horario_inicio >= horario_fim) {
    alert("Por favor, insira horários válidos.");
    return;
  }

  validarReserva(sala_id, data_agendamento, horario_inicio, horario_fim);
    
      if (!validarReserva) {
        alert("Já existe um agendamento nesse horário. Escolha outro horário.");
      }else{
        // Se não houver conflito, salva o agendamento
        const urlSalvar = `../../php/app/router.php?endpoint=adicionar_agendamento`;

        fetch(urlSalvar, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sala_id: sala_id,
            matricula:mat,
            data_agendamento: data_agendamento,
            horario_inicio: horario_inicio,
            horario_fim: horario_fim,
            personalizado: 1,
          }),
        })
          .then(data => {
            console.log("Agendamento personalizado adicionado com sucesso:", data);
            alert("Agendamento realizado com sucesso!");
            closePopupPersonalisarHorario(sala_id); // Fecha o popup após salvar
          })
          .catch(error => {
            console.error("Erro ao adicionar o agendamento personalizado:", error);
            alert("Erro ao realizar o agendamento. Tente novamente.");
          });
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
        console.log(`Agendamentos recebidos para a sala ${salaId}:, ${agendamentos}`);

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
          <img src="${sala.foto}" alt="${sala.nome_salas}" class="card-image">
          <h3 class="card-title">${sala.nome_salas}</h3>
          <p class="card-description">
            Capacidade: ${sala.capacidade} Pessoas
          </p>
      </div>
      <div class="card-right">
        <div class="horario">
          ${horarios.map((horario, index) => `
          
            <button
              onclick="openPopup(${sala.id}${index})"
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
                  <input type="text" id="mat-${sala.id}${index}" placeholder="Digite sua matrícula" required>
                  <button type="submit" class="btn-submit" onclick="reservarSala(${sala.id}${index})">Confirmar Reserva</button>
                  <button type="button" class="btn-close" onclick="closePopup(${sala.id}${index})">Cancelar</button>
              </form>
            </div>
          </div>
          `).join('')}

<div class="div-per">
  <button 
    class="time-slot-perso" 
    onclick="openPopupPersonalisarHorario(${sala.id})" 
    id="btn-perso-${sala.id}">
    Personalizar
  </button>
  <div class="popup-personalizar" id="popup-perso-${sala.id}" style="display: none;">
    <table class="popup-personalizar-content">
      <thead>
        <tr class="table-header">
          <th class="table-header-l">Horário de Início</th>
          <th class="table-header-r">Horário de Término</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <input type="time" id="inicio-perso-${sala.id}" required>
          </td>
          <td>
            <input type="time" id="fim-perso-${sala.id}" required>
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <label for="descricao-perso-${sala.id}">Matricula:</label>
            <input type="text" id="descricao-perso-${sala.id}" placeholder="Digite sua matrícula" required>
          </td>
        </tr>
        <tr>
          <td colspan="2" class="actions">
            <button class="btn" onclick="salvarHorarioPersonalizado(${sala.id})">Salvar</button>
            <button class="bnt-danger" onclick="closePopupPersonalisarHorario(${sala.id})">Sair</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>


      `;
    
      container.appendChild(card);
    });
    
    const firstDayElement = document.querySelector(".day.selected");
    const firstSelectedDate = firstDayElement.getAttribute("data-date");
    fetchAndUpdateCards(firstSelectedDate);
  })
  .catch(error => {
    console.error("Erro ao carregar as salas:", error);
    const container = document.getElementById("sala-cards-container");
    container.innerHTML = "<p>Erro ao carregar as salas. Tente novamente mais tarde.</p>";
  });
