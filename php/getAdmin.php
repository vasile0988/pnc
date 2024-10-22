<?php
// Fichier: get-admin-profile.php
// Description: Récupère les informations du profil administrateur

// Activer l'affichage des erreurs pour le débogage
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Autoriser l'accès depuis n'importe quelle origine
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json'); // Définir le type de contenu en réponse

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Vérification de la présence de l'ID admin
if (!isset($_GET['id'])) {
    echo json_encode(['success' => false, 'message' => 'ID administrateur requis']);
    exit();
}

$encryptedId = $_GET['id']; // Récupérer l'ID crypté
$adminId = intval(base64_decode($encryptedId));
// echo $_GET['id']." Le Id de l'admin";
try {
    // Configuration de la base de données
    $servername = "localhost";
    $username = "u468014352_pncdb";
    $password = "Pnc1234567890";
    $dbname = "u468014352_pncdb";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        throw new Exception('Erreur de connexion à la base de données');
    }

    // Préparation et exécution de la requête
    $stmt = $conn->prepare("SELECT adm_email FROM admin WHERE adm_id = ?");
    if (!$stmt) {
        throw new Exception('Erreur de préparation de la requête');
    }

    $stmt->bind_param("i", $adminId);
    if (!$stmt->execute()) {
        throw new Exception('Erreur d\'exécution de la requête');
    }

    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo json_encode([
            'success' => true,
            'data' => [
                'email' => $row['adm_email']
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Administrateur non trouvé']);
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
