const url = "../../php/app/router.php?endpoint=listar_reservas";


function excluir_registro(id) {
  // Obtém o ID do agendamento pelo nome da classe
  const idElement = document.querySelector(`.id-${id}`);
  if (!idElement) {
    alert("Elemento de agendamento não encontrado!");
    return;
  }

  const id_agendamento = idElement.textContent.trim(); // Remove espaços desnecessários

  // Configura a URL para a exclusão
  const excluirUrl = `../../php/app/router.php?endpoint=excluir_agendamento&id=${id_agendamento}`;

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

function openPopup(id) {
  popup = document.getElementById(`popup-${id}`).style.display = 'block';

}

function closePopup(id) {
  document.getElementById(`popup-${id}`).style.display = 'none';
}



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
        <td>${reserva.data_agendamento}</td>
        <td>${reserva.horario_inicio} - ${reserva.horario_fim}</td>
        <td>${reserva.nome_users}</td>
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
                <button type="submit" class="btn-confirm">Confirmar</button>
                <button type="button" class="btn-cancel" onclick="closePopup(${reserva.id})">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      `;

      container.appendChild(row);
    });
  })
  .catch(error => {
    console.error("Erro ao carregar as reservas:", error);
    const container = document.getElementById("content-agendamento");
    container.innerHTML = "<tr><td colspan='5'>Erro ao carregar as reservas. Tente novamente mais tarde.</td></tr>";
  });
