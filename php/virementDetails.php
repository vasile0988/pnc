<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Assurez-vous qu'il n'y a pas de sortie avant cette ligne

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
    exit();
}

// Récupération de l'ID du virement depuis les paramètres de la requête
$vir_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($vir_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'ID du virement invalide']);
    exit();
}

$servername = "localhost";
$username = "u468014352_pncdb";
$password = "Pnc1234567890";
$dbname = "u468014352_pncdb";

try {
    $conn = new mysqli($servername, $username, $password, $dbname);
    
    if ($conn->connect_error) {
        throw new Exception("Erreur de connexion : " . $conn->connect_error);
    }

    // Préparer la requête pour récupérer les détails du virement
    $sql = "SELECT * FROM virements WHERE vir_id = ?";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        throw new Exception("Erreur de préparation : " . $conn->error);
    }

    $stmt->bind_param("i", $vir_id);
    $stmt->execute();

    $result = $stmt->get_result();
    $virement = $result->fetch_assoc(); // Récupérer les données sous forme de tableau associatif

    if ($virement) {
        echo json_encode(['success' => true, 'data' => $virement]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Aucun virement trouvé pour cet ID']);
    }

    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>