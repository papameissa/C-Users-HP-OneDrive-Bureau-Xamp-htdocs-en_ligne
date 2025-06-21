<?php
session_start();
require_once 'config.php';

// Vérifier si l'administrateur est connecté
if (!isset($_SESSION["admin_loggedin"]) || $_SESSION["admin_loggedin"] !== true) {
    header("location: admin_login.php");
    exit;
}

// Gestion des actions (activer/bloquer utilisateur, supprimer offre)
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['action'], $_POST['user_id'])) {
        $user_id = intval($_POST['user_id']);
        if ($_POST['action'] === 'toggle_status') {
            // Récupérer statut actuel
            $stmt = $pdo->prepare("SELECT statut FROM utilisateurs WHERE id = :id");
            $stmt->execute([':id' => $user_id]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($user) {
                $new_status = ($user['statut'] === 'actif') ? 'bloque' : 'actif';
                $update = $pdo->prepare("UPDATE utilisateurs SET statut = :statut WHERE id = :id");
                $update->execute([':statut' => $new_status, ':id' => $user_id]);
            }
        }
    }
    if (isset($_POST['delete_job_id'])) {
        $job_id = intval($_POST['delete_job_id']);
        $delete = $pdo->prepare("DELETE FROM offres_emploi WHERE id = :id");
        $delete->execute([':id' => $job_id]);
    }
    header("Location: admin_dashboard.php");
    exit;
}

// Récupérer la liste des utilisateurs
$users_stmt = $pdo->query("SELECT id, email, type_utilisateur, statut FROM utilisateurs ORDER BY id DESC");
$users = $users_stmt->fetchAll(PDO::FETCH_ASSOC);

// Récupérer la liste des offres d'emploi
$jobs_stmt = $pdo->query("SELECT o.id, o.titre, o.localisation, o.secteur, o.type_contrat, o.salaire, u.email AS recruteur_email 
                          FROM offres_emploi o 
                          JOIN utilisateurs u ON o.recruteur_id = u.id
                          ORDER BY o.date_creation DESC");
$jobs = $jobs_stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Tableau de bord Administrateur - AURA_infini</title>
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
        .container {
            background: rgba(255, 255, 255, 0.1);
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
            margin-top: 40px;
            margin-bottom: 40px;
        }
        h2 {
            font-weight: 700;
            margin-bottom: 20px;
            text-align: center;
        }
        table {
            color: white;
        }
        th, td {
            vertical-align: middle !important;
        }
        .btn-toggle-status {
            min-width: 120px;
        }
        .btn-logout {
            background-color: #ff4d4d;
            border: none;
            font-weight: 600;
            color: white;
        }
        .btn-logout:hover {
            background-color: #cc0000;
            color: white;
        }
        .btn-delete {
            background-color: #ff6666;
            border: none;
            font-weight: 600;
            color: white;
        }
        .btn-delete:hover {
            background-color: #cc0000;
            color: white;
        }
    </style>
</head>
<body>
<div class="container">
    <h2>Tableau de bord Administrateur</h2>
    <p>Bienvenue, <?php echo htmlspecialchars($_SESSION["admin_email"]); ?> | <a href="logout.php" class="btn btn-logout btn-sm">Déconnexion</a></p>

    <h3>Gestion des utilisateurs</h3>
    <table class="table table-dark table-striped table-hover">
        <thead>
            <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Type</th>
                <th>Statut</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($users as $user): ?>
            <tr>
                <td><?php echo $user['id']; ?></td>
                <td><?php echo htmlspecialchars($user['email']); ?></td>
                <td><?php echo ucfirst($user['type_utilisateur']); ?></td>
                <td><?php echo ucfirst($user['statut']); ?></td>
                <td>
                    <form method="post" style="display:inline;">
                        <input type="hidden" name="user_id" value="<?php echo $user['id']; ?>">
                        <button type="submit" name="action" value="toggle_status" class="btn btn-sm btn-toggle-status">
                            <?php echo ($user['statut'] === 'actif') ? 'Bloquer' : 'Activer'; ?>
                        </button>
                    </form>
                </td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>

    <h3>Gestion des offres d'emploi</h3>
    <table class="table table-dark table-striped table-hover">
        <thead>
            <tr>
                <th>ID</th>
                <th>Titre</th>
                <th>Localisation</th>
                <th>Secteur</th>
                <th>Type de contrat</th>
                <th>Salaire</th>
                <th>Recruteur</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($jobs as $job): ?>
            <tr>
                <td><?php echo $job['id']; ?></td>
                <td><?php echo htmlspecialchars($job['titre']); ?></td>
                <td><?php echo htmlspecialchars($job['localisation']); ?></td>
                <td><?php echo htmlspecialchars($job['secteur']); ?></td>
                <td><?php echo htmlspecialchars($job['type_contrat']); ?></td>
                <td><?php echo htmlspecialchars($job['salaire']); ?></td>
                <td><?php echo htmlspecialchars($job['recruteur_email']); ?></td>
                <td>
                    <form method="post" onsubmit="return confirm('Confirmer la suppression de cette offre ?');" style="display:inline;">
                        <input type="hidden" name="delete_job_id" value="<?php echo $job['id']; ?>">
                        <button type="submit" class="btn btn-sm btn-delete">Supprimer</button>
                    </form>
                </td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>
<!-- Bootstrap JS CDN -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
