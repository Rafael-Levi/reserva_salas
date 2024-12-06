<?php
require 'db_config.php';

try {
    $sql = "CREATE TABLE IF NOT EXISTS ADM (
        UID INT AUTO_INCREMENT PRIMARY KEY,
        Matricula VARCHAR(6) UNIQUE NOT NULL,
        Nome VARCHAR(255) UNIQUE NOT NULL
    )";
    $pdo->exec($sql);

    $sql = "CREATE TABLE IF NOT EXISTS Salas (
        UID INT AUTO_INCREMENT PRIMARY KEY,
        Nome VARCHAR(6) UNIQUE NOT NULL,
        Andar VARCHAR(6) NOT NULL
    )";
    $pdo->exec($sql);

    $sql = "CREATE TABLE IF NOT EXISTS Reserva (
        UID INT AUTO_INCREMENT PRIMARY KEY,
        ID_USER INT NOT NULL,
        ID_sala INT NOT NULL,
        DataHora DATETIME NOT NULL,
        FOREIGN KEY (ID_USER) REFERENCES ADM(UID),
        FOREIGN KEY (ID_sala) REFERENCES Salas(UID)
    )";
    $pdo->exec($sql);

    echo "Tabelas criadas com sucesso!";
} catch (PDOException $e) {
    echo "Erro ao criar tabelas: " . $e->getMessage();
}
?>
