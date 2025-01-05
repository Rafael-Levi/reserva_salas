const url = "../../php/app/router.php?endpoint=listar_reservas";


fetch(url)
  .then(response => response.json())
  .then(reservas => {
    console.log("Agendamentos recebidos:", reservas);

    const container = document.getElementById("content-agendamento");

    // Verifica se existem reservas
    if (reservas.length === 0) {
      container.innerHTML = "<tr><td colspan='5'>Nenhuma reserva cadastrada.</td></tr>";
      return;
    }

    // Limpa o conteúdo do tbody
    container.innerHTML = "";

    // Itera sobre as reservas e cria as linhas da tabela
    reservas.forEach(reserva => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <p class="id-${reserva.id}" style="display: none;">${reserva.id}</p>
        <td>${reserva.nome_salas}</td>
        <td id="data-agendamento-${reserva.id}">${reserva.data_agendamento}</td>
        <td>${reserva.horario_inicio} - ${reserva.horario_fim}</td>
        <td>${reserva.nome_users}</td>
        <td status="${reserva.status}"></td>
        <td class="actions">
          <button class="btn-edit" id="btn-edit-${reserva.id}" onclick="openPopup(${reserva.id})">Editar</button>
          <button onclick="excluir_registro(${reserva.id})" class="btn-excluir" id="btn-excluir=${reserva.id}">Excluir</button>
        </td>


        <div id="popup-${reserva.id}" class="popup">
          <div class="popup-content">
            <h3>Alterar Reserva</h3>
            <form id="popup-form">
              <label for="sala-nome">Nome da Sala:</label>
              <select id="sala-nome" name="sala-nome" required>
                <option value="" disabled selected>Selecione uma sala</option>
                <option value="Eclipse">Eclipse</option>
                <option value="Beira-mar">Beira-mar</option>
                <option value="Por do sol">Por do sol</option>
                <option value="Energia positiva">Energia positiva</option>
                <option value="Inovar">Inovar</option>
                <option value="Sala treinamento">Sala treinamento</option>
              </select>
        
              <label for="horario-inicio">Horário de Início:</label>
              <input type="time" id="horario-inicio" name="horario-inicio" required>
        
              <label for="horario-fim">Horário de Fim:</label>
              <input type="time" id="horario-fim" name="horario-fim" required>
        
              <div class="popup-buttons">
                <button type="submit" class="btn-confirm" onclick="alterarReserva(${reserva.id})">Confirmar</button>
                <button type="button" class="btn-cancel" onclick="closePopup(${reserva.id})">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      `;

      container.appendChild(row);
    });
    atualizarStatus();
  })
  .catch(error => {
    console.error("Erro ao carregar as reservas:", error);
    const container = document.getElementById("content-agendamento");
    container.innerHTML = "<tr><td colspan='5'>Erro ao carregar as reservas. Tente novamente mais tarde.</td></tr>";
  });
