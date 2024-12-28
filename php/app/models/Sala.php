<?php
require '../config/database.php';

class Sala
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function listar()
    {
        $sql = "SELECT * FROM salas";
        $result = $this->conn->query($sql);

        $salas = [];
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $salas[] = $row;
            }
        }
        return $salas;
    }

    public function adicionar($nome_salas, $capacidade)
    {
        $sql = "INSERT INTO salas (nome_salas, capacidade) VALUES (?, ?)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("si", $nome_salas, $capacidade);
        return $stmt->execute();
    }

    public function editar($id, $nome_salas, $capacidade)
    {
        $sql = "UPDATE salas SET nome_salas = ?, capacidade = ? WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("sii", $nome_salas, $capacidade, $id);
        return $stmt->execute();
    }

    public function excluir($id)
    {
        $sql = "DELETE FROM salas WHERE id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }
}
?>
