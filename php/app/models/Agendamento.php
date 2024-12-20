<?php

class Agendamento
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function listarPorSalaEData($id_sala, $data)
    {
        $sql = "SELECT * FROM agendamentos WHERE id_sala = ? AND data = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("is", $id_sala, $data); // 'i' para id_sala (int), 's' para data (string)
        $stmt->execute();
        $result = $stmt->get_result();

        $agendamentos = [];
        while ($row = $result->fetch_assoc()) {
            $agendamentos[] = $row;
        }

        return $agendamentos;
    }

    public function adicionar($id_sala, $data, $horario_inicio, $horario_fim,$personalizado)
    {
        $sql = "INSERT INTO agendamentos (id_sala, data, horario_inicio, horario_fim,personalizado) VALUES (?, ?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("isss", $id_sala, $data, $horario_inicio, $horario_fim,$personalizado);
        return $stmt->execute();
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