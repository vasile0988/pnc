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

header('Content-Type: application/json');

// Fonction pour envoyer une réponse JSON
function sendResponse($success, $data = [], $message = '') {
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ]);
    exit();
}

// Récupérer les données JSON envoyées
$input = json_decode(file_get_contents('php://input'), true);

// Vérifier si les données ont été reçues
if (!$input) {
    sendResponse(false, [], 'Aucune donnée reçue');
}

// Paramètres de connexion à la base de données
$servername = "localhost"; // Remplacez par votre serveur
$username = "u468014352_pncdb";         // Remplacez par votre utilisateur
$password = "Pnc1234567890";             // Remplacez par votre mot de passe
$dbname = "u468014352_pncdb";            // Remplacez par le nom de votre base de données

// Fonction pour établir la connexion à la base de données
function getDbConnection($servername, $username, $password, $dbname) {
    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        sendResponse(false, [], 'Erreur de connexion à la base de données');
    }
    return $conn;
}

// Fonction pour valider les champs requis
function validateInput($input) {
    $requiredFields = ['lastName', 'firstName', 'email', 'phone', 'address', 'zip', 'city', 'country', 'profession', 'monthlyIncome', 'maritalStatus', 'childrenCount', 'gender', 'password'];
    $errors = [];

    foreach ($requiredFields as $field) {
        if (empty($input[$field])) {
            $errors[$field] = ucfirst($field) . ' est requis';
        }
    }

    // Validation de l'email
    if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'Format d\'email invalide';
    }

    return $errors;
}

// Établir la connexion à la base de données
$conn = getDbConnection($servername, $username, $password, $dbname);

// Valider les données d'entrée
$errors = validateInput($input);
if (!empty($errors)) {
    sendResponse(false, $errors, 'Erreurs de validation');
}

// Assainir les valeurs
$sanitizedInput = array_map('htmlspecialchars', $input);

// Récupérer le dernier IBAN
$result = $conn->query("SELECT cli_iban FROM clients ORDER BY cli_iban DESC LIMIT 1");
if ($result) {
    $row = $result->fetch_assoc();
    if ($row) {
        $lastIban = $row['cli_iban'];
        $newIbanNumber = (int)substr($lastIban, -4) + 1; // Prendre les 4 derniers chiffres et incrémenter
        $newIban = substr($lastIban, 0, -4) . str_pad($newIbanNumber, 4, '0', STR_PAD_LEFT); // Remplacer les 4 derniers chiffres
    } else {
        $newIban = "ES76 2100 0418 4502 0005 1332"; // Valeur par défaut si aucune ligne
    }
} else {
    sendResponse(false, [], 'Erreur lors de la récupération de l\'IBAN');
}

// Utiliser le mot de passe fourni par le formulaire
$hashedPassword = password_hash($sanitizedInput['password'], PASSWORD_DEFAULT);

// Définir une valeur par défaut pour le solde et le statut
$defaultSolde = 250.00;
$defaultStatut = 'actif'; // À ajuster selon vos besoins

// Préparer et exécuter la requête d'insertion
$stmt = $conn->prepare("INSERT INTO clients (cli_name, cli_surname, cli_sexe, cli_email, cli_tel, cli_adress, cli_zip, cli_city, cli_country, cli_job, cli_salary, cli_situation, cli_children, cli_password, cli_iban, cli_solde, cli_statut) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
if ($stmt) {
    $stmt->bind_param("sssssssssssssssss", 
        $sanitizedInput['firstName'], 
        $sanitizedInput['lastName'], 
        $sanitizedInput['gender'], 
        $sanitizedInput['email'], 
        $sanitizedInput['phone'], 
        $sanitizedInput['address'], 
        $sanitizedInput['zip'], 
        $sanitizedInput['city'], 
        $sanitizedInput['country'], 
        $sanitizedInput['profession'], 
        $sanitizedInput['monthlyIncome'], 
        $sanitizedInput['maritalStatus'], 
        $sanitizedInput['childrenCount'], 
        $hashedPassword, 
        $newIban,
        $defaultSolde,
        $defaultStatut
    );

    if ($stmt->execute()) {
        sendResponse(true, [], 'Inscription réussie ! Un email de confirmation a été envoyé.');
    } else {
        sendResponse(false, [], 'Erreur lors de l\'insertion dans la base de données');
    }
    $stmt->close();
} else {
    sendResponse(false, [], 'Erreur lors de la préparation de la requête');
}

// Fermer la connexion à la base de données
$conn->close();
?>


<?php
// // Activer l'affichage des erreurs pour le débogage
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);

// // Autoriser l'accès depuis n'importe quelle origine
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
// header("Access-Control-Allow-Headers: Content-Type");
// header("Access-Control-Max-Age: 3600");

// // Gérer les requêtes OPTIONS
// if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
//     header("HTTP/1.1 200 OK");
//     exit();
// }

// header('Content-Type: application/json');

// // Fonction pour envoyer une réponse JSON
// function sendResponse($success, $data = [], $message = '') {
//     echo json_encode([
//         'success' => $success,
//         'message' => $message,
//         'data' => $data
//     ]);
//     exit();
// }

// // Récupérer les données JSON envoyées
// $input = json_decode(file_get_contents('php://input'), true);

// // Vérifier si les données ont été reçues
// if (!$input) {
//     sendResponse(false, [], 'Aucune donnée reçue');
// }

// // Paramètres de connexion à la base de données
// $servername = "localhost"; // Remplacez par votre serveur
// $username = "u468014352_pncdb";         // Remplacez par votre utilisateur
// $password = "Pnc1234567890";             // Remplacez par votre mot de passe
// $dbname = "u468014352_pncdb";            // Remplacez par le nom de votre base de données

// // Fonction pour établir la connexion à la base de données
// function getDbConnection($servername, $username, $password, $dbname) {
//     $conn = new mysqli($servername, $username, $password, $dbname);
//     if ($conn->connect_error) {
//         sendResponse(false, [], 'Erreur de connexion à la base de données');
//     }
//     return $conn;
// }

// // Fonction pour valider les champs requis
// function validateInput($input) {
//     $requiredFields = ['lastName', 'firstName', 'email', 'phone', 'address', 'city', 'country', 'profession', 'monthlyIncome', 'maritalStatus', 'childrenCount', 'gender'];
//     $errors = [];

//     foreach ($requiredFields as $field) {
//         if (empty($input[$field])) {
//             $errors[$field] = ucfirst($field) . ' est requis';
//         }
//     }

//     // Validation de l'email
//     if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
//         $errors['email'] = 'Format d\'email invalide';
//     }

//     return $errors;
// }

// // Établir la connexion à la base de données
// $conn = getDbConnection($servername, $username, $password, $dbname);

// // Valider les données d'entrée
// $errors = validateInput($input);
// if (!empty($errors)) {
//     sendResponse(false, $errors, 'Erreurs de validation');
// }

// // Assainir les valeurs
// $sanitizedInput = array_map('htmlspecialchars', $input);

// // Définir un mot de passe initial (par exemple, "12345678")
// $initialPassword = "12345678"; // À changer par la suite
// $hashedPassword = password_hash($initialPassword, PASSWORD_DEFAULT);

// // Préparer et exécuter la requête d'insertion
// $stmt = $conn->prepare("INSERT INTO clients (cli_name, cli_surname, cli_sexe, cli_email, cli_tel, cli_adress, cli_zip, cli_city, cli_country, cli_job, cli_salary, cli_situation, cli_children, cli_password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
// if ($stmt) {
//     $stmt->bind_param("ssssssssssssss", 
//         $sanitizedInput['firstName'], 
//         $sanitizedInput['lastName'], 
//         $sanitizedInput['gender'], 
//         $sanitizedInput['email'], 
//         $sanitizedInput['phone'], 
//         $sanitizedInput['address'], 
//         $sanitizedInput['zip'], 
//         $sanitizedInput['city'], 
//         $sanitizedInput['country'], 
//         $sanitizedInput['profession'], 
//         $sanitizedInput['monthlyIncome'], 
//         $sanitizedInput['maritalStatus'], 
//         $sanitizedInput['childrenCount'], 
//         $hashedPassword
//     );

//     if ($stmt->execute()) {
//         // Envoyer un e-mail de confirmation
//         $to = $sanitizedInput['email'];
//         $subject = "Confirmation d'inscription";
//         $message = "Bonjour " . $sanitizedInput['firstName'] . ",\n\n"
//                  . "Merci pour votre inscription. Voici vos informations :\n"
//                  . "Nom : " . $sanitizedInput['lastName'] . "\n"
//                  . "Prénom : " . $sanitizedInput['firstName'] . "\n"
//                  . "Email : " . $sanitizedInput['email'] . "\n"
//                  . "Téléphone : " . $sanitizedInput['phone'] . "\n"
//                  . "Adresse : " . $sanitizedInput['address'] . "\n"
//                  . "Ville : " . $sanitizedInput['city'] . "\n"
//                  . "Pays : " . $sanitizedInput['country'] . "\n"
//                  . "Profession : " . $sanitizedInput['profession'] . "\n"
//                  . "Revenu Mensuel : " . $sanitizedInput['monthlyIncome'] . "\n"
//                  . "Statut Matrimonial : " . $sanitizedInput['maritalStatus'] . "\n"
//                  . "Nombre d'Enfants : " . $sanitizedInput['childrenCount'] . "\n\n"
//                  . "Cordialement,\n"
//                  . "L'équipe de PNC";

//         // En-têtes de l'e-mail
//         $headers = "From: no-reply@pncbanko.com\r\n" // Remplacez par votre adresse e-mail
//                  . "Reply-To: no-reply@votre-site.com\r\n" // Remplacez par votre adresse e-mail
//                  . "Content-Type: text/plain; charset=UTF-8\r\n";

//         // Envoyer l'e-mail
//         if (mail($to, $subject, $message, $headers)) {
//             sendResponse(true, [], 'Inscription réussie ! Un email de confirmation a été envoyé.');
//         } else {
//             sendResponse(false, [], 'Inscription réussie, mais impossible d\'envoyer l\'email de confirmation.');
//         }
//     } else {
//         sendResponse(false, [], 'Erreur lors de l\'insertion dans la base de données');
//     }
//     $stmt->close();
// } else {
//     sendResponse(false, [], 'Erreur lors de la préparation de la requête');
// }

// // Fermer la connexion à la base de données
// $conn->close();
?>
