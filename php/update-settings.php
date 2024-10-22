<?php
// Activer l'affichage des erreurs pour le débogage
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Configuration des headers CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Gérer la requête OPTIONS (pre-flight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Vérifier la méthode HTTP
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
    exit();
}

// Récupérer et décoder les données JSON
$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData, true);

if (!isset($data['userId']) || !isset($data['type'])) {
    echo json_encode(['success' => false, 'message' => 'Données manquantes']);
    exit();
}

// Connexion à la base de données
$servername = "localhost";
$username = "u468014352_pncdb";
$password = "Pnc1234567890";
$dbname = "u468014352_pncdb";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Erreur de connexion à la base de données']);
    exit();
}

// Traiter la mise à jour en fonction du type
switch ($data['type']) {
    case 'email':
        if (!isset($data['email'])) {
            echo json_encode(['success' => false, 'message' => 'Email manquant']);
            exit();
        }

        $stmt = $conn->prepare("UPDATE clients SET cli_email = ? WHERE cli_id = ?");
        $stmt->bind_param("si", $data['email'], $data['userId']);
        break;

    case 'password':
        if (!isset($data['oldPassword']) || !isset($data['newPassword'])) {
            echo json_encode(['success' => false, 'message' => 'Données de mot de passe manquantes']);
            exit();
        }

        // Vérifier l'ancien mot de passe
        $stmt = $conn->prepare("SELECT cli_password FROM clients WHERE cli_id = ?");
        $stmt->bind_param("i", $data['userId']);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();

        if (!$user || !password_verify($data['oldPassword'], $user['cli_password'])) {
            echo json_encode(['success' => false, 'message' => 'Ancien mot de passe incorrect']);
            exit();
        }

        // Mettre à jour le nouveau mot de passe
        $hashedPassword = password_hash($data['newPassword'], PASSWORD_DEFAULT);
        $stmt = $conn->prepare("UPDATE clients SET cli_password = ? WHERE cli_id = ?");
        $stmt->bind_param("si", $hashedPassword, $data['userId']);
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Type de mise à jour non reconnu']);
        exit();
}

// Exécuter la mise à jour
if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Mise à jour réussie']);
} else {
    echo json_encode(['success' => false, 'message' => 'Erreur lors de la mise à jour']);
}

$stmt->close();
$conn->close();
?>