<?php
// Activer l'affichage des erreurs pour le débogage
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Autoriser l'accès depuis n'importe quelle origine
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Max-Age: 3600");

// Gérer les requêtes OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit();
}

header('Content-Type: application/json'); // Définir le type de contenu en réponse

// Récupérer les données JSON envoyées
$input = json_decode(file_get_contents('php://input'), true);

// Vérifier si les données ont été reçues
if (!$input || empty($input['email']) || empty($input['password'])) {
    echo json_encode(['success' => false, 'message' => 'Email et mot de passe requis.']);
    exit(); // Terminer le script si les données sont manquantes
}

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

// Assainir l'email pour éviter les injections
$email = htmlspecialchars($input['email']);

// Préparer et exécuter la requête pour obtenir l'admin par email
$stmt = $conn->prepare("SELECT adm_password, adm_id FROM admin WHERE adm_email = ?");
$stmt->bind_param("s", $email); // Lier l'email au paramètre de la requête
$stmt->execute();
$stmt->store_result(); // Stocker le résultat

if ($stmt->num_rows > 0) { // Vérifier si un utilisateur existe
    $stmt->bind_result($hashedPassword, $adminId); // Lier les résultats aux variables
    $stmt->fetch(); // Récupérer les résultats
    // echo password_hash($input['password'], PASSWORD_DEFAULT) . " et dans bd: " . $hashedPassword;
    // Vérifier le mot de passe
    if (password_verify($input['password'], $hashedPassword)) {
        // Crypter l'ID de l'admin
        $encryptedId = base64_encode($adminId); // Exemple de cryptage (à améliorer pour la sécurité)

        // Répondre avec succès et envoyer l'ID crypté
        echo json_encode(['success' => true, 'message' => 'Connexion réussie.', 'id' => $encryptedId]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Mot de passe incorrect.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Aucun admin trouvé avec cet email.']);
}

// Fermer la requête et la connexion
$stmt->close();
$conn->close();
?>
