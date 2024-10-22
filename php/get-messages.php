<?php 
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

$servername = "localhost";
$username = "u468014352_pncdb";
$password = "Pnc1234567890";
$dbname = "u468014352_pncdb";

try {
    $conn = new mysqli($servername, $username, $password, $dbname);
    
    if ($conn->connect_error) {
        throw new Exception("Erreur de connexion : " . $conn->connect_error);
    }

    $sql = "SELECT * FROM contacts ORDER BY cont_id DESC";
    $result = $conn->query($sql);

    $messages = [];
    if ($result) {
        $messages = $result->fetch_all(MYSQLI_ASSOC);
    }

    echo json_encode(['success' => true, 'messages' => $messages]);

    $conn->close();

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
