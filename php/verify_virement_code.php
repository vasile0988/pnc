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
$code = isset($data['code']) ? $data['code'] : '';

if ($vir_id <= 0 || empty($code)) {
    echo json_encode(['success' => false, 'message' => 'Données invalides']);
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
    
    // Vérifier le code
    $sql = "SELECT vir_code, vir_percent FROM virements WHERE vir_id = ? AND vir_code = ?";
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        throw new Exception("Erreur de préparation : " . $conn->error);
    }
    
    $stmt->bind_param("is", $vir_id, $code);
    
    if (!$stmt->execute()) {
        throw new Exception("Erreur d'exécution : " . $stmt->error);
    }
    
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        // Récupérer le pourcentage actuel
        $row = $result->fetch_assoc();
        $current_percent = $row['vir_percent'];

        // Vérifier si le pourcentage est inférieur à 95
        if ($current_percent < 95) {
            // Incrémenter le pourcentage de 10
            $new_percent = min($current_percent + 10, 100); // Ne pas dépasser 100
            // Mettre à jour la valeur dans la base de données
            $updateSql = "UPDATE virements SET vir_percent = ? WHERE vir_id = ?";
            $updateStmt = $conn->prepare($updateSql);
            $updateStmt->bind_param("ii", $new_percent, $vir_id);
            $updateStmt->execute();
        }

        // Changer le code (par exemple, en générant un nouveau code aléatoire)
        $new_code = bin2hex(random_bytes(4)); // Générer un nouveau code de 8 caractères hexadécimaux
        $updateCodeSql = "UPDATE virements SET vir_code = ? WHERE vir_id = ?";
        $updateCodeStmt = $conn->prepare($updateCodeSql);
        $updateCodeStmt->bind_param("si", $new_code, $vir_id);
        $updateCodeStmt->execute();

        echo json_encode([
            'success' => true,
            'message' => 'Code vérifié avec succès',
            'new_percent' => isset($new_percent) ? $new_percent : $current_percent, // Retourner le nouveau pourcentage si mis à jour
            'new_code' => $new_code // Retourner le nouveau code
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Code invalide'
        ]);
    }
    
    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
