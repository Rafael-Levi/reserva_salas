<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/controllers/SalaController.php';
require_once __DIR__ . '/controllers/AgendamentoController.php';

header('Content-Type: application/json; charset=utf-8'); // Define o tipo de resposta como JSON

// Conexão com o banco de dados
$conn = require __DIR__ . '/../config/database.php';
$salaController = new SalaController($conn);
$agendamentoController = new AgendamentoController($conn);

// Identifica o endpoint
$endpoint = $_GET['endpoint'] ?? ''; // Simplificação usando null coalescing operator

switch ($endpoint) {
    case 'salas': // GET: Listar salas
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $salaController->listarSalas();
        } else {
            http_response_code(405); // Método não permitido
            echo json_encode(["success" => false, "message" => "Método não permitido"]);
        }
        break;

    case 'adicionar_sala': // POST: Adicionar sala
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $salaController->adicionarSala();
        } else {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Método não permitido"]);
        }
        break;

    case 'editar_sala': // POST: Editar sala
        if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
            $salaController->editarSala();
        } else {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Método não permitido"]);
        }
        break;

    case 'excluir_sala': // POST: Excluir sala
        if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
            $salaController->excluirSala();
        } else {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Método não permitido"]);
        }
        break;

    case 'agendamentos': // GET: Listar agendamentos
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $agendamentoController->listarAgendamentos();
        } else {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Método não permitido"]);
        }
        break;
    
    case 'listar_reservas'; // GET: Listar reservas
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $agendamentoController->ListarReservas();
        } else {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Método não permitido"]);
        }
        break;

    case 'verificar_horario': // GET: Verificar se ja existe um horario
        if($_SERVER['REQUEST_METHOD'] === 'GET'){
            $agendamentoController->verificarHorario();
        }else{
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Método não permitido"]);
        }
        break;
        
    case 'adicionar_agendamento': // POST: Adicionar agendamento
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $agendamentoController->adicionarAgendamento();
        } else {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Método não permitido"]);
        }
        break;

    case 'excluir_agendamento': // POST: Excluir agendamento
        if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
            $agendamentoController->excluirAgendamento();
        } else {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Método não permitido"]);
        }
        break;

    default: // Endpoint inválido
        http_response_code(404); // Código de erro para recurso não encontrado
        echo json_encode(["success" => false, "message" => "Endpoint inválido"]);
        break;
}
