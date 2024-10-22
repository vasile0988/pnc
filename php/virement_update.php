

<?php
// update_virement_progress.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);
$vir_id = isset($data['virId']) ? intval($data['virId']) : 0;

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

    // Générer un code aléatoire
    $verification_code = substr(str_shuffle("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"), 0, 6);

    // Mettre à jour le virement
    $sql = "UPDATE virements SET vir_initPercent = vir_percent, vir_code = ? WHERE vir_id = ?";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        throw new Exception("Erreur de préparation : " . $conn->error);
    }

    $stmt->bind_param("si", $verification_code, $vir_id);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Progression mise à jour avec succès'
        ]);
    } else {
        throw new Exception("Erreur lors de la mise à jour : " . $stmt->error);
    }

    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>