<?php

require_once __DIR__ . '/../models/Agendamento.php';

class AgendamentoController
{
    private $agendamento;

    public function __construct($db)
    {
        $this->agendamento = new Agendamento($db);
    }

    public function listarAgendamentos()
    {
        $id_sala = isset($_GET['sala_id']) ? intval($_GET['sala_id']) : 0;
        $data_agendamento = isset($_GET['data_agendamento']) ? $_GET['data_agendamento'] : null;

        // Validação para garantir que 'data_agendamento' está no formato correto
        if (!$data_agendamento || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $data_agendamento)) {
            echo json_encode(['error' => 'Data_agendamento inválida ou não fornecida']);
            return;
        }

        $agendamentos = $this->agendamento->listarPorSalaEData($id_sala, $data_agendamento);
        echo json_encode($agendamentos);
    }

    public function adicionarAgendamento()
    {
        $data = json_decode(file_get_contents('php://input'), true);

        $rawInput = file_get_contents('php://input');

        error_log("Dados brutos recebidos: " . $rawInput);

        $data = json_decode($rawInput, true);
    
        // Adicione esta validação para identificar problemas na entrada
        if (!$data) {
            echo json_encode(["success" => false, "message" => "Nenhum dado recebido ou formato inválido."]);
            return;
        }
    
        // Verifica se todas as chaves obrigatórias estão presentes
        if (
            !isset($data['sala_id'], $data['data_agendamento'], $data['horario_inicio'], $data['horario_fim'], $data['personalizado'])
        ) {
            echo json_encode(["success" => false, "message" => "Dados incompletos fornecidos."]);
            return;
        }
    
        // Inicializa as variáveis com os dados recebidos
        $id_sala = $data['sala_id'];
        $data_agendamento = $data['data_agendamento'];
        $horario_inicio = $data['horario_inicio'];
        $horario_fim = $data['horario_fim'];
        $personalizado = $data['personalizado'] ? 1 : 0;
    
        if ($this->agendamento->adicionar($id_sala, $data_agendamento, $horario_inicio, $horario_fim, $personalizado)) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false, "message" => "Erro ao adicionar agendamento"]);
        }
    }   
    

    public function excluirAgendamento()
    {
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;

        if ($this->agendamento->excluir($id)) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false, "message" => "Erro ao excluir agendamento"]);
        }
    }
}
?>