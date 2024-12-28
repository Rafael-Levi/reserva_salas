<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "agendamento_salas";

// Criação da conexão
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Erro ao conectar ao banco de dados: " . $conn->connect_error]));
}

// Criar tabela de salas, se não existir
$sqlSalas = "CREATE TABLE IF NOT EXISTS salas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_salas VARCHAR(255) NOT NULL,
    capacidade INT NOT NULL,
    foto VARCHAR(255) NOT NULL
);";

if (!$conn->query($sqlSalas)) {
    die(json_encode(["success" => false, "message" => "Erro ao criar tabela de salas: " . $conn->error]));
}

// Criar tabela de agendamentos, se não existir
$sqlAgendamentos = "CREATE TABLE IF NOT EXISTS agendamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_sala INT NOT NULL,
    nome_users VARCHAR(255) NOT NULL,
    funcao VARCHAR(255) NOT NULL,
    matricula VARCHAR(6) NOT NULL,
    data_agendamento DATE NOT NULL,
    horario_inicio TIME NOT NULL,
    horario_fim TIME NOT NULL,
    personalizado INT NOT NULL,
    FOREIGN KEY (id_sala) REFERENCES salas(id)
);";

if (!$conn->query($sqlAgendamentos)) {
    die(json_encode(["success" => false, "message" => "Erro ao criar tabela de agendamentos: " . $conn->error]));
}
return $conn;
?>