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

// Préparer et exécuter la requête pour obtenir la liste des clients
$query = "SELECT cli_id, cli_name, cli_surname, cli_email FROM clients"; // Sélectionner uniquement les clients
$result = $conn->query($query);

$clients = []; // Initialiser le tableau des clients

if ($result->num_rows > 0) {
    // Récupérer chaque ligne de résultat
    while ($row = $result->fetch_assoc()) {
        // Vérifier si le client a des virements
        $cli_id = $row['cli_id'];
        $virementQuery = "SELECT COUNT(*) as virement_count FROM virements WHERE vir_clientId = $cli_id"; // Vérifier la présence

        $virementResult = $conn->query($virementQuery);
        $virementData = $virementResult->fetch_assoc();
        
        // Ajouter un champ vir_present selon la présence de virements
        $row['vir_present'] = $virementData['virement_count'] > 0 ? 1 : 0;

        $clients[] = $row; // Ajouter chaque client au tableau
    }
    echo json_encode(['success' => true, 'data' => $clients]); // Retourner les données des clients
} else {
    echo json_encode(['success' => false, 'message' => 'Aucun client trouvé.']);
}

// Fermer la connexion
$conn->close();
?>
