<?php
// Fichier: update-admin-settings.php
// Description: Gère la mise à jour des paramètres administrateur

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
    if (!isset($data['adminId']) || !isset($data['type'])) {
        throw new Exception('Données manquantes');
    }

    // Décoder l'ID administrateur
    $encryptedId = $data['adminId']; // Récupérer l'ID crypté
    $adminId = intval(base64_decode($encryptedId)); // Décoder l'ID

    // Configuration de la base de données
    $servername = "localhost";
    $username = "u468014352_pncdb";
    $password = "Pnc1234567890";
    $dbname = "u468014352_pncdb";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        throw new Exception('Erreur de connexion à la base de données');
    }

    switch ($data['type']) {
        case 'email':
            if (!isset($data['email'])) {
                throw new Exception('Email manquant');
            }

            $stmt = $conn->prepare("UPDATE admin SET adm_email = ? WHERE adm_id = ?");
            $stmt->bind_param("si", $data['email'], $adminId); // Utiliser adminId décodé
            break;

        case 'password':
            if (!isset($data['oldPassword']) || !isset($data['newPassword'])) {
                throw new Exception('Données de mot de passe manquantes');
            }

            // Vérification de l'ancien mot de passe
            $stmt = $conn->prepare("SELECT adm_password FROM admin WHERE adm_id = ?");
            $stmt->bind_param("i", $adminId); // Utiliser adminId décodé
            $stmt->execute();
            $result = $stmt->get_result();
            $admin = $result->fetch_assoc();

            if (!$admin || !password_verify($data['oldPassword'], $admin['adm_password'])) {
                throw new Exception('Ancien mot de passe incorrect');
            }

            $hashedPassword = password_hash($data['newPassword'], PASSWORD_DEFAULT);
            $stmt = $conn->prepare("UPDATE admin SET adm_password = ? WHERE adm_id = ?");
            $stmt->bind_param("si", $hashedPassword, $adminId); // Utiliser adminId décodé
            break;

        default:
            throw new Exception('Type de mise à jour non reconnu');
    }

    if (!$stmt->execute()) {
        throw new Exception('Erreur lors de la mise à jour');
    }

    echo json_encode(['success' => true, 'message' => 'Mise à jour réussie']);
    
    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
