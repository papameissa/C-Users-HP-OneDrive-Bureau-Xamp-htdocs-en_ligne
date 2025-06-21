<?php
session_start();
if (!isset($_SESSION["loggedin"]) || $_SESSION["type_utilisateur"] !== "candidat") {
    header("location: login.php");
    exit;
}
require_once 'config.php';

$user_id = $_SESSION["id"];

// Récupérer les candidatures du candidat
$sql = "SELECT c.*, o.titre FROM candidatures c JOIN offres_emploi o ON c.offre_emploi_id = o.id WHERE c.candidat_id = :user_id ORDER BY c.date_candidature DESC";
$stmt = $pdo->prepare($sql);
$stmt->bindParam(':user_id', $user_id);
$stmt->execute();
$applications = $stmt->fetchAll();
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Mes candidatures - AURA_infini</title>
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
        .applications-container {
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
        .status-pending {
            color: #ffc107;
            font-weight: 600;
        }
        .status-accepted {
            color: #28a745;
            font-weight: 600;
        }
        .status-rejected {
            color: #dc3545;
            font-weight: 600;
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
<div class="applications-container">
    <h1>Mes candidatures</h1>
    <nav>
        <a href="candidate_dashboard.php">Tableau de bord</a> |
        <a href="logout.php">Déconnexion</a>
    </nav>
    <?php if (count($applications) > 0): ?>
        <table>
            <thead>
                <tr>
                    <th>Offre</th>
                    <th>Date de candidature</th>
                    <th>Statut</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($applications as $app): ?>
                    <tr>
                        <td><?php echo htmlspecialchars($app['titre']); ?></td>
                        <td><?php echo htmlspecialchars($app['date_candidature']); ?></td>
                        <td class="status-<?php echo htmlspecialchars($app['statut']); ?>">
                            <?php
                            switch ($app['statut']) {
                                case 'en_attente':
                                    echo 'En attente';
                                    break;
                                case 'accepte':
                                    echo 'Acceptée';
                                    break;
                                case 'refuse':
                                    echo 'Refusée';
                                    break;
                                default:
                                    echo htmlspecialchars($app['statut']);
                            }
                            ?>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    <?php else: ?>
        <p>Vous n'avez pas encore postulé à des offres.</p>
    <?php endif; ?>
</div>
<!-- Bootstrap JS CDN -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
