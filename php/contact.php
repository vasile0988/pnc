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

// Gérer les requêtes OPTIONS (pre-flight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit();
}

header('Content-Type: application/json');

// Récupérer les données JSON envoyées
$input = json_decode(file_get_contents('php://input'), true);

// Connexion à la base de données
$servername = "localhost"; // Remplacez par votre serveur
$username = "u468014352_pncdb";     // Remplacez par votre utilisateur
$password = "Pnc1234567890";     // Remplacez par votre mot de passe
$dbname = "u468014352_pncdb";            // Nom de la base de données

$conn = new mysqli($servername, $username, $password, $dbname);

// Vérifier la connexion
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'error' => 'Erreur de connexion à la base de données']));
}

$success = true;
$errors = [];

// echo $input;

// Vérification des champs requis
if (empty($input['lastName'])) {
    $success = false;
    $errors['lastName'] = 'Le nom est requis';
}

if (empty($input['email'])) {
    $success = false;
    $errors['email'] = 'L\'email est requis';
}

if (empty($input['message'])) {
    $success = false;
    $errors['message'] = 'Le message est requis';
}

// Si tous les champs sont valides, insérer dans la base de données
if ($success) {
    // Assainir les valeurs
    $lastName = htmlspecialchars($input['lastName']);
    $firstName = htmlspecialchars($input['firstName']);
    $email = htmlspecialchars($input['email']);
    $phone = htmlspecialchars($input['phone']);
    $message = htmlspecialchars($input['message']);

    $stmt = $conn->prepare("INSERT INTO contacts (cont_name, cont_surname, cont_email, cont_tel, cont_message) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $lastName, $firstName, $email, $phone, $message);

    if ($stmt->execute()) {
        // Préparer l'e-mail
        $to = $input['email']; // Exemple : envoyer un mail à l'utilisateur
        $subject = "Confirmation de votre message";
        $messageContent = "Merci pour votre message, nous vous répondrons bientôt.";
        $headers = "From: no-reply@example.com";

        mail($to, $subject, $messageContent, $headers);

        $response = [
            'success' => true,
            'message' => 'Formulaire soumis avec succès'
        ];
    } else {
        $success = false;
        $response = [
            'success' => false,
            'error' => 'Erreur lors de l\'insertion dans la base de données'
        ];
    }

    $stmt->close();
}

if (!$success) {
    $response = [
        'success' => false,
        'errors' => $errors
    ];
}

$conn->close();
echo json_encode($response);
?>
