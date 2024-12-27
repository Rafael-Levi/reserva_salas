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

    public function ListarReservas()
    {     
        echo json_encode($this->agendamento->listarReservas());   
    }

    public function verificarHorario() {
        $id_sala = isset($_GET['sala_id']) ? intval($_GET['sala_id']) : 0;
        $data_agendamento = isset($_GET['data_agendamento']) ? $_GET['data_agendamento'] : null;
        $horario_inicio = isset($_GET['horario_inicio']) ? $_GET['horario_inicio'] : null;
        $horario_fim = isset($_GET['horario_fim']) ? $_GET['horario_fim'] : null;

        // Validações básicas
        if (!$id_sala || !$data_agendamento || !$horario_inicio || !$horario_fim) {
            echo json_encode(['error' => 'Parâmetros inválidos ou faltando.']);
            return;
        }

        // Validação do formato da data
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $data_agendamento)) {
            echo json_encode(['error' => 'Formato de data_agendamento inválido.']);
            return;
        }

        // Validação do formato dos horários
        if (!preg_match('/^\d{2}:\d{2}/', $horario_inicio) || !preg_match('/^\d{2}:\d{2}/', $horario_fim)) {
            echo json_encode(['error' => 'Formato de horário inválido.']);
            return;
        }

        try {
            // Chama o model para verificar conflitos
            $conflito = $this->agendamento->verificarHorario($id_sala, $data_agendamento, $horario_inicio, $horario_fim);

            // Retorna a resposta em JSON
            echo json_encode(['conflito' => $conflito]);
        } catch (Exception $e) {
            echo json_encode(['error' => 'Erro ao verificar o horário.', 'details' => $e->getMessage()]);
        }
    }

    public function adicionarAgendamento()
    {
        // Decodifica os dados recebidos no corpo da requisição
        $data = json_decode(file_get_contents('php://input'), true);
    
        if (!$data || !isset($data['matricula'], $data['sala_id'], $data['data_agendamento'], $data['horario_inicio'], $data['horario_fim'], $data['personalizado'])) {
            echo json_encode(["success" => false, "message" => "Dados incompletos ou inválidos fornecidos."]);
            return;
        }
    
        // Dados iniciais
        $matricula = $data['matricula'];
        $matUrl = "http://ceneged150536.protheus.cloudtotvs.com.br:1739/rest/fluigepi/getSRA?RA_MAT=$matricula";
    
        // Configuração do cURL para consultar a API externa
        $ch = curl_init($matUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: Basic YWRtaW46QEAyMDI0Y25n',
        ]);
    
        // Chamada à API
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
    
        if (curl_errno($ch)) {
            echo json_encode(["success" => false, "message" => "Erro na requisição cURL: " . curl_error($ch)]);
            return;
        }
    
        if ($httpCode !== 200) {
            echo json_encode(["success" => false, "message" => "Erro HTTP na API externa: código $httpCode"]);
            return;
        }
    
        $apiData = json_decode($response, true);
    
        // Valida a estrutura do JSON retornado
        if (
            !$apiData ||
            !isset($apiData['FUNCIONARIOS'][0]['RA_MAT'], $apiData['FUNCIONARIOS'][0]['RA_NOME'], $apiData['FUNCIONARIOS'][0]['RA_DESCFUN'])
        ) {
            echo json_encode(["success" => false, "message" => "Matrícula inválida."]);
            return;
        }
    
        // Dados retornados da API
        $funcionario = $apiData['FUNCIONARIOS'][0];
        $nome = $funcionario['RA_NOME'];
        $funcao = $funcionario['RA_DESCFUN'];
    
        // Adiciona o agendamento no banco
        $id_sala = $data['sala_id'];
        $data_agendamento = $data['data_agendamento'];
        $horario_inicio = $data['horario_inicio'];
        $horario_fim = $data['horario_fim'];
        $personalizado = $data['personalizado'] ? 1 : 0;
    
        if ($this->agendamento->adicionar($id_sala, $nome, $funcao, $matricula, $data_agendamento, $horario_inicio, $horario_fim, $personalizado)) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false, "message" => "Erro ao adicionar agendamento no banco de dados."]);
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