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
      <td status="${reserva.status}"></td>
    `;
    container.appendChild(row);
  });

  atualizarStatus();
}

function atualizarStatus() {
  const rows = document.querySelectorAll('#content-agendamento tr');

  rows.forEach(row => {
    const idEl = row.querySelector('p[class^="id-"]');
    const reservaId = idEl.className.split('-')[1];
    const dataAgendamentoEl = row.querySelector(`#data-agendamento-${reservaId}`);
    const horarioCell = row.querySelector('td:nth-child(3)');
    const statusCell = row.querySelector('td[status]');

    if (!dataAgendamentoEl || !horarioCell || !statusCell) {
      console.error(`Dados incompletos para a reserva ID ${reservaId}`);
      return;
    }

    const dataAgendamento = dataAgendamentoEl.textContent.trim();
    const [horarioInicio, horarioFim] = horarioCell.textContent.split(" - ").map(h => h.trim());
    const agora = new Date();
    const fimAgendamento = new Date(`${dataAgendamento}T${horarioFim}`);

    let statusTexto = "";
    if (statusCell.getAttribute('status') === "0") {
      if (fimAgendamento > agora) {
        statusTexto = "Pendente";
      } else {
        statusTexto = "Ausente";
        row.style.backgroundColor = "#e29385da";
      }
    } else {
      statusTexto = "Presente";
      row.style.backgroundColor = "#d4edda";
    }

    statusCell.textContent = statusTexto;
  });
}
