<?php
// Vérifiez si le formulaire a été soumis
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $to = "gccboy67@gmail.com"; // Remplacez par l'adresse e-mail du destinataire
    $subject = "Test Email";
    $message = "Ceci est un test d'envoi d'e-mail.";
    $headers = "From: sender@example.com"; // Remplacez par votre adresse e-mail

    // Essayez d'envoyer l'e-mail
    if (mail($to, $subject, $message, $headers)) {
        echo "L'e-mail a été envoyé avec succès à $to";
    } else {
        echo "Échec de l'envoi de l'e-mail.";
    }
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Envoyer un e-mail</title>
</head>
<body>
    <h1>Envoyer un e-mail</h1>
    <form method="POST" action="">
        <button type="submit">Envoyer l'e-mail</button>
    </form>
</body>
</html>
