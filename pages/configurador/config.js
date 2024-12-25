

//Query para o endpoint cfg
//SELECT agendamentos.data_agendamento,agendamentos.horario_inicio,agendamentos.horario_fim, salas.nome 
//FROM agendamentos 
//LEFT JOIN salas 
//ON agendamentos.id_sala = salas.id;

fetch(url)
  .then(response => response.json())
  .then(reservas => {
    console.log("Agendamentos recebidos:", reservas);

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
      card.className = "container-reservas";
    
      card.innerHTML = `
      
        <section>
            <h2>Reservas Atuais</h2>
            <input type="text" placeholder="Buscar reservas...">
            <table>
                <thead>
                    <tr>
                        <th>Sala</th>
                        <th>Data</th>
                        <th>Horário</th>
                        <th>Reservado por</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Sala 1</td>
                        <td>2024-12-14</td>
                        <td>14:00 - 16:00</td>
                        <td>João Silva</td>
                        <td class="actions">
                            <button class="btn">Editar</button>
                            <button class="btn-danger">Excluir</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </section>

      `;
    
      container.appendChild(card);
    });
    
  })
  .catch(error => {
    console.error("Erro ao carregar as salas:", error);
    const container = document.getElementById("sala-cards-container");
    container.innerHTML = "<p>Erro ao carregar as salas. Tente novamente mais tarde.</p>";
  });
