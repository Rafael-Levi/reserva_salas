document.addEventListener("DOMContentLoaded", () => {
  const userClose = document.getElementById("close-popup-user");
  const submit = document.getElementById("registration-user");

  userClose.addEventListener("click", () => {
    window.location.href = "../home/index.html";
  });

  submit.addEventListener("submit", async (event) => {
    event.preventDefault();

    const mat = document.getElementById("mat-user").value.trim();

    if (!mat) {
      alert("Por favor, preencha a matrícula.");
      return;
    }

    const url = `../../php/app/router.php?endpoint=listar_reservas_user&matricula=${encodeURIComponent(mat)}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erro na requisição");
      }

      const data = await response.json();
      console.log("Resposta da API:", data);

      if (data.success === false) {
        alert(data.message || "Erro ao verificar a matrícula.");
        return;
      }

      alert("Acesso validado com sucesso!");
      closePopup(); // Fecha a popup
      carregarReservas(data.reservas || []);
    } catch (error) {
      console.error("Erro ao verificar a matrícula:", error);
      alert("Erro ao verificar a matrícula. Tente novamente.");
    }
  });
});

function closePopup() {
  const popup = document.getElementById("popup-user");
  if (popup) {
    popup.style.display = "none";
  }
}

function carregarReservas(reservas) {
  const container = document.getElementById("content-agendamento");

  if (reservas.length === 0) {
    container.innerHTML = "<tr><td colspan='5'>Nenhuma reserva cadastrada.</td></tr>";
    return;
  }

  container.innerHTML = "";

  reservas.forEach(reserva => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <p class="id-${reserva.id}" style="display: none;">${reserva.id}</p>
      <td>${reserva.nome_salas}</td>
      <td id="data-agendamento-${reserva.id}">${reserva.data_agendamento}</td>
      <td>${reserva.horario_inicio} - ${reserva.horario_fim}</td>
      <td>${reserva.nome_users}</td>
      <td class="status" style="display: none;">${reserva.status}</td>
      <td class="actions">
        <button class="checkin-btn" data-id="${reserva.id}">Check-in</button>
        <button class="delete-btn" data-id="${reserva.id}">Excluir</button>
      </td>
    `;
    container.appendChild(row);
  });

  configurarAcoes();
  atualizarStatus();
}

function configurarAcoes() {
  const rows = document.querySelectorAll('#content-agendamento tr');

  rows.forEach(row => {
    const checkinBtn = row.querySelector('.checkin-btn');
    const deleteBtn = row.querySelector('.delete-btn');

    checkinBtn.addEventListener('click', () => {
      const idEl = row.querySelector('p[class^="id-"]');
      const reservaId = idEl.className.split('-')[1];
      const dataAgendamentoEl = row.querySelector(`#data-agendamento-${reservaId}`);

      const dataAgendamento = dataAgendamentoEl.textContent.trim();

      const agora = new Date();
      const dataHoje = agora.toISOString().slice(0, 10); // Formato: YYYY-MM-DD

      const status = document.getElementsByClassName('status')
      // Verificar se o horário atual está dentro do intervalo e se a data é a de hoje
      if (dataAgendamento === dataHoje) {
        console.log(`Check-in para a reserva ID: ${reservaId}`);
        checkinUrl = `../../php/app/router.php?endpoint=check&id=${reservaId}`;


        fetch(checkinUrl, {
          method: "PUT", 
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Erro HTTP! Status: ${response.status}`);
            }
            return response.json(); // Lê a resposta em JSON
          })
          .then((data) => {
            if (data.success) { // Supondo que o endpoint retorna um JSON com {success: true}
              alert("Check-in realizado com sucesso!");
              row.querySelector('.actions').innerHTML = ""; 
              console.log(`Check-in válido realizado para a reserva ID: ${reservaId}`);
              if(status === 1){
                row.style.backgroundColor = "#d4edda";
              }
              
            } else {
              alert("Erro ao fazer check-in");
            }
          })
          .catch((error) => {
            console.error("Erro ao fazer check-in:", error);
            alert("Erro ao fazer check-in. Tente novamente.");
          });


      } else {
        alert("Check-in inválido! Fora do horário do agendamento.");
        console.log(`Check-in inválido para a reserva ID: ${reservaId}`);
      }
    });

    deleteBtn.addEventListener('click', () => {
      const reservaId = deleteBtn.getAttribute('data-id');
      console.log(`Reserva ID: ${reservaId} excluída.`);
      row.remove(); // Remove a linha da tabela
    });
  });
}

function atualizarStatus(){
  const status = document.getElementsByClassName('status')
  if(status === 1){
    row.style.backgroundColor = "#d4edda";
  }

}

// Event listeners para os botões
document.getElementById("content-agendamento").addEventListener("click", function(event) {
  if (event.target.classList.contains("delete-btn")) {
    const reservaId = event.target.getAttribute("data-id");
    const excluirUrl = `../../php/app/router.php?endpoint=excluir_agendamento&id=${reservaId}`;

    // Faz a requisição para excluir o agendamento
    fetch(excluirUrl, {
      method: "DELETE", // Indica o método DELETE para uma exclusão lógica
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        return response.json(); // Lê a resposta em JSON
      })
      .then((data) => {
        if (data.success) { // Supondo que o endpoint retorna um JSON com {success: true}
          alert("Agendamento excluído com sucesso!");
          location.reload(); // Recarrega a página
        } else {
          alert("Erro ao excluir o agendamento.");
        }
      })
      .catch((error) => {
        console.error("Erro ao excluir o agendamento:", error);
        alert("Ocorreu um erro ao tentar excluir o agendamento. Tente novamente.");
      });
    
  }
});

