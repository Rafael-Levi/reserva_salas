<?php
header('Content-Type: application/json');

require_once __DIR__ . '/vendor/autoload.php'; // Carrega o autoloader do Composer
use Dotenv\Dotenv;

// Carrega as variáveis do arquivo .env
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Configuração do banco de dados usando as variáveis do .env
$servername = $_ENV['DB_SERVERNAME'];
$username = $_ENV['DB_USERNAME'];
$password = $_ENV['DB_PASSWORD'];
$dbname = $_ENV['DB_NAME'];

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Erro ao conectar ao banco de dados: " . $conn->connect_error]));
}

// Criar tabela de salas, se não existir
$sqlSalas = "CREATE TABLE IF NOT EXISTS salas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    capacidade INT NOT NULL
);";

if (!$conn->query($sqlSalas)) {
    die(json_encode(["success" => false, "message" => "Erro ao criar tabela de salas: " . $conn->error]));
}

// Criar tabela de agendamentos, se não existir
$sqlAgendamentos = "CREATE TABLE IF NOT EXISTS agendamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_sala INT NOT NULL,
    data DATE NOT NULL,
    horario_inicio TIME NOT NULL,
    horario_fim TIME NOT NULL,
    FOREIGN KEY (id_sala) REFERENCES salas(id)
);";

if (!$conn->query($sqlAgendamentos)) {
    die(json_encode(["success" => false, "message" => "Erro ao criar tabela de agendamentos: " . $conn->error]));
}

// Identifica o endpoint
$endpoint = isset($_GET['endpoint']) ? $_GET['endpoint'] : '';

switch ($endpoint) {
    case 'salas':
        // Listar salas
        $sql = "SELECT * FROM salas";
        $result = $conn->query($sql);
        $salas = [];

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $salas[] = $row;
            }
        }

        echo json_encode($salas);
        break;

    case 'adicionar_sala':
        // Adicionar sala
        $data = json_decode(file_get_contents('php://input'), true);
        $nome = $data['nome'];
        $capacidade = $data['capacidade'];

        $sql = "INSERT INTO salas (nome, capacidade) VALUES (?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("si", $nome, $capacidade);

        if ($stmt->execute()) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false, "message" => "Erro ao adicionar sala: " . $stmt->error]);
        }

        $stmt->close();
        break;

    case 'editar_sala':
        // Editar sala
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'];
        $nome = $data['nome'];
        $capacidade = $data['capacidade'];

        $sql = "UPDATE salas SET nome = ?, capacidade = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sii", $nome, $capacidade, $id);

        if ($stmt->execute()) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false, "message" => "Erro ao editar sala: " . $stmt->error]);
        }

        $stmt->close();
        break;

    case 'excluir_sala':
        // Excluir sala
        $id = $_GET['id'];

        $sql = "DELETE FROM salas WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false, "message" => "Erro ao excluir sala: " . $stmt->error]);
        }

        $stmt->close();
        break;

        case 'agendamentos':
            $id_sala = isset($_GET['sala_id']) ? intval($_GET['sala_id']) : 0;
            $data = isset($_GET['data']) ? $_GET['data'] : null;
        
            // Validação para garantir que 'data' está no formato correto
            if (!$data || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $data)) {
                echo json_encode(['error' => 'Data inválida ou não fornecida']);
                exit;
            }
        
            $sql = "SELECT * FROM agendamentos WHERE id_sala = ? AND data = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("is", $id_sala, $data); // 'i' para id_sala (int), 's' para data (string)
            $stmt->execute();
            $result = $stmt->get_result();
        
            $agendamentos = [];
            while ($row = $result->fetch_assoc()) {
                $agendamentos[] = $row;
            }
        
            echo json_encode($agendamentos);
            $stmt->close();
            break;
        

    case 'adicionar_agendamento':
        // Adicionar agendamento
        $data = json_decode(file_get_contents('php://input'), true);
        $id_sala = $data['id_sala'];
        $data_agendamento = $data['data'];
        $horario_inicio = $data['horario_inicio'];
        $horario_fim = $data['horario_fim'];

        $sql = "INSERT INTO agendamentos (id_sala, data, horario_inicio, horario_fim) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("isss", $id_sala, $data_agendamento, $horario_inicio, $horario_fim);

        if ($stmt->execute()) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false, "message" => "Erro ao adicionar agendamento: " . $stmt->error]);
        }

        $stmt->close();
        break;

    case 'excluir_agendamento':
        // Excluir agendamento
        $id = $_GET['id'];

        $sql = "DELETE FROM agendamentos WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false, "message" => "Erro ao excluir agendamento: " . $stmt->error]);
        }

        $stmt->close();
        break;

    default:
        echo json_encode(["success" => false, "message" => "Endpoint inválido"]);
        break;
}

$conn->close();
?>