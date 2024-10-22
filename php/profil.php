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
// echo $_GET['id'];
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

// Préparer et exécuter la requête pour obtenir le profil par ID
$stmt = $conn->prepare("SELECT cli_name, cli_surname, cli_sexe, cli_email, cli_tel, cli_adress, cli_zip, cli_city, cli_country, cli_job, cli_salary, cli_situation, cli_children, cli_solde FROM clients WHERE cli_id = ?");
$stmt->bind_param("i", $userId); // Lier l'ID au paramètre de la requête
$stmt->execute();
$stmt->store_result(); // Stocker le résultat

if ($stmt->num_rows > 0) { // Vérifier si un utilisateur existe
    $stmt->bind_result($name, $surname, $sexe, $email, $tel, $adress, $zip, $city, $country, $job, $salary, $situation, $children, $solde);
    $stmt->fetch(); // Récupérer les résultats

    // Répondre avec les informations du profil
    echo json_encode([
        'success' => true,
        'data' => [
            'name' => $name,
            'surname' => $surname,
            'sexe' => $sexe,
            'email' => $email,
            'tel' => $tel,
            'adress' => $adress,
            'zip' => $zip,
            'city' => $city,
            'country' => $country,
            'job' => $job,
            'salary' => $salary,
            'situation' => $situation,
            'children' => $children,
            'solde' => $solde,
        ],
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Aucun utilisateur trouvé avec cet ID.']);
}

// Fermer la requête et la connexion
$stmt->close();
$conn->close();
?>
