<?php
// Activer l'affichage des erreurs pour le débogage
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Autoriser l'accès depuis n'importe quelle origine
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json'); // Définir le type de contenu en réponse

// Vérifier si l'ID de l'utilisateur est passé en paramètre
if (!isset($_GET['id'])) {
    echo json_encode(['success' => false, 'message' => 'ID utilisateur requis.']);
    exit();
}

$encryptedId = $_GET['id']; // Récupérer l'ID crypté
$userId = intval(base64_decode($encryptedId)); // Décoder l'ID et le convertir en entier

// Afficher l'ID reçu et l'ID décodé
error_log("ID reçu : $encryptedId"); // Log l'ID crypté
error_log("ID décodé : $userId"); // Log l'ID décodé

// Connexion à la base de données
$servername = "localhost"; // Remplacez par votre serveur
$username = "u468014352_pncdb"; // Remplacez par votre utilisateur
$password = "Pnc1234567890"; // Remplacez par votre mot de passe
$dbname = "u468014352_pncdb"; // Nom de la base de données

$conn = new mysqli($servername, $username, $password, $dbname); // Établir la connexion

// Vérifier la connexion
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Erreur de connexion à la base de données']);
    exit(); // Terminer le script en cas d'erreur de connexion
}

// Récupérer le solde et les informations du client
$stmt = $conn->prepare("SELECT cli_solde, cli_name, cli_surname, cli_iban, cli_statut FROM clients WHERE cli_id = ?");
$stmt->bind_param("i", $userId); // Lier l'ID au paramètre de la requête
$stmt->execute();
$stmt->store_result(); // Stocker le résultat

$clientData = [];
if ($stmt->num_rows > 0) { // Vérifier si un utilisateur existe
    $stmt->bind_result($solde, $name, $surname, $iban, $statut);
    $stmt->fetch(); // Récupérer les résultats

    // Ajouter le solde et les informations du client
    $clientData = [
        'solde' => $solde,
        'name' => $name,
        'surname' => $surname,
        'iban' => $iban,
        'statut' => $statut
    ];
} else {
    echo json_encode(['success' => false, 'message' => 'Aucun utilisateur trouvé avec cet ID.']);
    exit();
}

// Récupérer les virements
$virements = [];
$stmt = $conn->prepare("SELECT vir_id, vir_amount, vir_to, vir_date FROM virements WHERE vir_clientId = ?");
$stmt->bind_param("i", $userId); // Lier l'ID du client
$stmt->execute();
$stmt->store_result(); // Stocker le résultat

if ($stmt->num_rows > 0) {
    $stmt->bind_result($vir_id, $vir_amount, $vir_to, $vir_date);
    while ($stmt->fetch()) {
        // Ajouter chaque virement à la liste
        $virements[] = [
            'vir_id' => $vir_id,
            'vir_amount' => $vir_amount,
            'vir_to' => $vir_to,
            'vir_date' => $vir_date
        ];
    }
}

// Répondre avec le solde, les virements et les informations du client
echo json_encode([
    'success' => true,
    'clientData' => $clientData,
    'virements' => $virements
]);

// Fermer la requête et la connexion
$stmt->close();
$conn->close();
?>
