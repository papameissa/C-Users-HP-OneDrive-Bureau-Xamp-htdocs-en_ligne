<?php
session_start();
if (!isset($_SESSION["loggedin"]) || $_SESSION["type_utilisateur"] !== "recruteur") {
    header("location: login.php");
    exit;
}
require_once 'config.php';

$user_id = $_SESSION["id"];
$errors = [];
$success = "";

// Traitement suppression d'une offre
if (isset($_GET['delete_id'])) {
    $delete_id = intval($_GET['delete_id']);
    $sql = "DELETE FROM offres_emploi WHERE id = :delete_id AND recruteur_id = :user_id";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':delete_id', $delete_id);
    $stmt->bindParam(':user_id', $user_id);
    if ($stmt->execute()) {
        $success = "Offre supprimée avec succès.";
    } else {
        $errors[] = "Erreur lors de la suppression de l'offre.";
    }
}

// Récupérer les offres du recruteur
$sql = "SELECT * FROM offres_emploi WHERE recruteur_id = :user_id ORDER BY date_creation DESC";
$stmt = $pdo->prepare($sql);
$stmt->bindParam(':user_id', $user_id);
$stmt->execute();
$jobs = $stmt->fetchAll();
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Gérer mes offres - Cadremploi</title>
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
        .manage-container {
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
        table {
            width: 100%;
            color: white;
        }
        th, td {
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: rgba(0, 170, 255, 0.7);
        }
        tr:nth-child(even) {
            background-color: rgba(255, 255, 255, 0.1);
        }
        a.btn-primary, a.btn-danger {
            font-weight: 600;
        }
        a.btn-primary {
            background-color: #00aaff;
            border: none;
        }
        a.btn-primary:hover {
            background-color: #0088cc;
        }
        a.btn-danger {
            background-color: #dc3545;
            border: none;
        }
        a.btn-danger:hover {
            background-color: #a71d2a;
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
<div class="manage-container">
    <h1>Gérer mes offres d'emploi</h1>
    <nav>
        <a href="recruiter_dashboard.php">Tableau de bord</a> |
        <a href="add_job.php">Ajouter une offre</a> |
        <a href="logout.php">Déconnexion</a>
    </nav>
    <?php if (!empty($success)): ?>
        <div class="alert alert-success mt-3"><?php echo htmlspecialchars($success); ?></div>
    <?php endif; ?>
    <?php if (!empty($errors)): ?>
        <div class="alert alert-danger mt-3">
            <ul>
                <?php foreach ($errors as $error): ?>
                    <li><?php echo htmlspecialchars($error); ?></li>
                <?php endforeach; ?>
            </ul>
        </div>
    <?php endif; ?>
    <?php if (count($jobs) > 0): ?>
        <table>
            <thead>
                <tr>
                    <th>Titre</th>
                    <th>Localisation</th>
                    <th>Secteur</th>
                    <th>Type de contrat</th>
                    <th>Salaire</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($jobs as $job): ?>
                    <tr>
                        <td><?php echo htmlspecialchars($job['titre']); ?></td>
                        <td><?php echo htmlspecialchars($job['localisation']); ?></td>
                        <td><?php echo htmlspecialchars($job['secteur']); ?></td>
                        <td><?php echo htmlspecialchars($job['type_contrat']); ?></td>
                        <td><?php echo htmlspecialchars($job['salaire']); ?></td>
                        <td>
                            <a href="edit_job.php?job_id=<?php echo $job['id']; ?>" class="btn btn-primary btn-sm">Modifier</a>
                            <a href="manage_jobs.php?delete_id=<?php echo $job['id']; ?>" class="btn btn-danger btn-sm" onclick="return confirm('Confirmer la suppression ?');">Supprimer</a>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    <?php else: ?>
        <p>Aucune offre publiée pour le moment.</p>
    <?php endif; ?>
</div>
<!-- Bootstrap JS CDN -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
