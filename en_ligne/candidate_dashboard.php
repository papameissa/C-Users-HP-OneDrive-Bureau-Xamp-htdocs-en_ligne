<?php
session_start();
if (!isset($_SESSION["loggedin"]) || $_SESSION["type_utilisateur"] !== "candidat") {
    header("location: login.php");
    exit;
}
require_once 'config.php';

// Récupérer les informations du profil candidat
$user_id = $_SESSION["id"];
$sql = "SELECT * FROM profils_candidats WHERE utilisateur_id = :user_id";
$stmt = $pdo->prepare($sql);
$stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
$stmt->execute();
$profile = $stmt->fetch();
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Tableau de bord Candidat - Cadremploi</title>
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
        .profile-info label {
            font-weight: 600;
        }
        .profile-info p {
            background: rgba(255, 255, 255, 0.2);
            padding: 10px;
            border-radius: 8px;
            color: white;
        }
        a.btn-primary {
            background-color: #00aaff;
            border: none;
            font-weight: 600;
        }
        a.btn-primary:hover {
            background-color: #0088cc;
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
    </style>
</head>
<body>
<div class="dashboard-container">
    <h1>Bienvenue, <?php echo htmlspecialchars($profile ? $profile['nom_complet'] : $_SESSION['email']); ?></h1>
    <nav>
        <a href="candidate_profile.php">Mon profil</a>
        <a href="job_search.php">Rechercher des offres</a>
        <a href="applications.php">Mes candidatures</a>
        <a href="logout.php">Déconnexion</a>
    </nav>
    <section class="profile-info mt-4">
        <h3>Informations du profil</h3>
        <?php if ($profile): ?>
            <p><strong>Nom complet :</strong> <?php echo htmlspecialchars($profile['nom_complet']); ?></p>
            <p><strong>Téléphone :</strong> <?php echo htmlspecialchars($profile['telephone']); ?></p>
            <p><strong>Adresse :</strong> <?php echo htmlspecialchars($profile['adresse']); ?></p>
            <p><strong>Niveau d'études :</strong> <?php echo htmlspecialchars($profile['niveau_etudes']); ?></p>
            <p><strong>Compétences :</strong> <?php echo nl2br(htmlspecialchars($profile['competences'])); ?></p>
            <p><strong>Expérience :</strong> <?php echo nl2br(htmlspecialchars($profile['experience'])); ?></p>
        <?php else: ?>
            <p>Vous n'avez pas encore complété votre profil. <a href="candidate_profile.php" class="btn btn-primary btn-sm">Compléter mon profil</a></p>
        <?php endif; ?>
    </section>
</div>
<!-- Bootstrap JS CDN -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
