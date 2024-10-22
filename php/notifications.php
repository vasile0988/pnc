<?php
// Activer l'affichage des erreurs pour le débogage
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Configuration des headers CORS et type de contenu
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Vérification de l'ID utilisateur
if (!isset($_GET['id'])) {
    echo json_encode(['success' => false, 'message' => 'ID utilisateur requis.']);
    exit();
}

// Décryptage de l'ID utilisateur
$encryptedId = $_GET['id'];
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

// Récupération des notifications pour le client spécifié
$notifications = [];
$stmt = $conn->prepare("
    SELECT *
    FROM notifications 
    WHERE not_client = ? 
    ORDER BY not_date DESC 
");

$stmt->bind_param("i", $userId);
$stmt->execute();
$stmt->store_result();

// Vérification si des notifications existent
if ($stmt->num_rows > 0) {
    // Liaison des résultats à des variables
    $stmt->bind_result($not_id, $not_client, $not_title, $not_message, $not_date, $not_read);
    while ($stmt->fetch()) {
        $notifications[] = [
            'id' => $not_id,
            'client' => $not_client,
            'title' => $not_title,
            'message' => $not_message,
            'date' => $not_date,
            'read' => $not_read
        ];
    }
}

// Envoi de la réponse
echo json_encode([
    'success' => true,
    'notifications' => $notifications
]);

// Fermeture des ressources
$stmt->close();
$conn->close();
