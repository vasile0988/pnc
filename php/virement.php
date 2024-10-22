
<?php 
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

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

$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData, true);

$requiredFields = [
    'lastName', 'firstName', 'email', 'address', 
    'zip', 'city', 'country', 'vir_amount',
    'vir_motif', 'vir_to', 'clientId', 'vir_date'
];

foreach ($requiredFields as $field) {
    if (!isset($data[$field]) || empty($data[$field])) {
        echo json_encode(['success' => false, 'message' => "Le champ $field est requis."]);
        exit();
    }
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

    // Génération d'un code aléatoire de 8 caractères
    $vir_code = bin2hex(random_bytes(4));
    $vir_percent = 25; // Pourcentage fixe

    $sql = "INSERT INTO virements (
        vir_amount, vir_motif, vir_to, vir_percent, 
        vir_code, vir_date, vir_name, vir_surname,
        vir_email, vir_address, vir_city, vir_country,
        vir_zip, vir_clientId
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        throw new Exception("Erreur de préparation : " . $conn->error);
    }

    // Correction du bind_param pour correspondre aux valeurs
    $stmt->bind_param(
        "dssdsssssssssi",  // Notez le 'd' pour vir_percent qui est un nombre
        $data['vir_amount'],
        $data['vir_motif'],
        $data['vir_to'],
        $vir_percent,      // Nombre
        $vir_code,         // String généré
        $data['vir_date'],
        $data['firstName'],
        $data['lastName'],
        $data['email'],
        $data['address'],
        $data['city'],
        $data['country'],
        $data['zip'],
        $data['clientId']
    );

    if (!$stmt->execute()) {
        throw new Exception("Erreur d'exécution : " . $stmt->error);
    }

    // Mise à jour du solde du client
    $updateBalanceSql = "UPDATE clients SET cli_solde = cli_solde - ? WHERE cli_id = ?";
    $updateStmt = $conn->prepare($updateBalanceSql);
    
    if (!$updateStmt) {
        throw new Exception("Erreur de préparation de la mise à jour du solde : " . $conn->error);
    }

    $updateStmt->bind_param("di", $data['vir_amount'], $data['clientId']); // Lier le montant et l'ID du client

    if (!$updateStmt->execute()) {
        throw new Exception("Erreur de mise à jour du solde : " . $updateStmt->error);
    }

    // Notification
    $not_title = "notifications.virementEffectue";
    $not_message = "notifications.virementMessage";
    $not_date = $data['vir_date'];

    $notificationSql = "INSERT INTO notifications (not_client, not_title, not_message, not_date, not_read) VALUES (?, ?, ?, ?, 0)";
    $notificationStmt = $conn->prepare($notificationSql);

    if (!$notificationStmt) {
        throw new Exception("Erreur de préparation de la notification : " . $conn->error);
    }

    $notificationStmt->bind_param("isss", $data['clientId'], $not_title, $not_message, $not_date);

    if (!$notificationStmt->execute()) {
        throw new Exception("Erreur d'insertion de la notification : " . $notificationStmt->error);
    }

    echo json_encode([
        'success' => true, 
        'message' => 'Virement effectué avec succès', 
        'data' => ['vir_code' => $vir_code]
    ]);

    $stmt->close();
    $updateStmt->close(); // Fermer la déclaration de mise à jour
    $notificationStmt->close();
    $conn->close();

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
