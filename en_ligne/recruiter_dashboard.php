<?php
session_start();
if (!isset($_SESSION["loggedin"]) || $_SESSION["type_utilisateur"] !== "recruteur") {
    header("location: login.php");
    exit;
}
require_once 'config.php';

// Récupérer les informations du recruteur
$user_id = $_SESSION["id"];
$sql = "SELECT nom_entreprise FROM utilisateurs WHERE id = :user_id";
$stmt = $pdo->prepare($sql);
$stmt->bindParam(':user_id', $user_id);
$stmt->execute();
$recruiter = $stmt->fetch();
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Tableau de bord Recruteur - Cadremploi</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Bootstrap CSS CDN -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            background: linear-gradient(135deg, #007bff 0%, #ff7e5f 100%);
            color: white;
            min-height: 100vh;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .dashboard-container {
            max-width: 900px;
            margin: 40px auto;
            background: rgba(255, 255, 255, 0.1);
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }
        h1 {
            font-weight: 700;
            margin-bottom: 20px;
            text-align: center;
        }
        nav a {
            color: #cce7ff;
            margin-right: 15px;
            font-weight: 600;
            text-decoration: none;
        }
        nav a:hover {
            color: white;
            text-decoration: underline;
        }
        .btn-primary {
            background-color: #00aaff;
            border: none;
            font-weight: 600;
        }
        .btn-primary:hover {
            background-color: #0088cc;
        }
    </style>
</head>
<body>
<div class="dashboard-container">
    <h1>Bienvenue, <?php echo htmlspecialchars($recruiter ? $recruiter['nom_entreprise'] : $_SESSION['email']); ?></h1>
    <nav>
        <a href="manage_jobs.php">Gérer mes offres</a>
        <a href="search_candidates.php">Rechercher des candidats</a>
        <a href="received_applications.php">Candidatures reçues</a>
        <a href="logout.php">Déconnexion</a>
    </nav>
    <section class="mt-4">
        <p>Utilisez les liens ci-dessus pour gérer vos offres d'emploi, rechercher des candidats et consulter les candidatures reçues.</p>
    </section>
</div>
<!-- Bootstrap JS CDN -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
