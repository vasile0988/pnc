<?php
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
$vir_percent = isset($data['vir_percent']) ? intval($data['vir_percent']) : 0;

// S'assurer que vir_percent ne dépasse pas 95
$vir_percent = min(95, $vir_percent);

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
    
    $sql = "UPDATE virements SET vir_percent = ? WHERE vir_id = ?";
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        throw new Exception("Erreur de préparation : " . $conn->error);
    }
    
    $stmt->bind_param("ii", $vir_percent, $vir_id);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'vir_percent mis à jour avec succès'
        ]);
    } else {
        throw new Exception("Erreur lors de la mise à jour : " . $stmt->error);
    }
    
    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}