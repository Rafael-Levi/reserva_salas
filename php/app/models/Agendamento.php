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

    public function adicionar($id_sala, $data_agendamento, $horario_inicio, $horario_fim, $personalizado)
    {
        $sql = "INSERT INTO agendamentos (id_sala, data_agendamento, horario_inicio, horario_fim, personalizado)
                VALUES (?, ?, ?, ?, ?)";
    
        $stmt = $this->conn->prepare($sql);
    
        if ($stmt === false) {
            error_log("Erro ao preparar a query: " . $this->conn->error);
            throw new Exception("Erro ao preparar a query");
        }
    
        $stmt->bind_param(
            "isssi",
            $id_sala,
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