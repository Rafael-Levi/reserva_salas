<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/controllers/SalaController.php';
require_once __DIR__ . '/controllers/AgendamentoController.php';

$conn = require __DIR__ . '/../config/database.php';
$salaController = new SalaController($conn);
$agendamentoController = new AgendamentoController($conn);

// Identifica o endpoint
$endpoint = isset($_GET['endpoint']) ? $_GET['endpoint'] : '';

switch ($endpoint) {
    case 'salas':
        $salaController->listarSalas();
        break;

    case 'adicionar_sala':
        $salaController->adicionarSala();
        break;

    case 'editar_sala':
        $salaController->editarSala();
        break;

    case 'excluir_sala':
        $salaController->excluirSala();
        break;

    case 'agendamentos':
        $agendamentoController->listarAgendamentos();
        break;

    case 'adicionar_agendamento':
        $agendamentoController->adicionarAgendamento();
        break;

    case 'excluir_agendamento':
        $agendamentoController->excluirAgendamento();
        break;

    default:
        echo json_encode(["success" => false, "message" => "Endpoint inválido"]);
        break;
}
?>