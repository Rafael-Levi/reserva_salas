<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/controllers/SalaController.php';
require_once __DIR__ . '/controllers/AgendamentoController.php';

header('Content-Type: application/json; charset=utf-8'); 


$conn = require __DIR__ . '/../config/database.php';
$salaController = new SalaController($conn);
$agendamentoController = new AgendamentoController($conn);


$endpoint = $_GET['endpoint'] ?? ''; 

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
    
    case 'listar_reservas_user': // GET: Listar reservas do usuario
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $agendamentoController->ListarReservasUser();
        }else{
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
    
    case 'editar_agendamento': // POST: Editar agendamento
        case 'editar_agendamento':
            if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
                $agendamentoController->editarAgendamento();
            } else {
                http_response_code(405);
                echo json_encode(["success" => false, "message" => "Método não permitido"]);
            }   
            break;
    
    case 'check':
        if( $_SERVER['REQUEST_METHOD'] === 'PUT'){
            $agendamentoController->check_agendamento();
        }else{
            http_response_code(405);
            echo json_decode(["success" => false, "message" => "Método não permitido"]);
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

    default: 
        http_response_code(404); 
        echo json_encode(["success" => false, "message" => "Endpoint inválido"]);
        break;
}
