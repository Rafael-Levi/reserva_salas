<?php

require_once __DIR__ . '/../models/Sala.php';

class SalaController
{
    private $sala;

    public function __construct($db)
    {
        $this->sala = new Sala($db);
    }

    public function listarSalas()
    {
        echo json_encode($this->sala->listar());
    }

    public function adicionarSala()
    {
        // Captura os dados enviados via GET ou POST
        $data = json_decode(file_get_contents('php://input'), true);
    
        // Verifique se os dados vieram como parâmetros de URL
        if (empty($data)) {
            $data = $_GET;
        }
    
        // Extraia os valores ou defina valores padrão
        $nome = $data['nome'] ?? null;
        $capacidade = $data['capacidade'] ?? null;
    
        // Verifique se os valores obrigatórios estão presentes
        if (!$nome || !$capacidade) {
            echo json_encode(["success" => false, "message" => "Nome ou capacidade não foram informados"]);
            return;
        }
    
        // Insira os dados no banco
        if ($this->sala->adicionar($nome, (int) $capacidade)) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false, "message" => "Erro ao adicionar sala"]);
        }
    }
    

    public function editarSala()
    {
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'];
        $nome = $data['nome'];
        $capacidade = $data['capacidade'];

        if ($this->sala->editar($id, $nome, $capacidade)) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false, "message" => "Erro ao editar sala"]);
        }
    }

    public function excluirSala()
    {
        $id = $_GET['id'];

        if ($this->sala->excluir($id)) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false, "message" => "Erro ao excluir sala"]);
        }
    }
}
?>