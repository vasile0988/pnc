<?php
// Activer l'affichage des erreurs pour le débogage
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Configuration des headers CORS et type de contenu
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Récupération des données JSON envoyées dans la requête
$data = json_decode(file_get_contents("php://input"), true);

// Vérification de l'ID utilisateur
if (!isset($data['userId'])) {
    echo json_encode(['success' => false, 'message' => 'ID utilisateur requis.']);
    exit();
}

echo $data['userId'];

// Décryptage de l'ID utilisateur
$encryptedId = $data['userId'];
$userId = intval(base64_decode($encryptedId));

// Configuration de la base de données
$servername = "localhost";
$username = "u468014352_pncdb";
$password = "Pnc1234567890";
$dbname = "u468014352_pncdb";

// Création de la connexion
$conn = new mysqli($servername, $username, $password, $dbname);

// Vérification de la connexion
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Erreur de connexion à la base de données']);
    exit();
}

// Mise à jour de toutes les notifications pour les marquer comme lues
$stmt = $conn->prepare("
    UPDATE notifications 
    SET not_read = '1' 
    WHERE not_client = ?
");

$stmt->bind_param("i", $userId);
$success = $stmt->execute();

// Vérification de la mise à jour
if ($success) {
    echo json_encode(['success' => true, 'message' => 'Toutes les notifications marquées comme lues.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Erreur lors de la mise à jour des notifications.']);
}

// Fermeture des ressources
$stmt->close();
$conn->close();
