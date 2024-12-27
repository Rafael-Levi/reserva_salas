<?php

class Agendamento
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function listarPorSalaEData($id_sala, $data_agendamento)
    {
        $sql = "SELECT * FROM agendamentos WHERE id_sala = ? AND data_agendamento = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("is", $id_sala, $data_agendamento); // 'i' para id_sala (int), 's' para data_agendamento (string)
        $stmt->execute();
        $result = $stmt->get_result();

        $agendamentos = [];
        while ($row = $result->fetch_assoc()) {
            $agendamentos[] = $row;
        }

        return $agendamentos;
    }

    public function listarReservas()
    {
        $sql = "SELECT agendamentos.id,
                        agendamentos.nome,
                        agendamentos.funcao,
                        agendamentos.data_agendamento,
                        agendamentos.horario_inicio,
                        agendamentos.horario_fim, 
                        salas.nome 
                FROM agendamentos 
                LEFT JOIN salas 
                ON agendamentos.id_sala = salas.id;";
        
        $result = $this->conn->query($sql);
        $reservas = [];
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $reservas[] = $row;
            }
        }
        return $reservas;

    }

    public function verificarHorario($id_sala, $data_agendamento, $horario_inicio, $horario_fim) 
    {
        $sql = "SELECT COUNT(*) AS total FROM agendamentos 
                WHERE id_sala = ? 
                AND data_agendamento = ? 
                AND ((horario_inicio < ? AND horario_fim > ?) OR (horario_inicio < ? AND horario_fim > ?))";

        $stmt = $this->conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Erro na preparação da query: " . $this->conn->error);
        }

        $stmt->bind_param("isssss", $id_sala, $data_agendamento, $horario_fim, $horario_inicio, $horario_inicio, $horario_fim);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();

        return $row['total'] > 0; // Retorna true se existir algum conflito, false caso contrário
    }

    public function adicionar($id_sala,$nome, $funcao, $matricula, $data_agendamento, $horario_inicio, $horario_fim, $personalizado)
    {
        $sql = "INSERT INTO agendamentos (id_sala,nome,funcao,matricula, data_agendamento, horario_inicio, horario_fim, personalizado)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    
        $stmt = $this->conn->prepare($sql);
    
        if ($stmt === false) {
            error_log("Erro ao preparar a query: " . $this->conn->error);
            throw new Exception("Erro ao preparar a query");
        }
    
        $stmt->bind_param(
            "iisssssi",
            $id_sala,
            $nome,
            $funcao,
            $matricula,
            $data_agendamento,
            $horario_inicio,
            $horario_fim,
            $personalizado
        );
    
        if (!$stmt->execute()) {
            error_log("Erro ao executar a query: " . $stmt->error);
            return false;
        }
    
        return true;
    }
  
    public function excluir($id)
    {
        $sql = "DELETE FROM agendamentos WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }
}
?>