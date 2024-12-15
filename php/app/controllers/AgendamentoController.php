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
        $data = isset($_GET['data']) ? $_GET['data'] : null;

        // Validação para garantir que 'data' está no formato correto
        if (!$data || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $data)) {
            echo json_encode(['error' => 'Data inválida ou não fornecida']);
            return;
        }

        $agendamentos = $this->agendamento->listarPorSalaEData($id_sala, $data);
        echo json_encode($agendamentos);
    }

    public function adicionarAgendamento()
    {
        $data = json_decode(file_get_contents('php://input'), true);
        $id_sala = $data['id_sala'];
        $data_agendamento = $data['data'];
        $horario_inicio = $data['horario_inicio'];
        $horario_fim = $data['horario_fim'];

        if ($this->agendamento->adicionar($id_sala, $data_agendamento, $horario_inicio, $horario_fim)) {
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
