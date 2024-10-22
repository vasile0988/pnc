<?php
// transfert-admin.php

// Activation du débogage
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Configuration des headers CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
    exit();
}

try {
    // Récupération des données JSON
    $jsonData = file_get_contents('php://input');
    $data = json_decode($jsonData, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Erreur de décodage JSON');
    }

    // Vérification des données requises
    if (!isset($data['amount']) || !isset($data['clientId']) || !isset($data['dateTime'])) {
        throw new Exception('Données manquantes');
    }

    $amount = floatval($data['amount']);
    $clientId = intval($data['clientId']);
    $dateTime = new DateTime($data['dateTime']);
    $formattedDateTime = $dateTime->format('Y-m-d H:i:s'); // Format compatible MySQL

    // Configuration de la base de données
    $servername = "localhost";
    $username = "u468014352_pncdb";
    $password = "Pnc1234567890";
    $dbname = "u468014352_pncdb";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        throw new Exception('Erreur de connexion à la base de données');
    }

    // Mettre à jour le solde du client
    $stmt = $conn->prepare("UPDATE clients SET cli_solde = cli_solde + ? WHERE cli_id = ?");
    $stmt->bind_param("di", $amount, $clientId);

    if (!$stmt->execute()) {
        throw new Exception('Erreur lors de la mise à jour du solde');
    }

    // Ajouter une notification
    $stmt = $conn->prepare("INSERT INTO notifications (not_client, not_title, not_message, not_date, not_read) VALUES (?, ?, ?, ?, ?)");
    $title = "notifications.received";
    $message = "notifications.receivedMessage" . number_format($amount, 2);
    $readStatus = 0;

    $stmt->bind_param("isssi", $clientId, $title, $message, $formattedDateTime, $readStatus);

    if (!$stmt->execute()) {
        throw new Exception('Erreur lors de l\'ajout de la notification');
    }

    echo json_encode(['success' => true, 'message' => 'Transfert réussi']);
    
    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
