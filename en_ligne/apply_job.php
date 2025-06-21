<?php
session_start();
if (!isset($_SESSION["loggedin"]) || $_SESSION["type_utilisateur"] !== "candidat") {
    header("location: login.php");
    exit;
}
require_once 'config.php';

$user_id = $_SESSION["id"];
$job_id = isset($_GET['job_id']) ? intval($_GET['job_id']) : 0;
$errors = [];
$success = "";

// Vérifier que l'offre existe
$sql = "SELECT * FROM offres_emploi WHERE id = :job_id";
$stmt = $pdo->prepare($sql);
$stmt->bindParam(':job_id', $job_id);
$stmt->execute();
$job = $stmt->fetch();

if (!$job) {
    die("Offre d'emploi introuvable.");
}

// Vérifier si le candidat a déjà postulé
$sql = "SELECT * FROM candidatures WHERE candidat_id = :user_id AND offre_emploi_id = :job_id";
$stmt = $pdo->prepare($sql);
$stmt->bindParam(':user_id', $user_id);
$stmt->bindParam(':job_id', $job_id);
$stmt->execute();
$existing_application = $stmt->fetch();

if ($existing_application) {
    $errors[] = "Vous avez déjà postulé à cette offre.";
}

// Traitement du formulaire
if ($_SERVER["REQUEST_METHOD"] == "POST" && empty($errors)) {
    $cover_letter = trim($_POST['cover_letter']);

    $sql = "INSERT INTO candidatures (candidat_id, offre_emploi_id, lettre_motivation) VALUES (:user_id, :job_id, :cover_letter)";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':user_id', $user_id);
    $stmt->bindParam(':job_id', $job_id);
    $stmt->bindParam(':cover_letter', $cover_letter);

    if ($stmt->execute()) {
        $success = "Votre candidature a été envoyée avec succès.";
    } else {
        $errors[] = "Erreur lors de l'envoi de la candidature.";
    }
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Postuler à l'offre - AURA_infini</title>
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
        .apply-container {
            max-width: 700px;
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
        label {
            font-weight: 600;
        }
        .form-control, textarea {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
        }
        .form-control:focus, textarea:focus {
            background: rgba(255, 255, 255, 0.3);
            color: white;
            box-shadow: 0 0 0 0.2rem rgba(0,123,255,.75);
            border: none;
        }
        .btn-primary {
            background-color: #00aaff;
            border: none;
            font-weight: 600;
            width: 100%;
        }
        .btn-primary:hover {
            background-color: #0088cc;
        }
        .alert-danger {
            background-color: rgba(255, 0, 0, 0.7);
            border: none;
            color: white;
        }
        .alert-success {
            background-color: rgba(0, 255, 0, 0.7);
            border: none;
            color: black;
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
<div class="apply-container">
    <h1>Postuler à l'offre : <?php echo htmlspecialchars($job['titre']); ?></h1>
    <nav>
        <a href="job_search.php">Retour à la recherche</a> |
        <a href="candidate_dashboard.php">Tableau de bord</a> |
        <a href="logout.php">Déconnexion</a>
    </nav>
    <?php if (!empty($errors)): ?>
        <div class="alert alert-danger mt-3">
            <ul>
                <?php foreach ($errors as $error): ?>
                    <li><?php echo htmlspecialchars($error); ?></li>
                <?php endforeach; ?>
            </ul>
        </div>
    <?php endif; ?>
    <?php if ($success): ?>
        <div class="alert alert-success mt-3"><?php echo htmlspecialchars($success); ?></div>
    <?php endif; ?>
    <?php if (!$existing_application): ?>
    <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]) . '?job_id=' . $job_id; ?>" method="post" novalidate>
        <div class="mb-3">
            <label for="cover_letter">Lettre de motivation (optionnelle)</label>
            <textarea name="cover_letter" id="cover_letter" class="form-control" rows="6"></textarea>
        </div>
        <div class="mb-3">
            <input type="submit" class="btn btn-primary" value="Envoyer la candidature">
        </div>
    </form>
    <?php endif; ?>
</div>
<!-- Bootstrap JS CDN -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
