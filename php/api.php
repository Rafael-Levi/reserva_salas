<?php
require 'db_config.php';

header("Content-Type: application/json");

$method = $_SERVER['REQUEST_METHOD'];
$endpoint = $_GET['endpoint'] ?? '';

switch ($endpoint) {
    case 'adms':
        if ($method === 'GET') {

            $stmt = $pdo->query("SELECT * FROM ADM");
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        } elseif ($method === 'POST') {
            $data = json_decode(file_get_contents('php://input'), true);
            $sql = "INSERT INTO ADM (Matricula, Nome) VALUES (:matricula, :nome)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(['matricula' => $data['Matricula'], 'nome' => $data['Nome']]);
            echo json_encode(['message' => 'Administrador adicionado com sucesso!']);
        }
        break;

    case 'salas':
        if ($method === 'GET') {
          
            $stmt = $pdo->query("SELECT * FROM Salas");
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        } elseif ($method === 'POST') {
           
            $data = json_decode(file_get_contents('php://input'), true);
            $sql = "INSERT INTO Salas (Nome, Andar) VALUES (:nome, :andar)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(['nome' => $data['Nome'], 'andar' => $data['Andar']]);
            echo json_encode(['message' => 'Sala adicionada com sucesso!']);
        }
        break;

    case 'reservas':
        if ($method === 'GET') {
            
            $stmt = $pdo->query("SELECT * FROM Reserva");
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        } elseif ($method === 'POST') {
           
            $data = json_decode(file_get_contents('php://input'), true);
            $sql = "INSERT INTO Reserva (ID_USER, ID_sala, DataHora) VALUES (:id_user, :id_sala, :dataHora)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                'id_user' => $data['ID_USER'],
                'id_sala' => $data['ID_sala'],
                'dataHora' => $data['DataHora']
            ]);
            echo json_encode(['message' => 'Reserva criada com sucesso!']);
        }
        break;

    default:
        http_response_code(404);
        echo json_encode(['message' => 'Endpoint não encontrado']);
        break;
}
?>
