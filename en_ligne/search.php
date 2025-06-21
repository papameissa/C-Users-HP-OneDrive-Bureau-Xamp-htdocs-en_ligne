<?php
session_start();
require_once 'config.php';

// Récupération des paramètres de recherche
$keywords = isset($_GET['keywords']) ? trim($_GET['keywords']) : '';
$location = isset($_GET['location']) ? trim($_GET['location']) : '';
$fonction = isset($_GET['fonction']) ? trim($_GET['fonction']) : '';
$contrat = isset($_GET['contrat']) ? trim($_GET['contrat']) : '';
$salaire = isset($_GET['salaire']) ? trim($_GET['salaire']) : '';
$secteur = isset($_GET['secteur']) ? trim($_GET['secteur']) : '';

// Construction de la requête SQL avec filtres
$sql = "SELECT * FROM offres_emploi WHERE 1=1 ";
$params = [];

if ($keywords !== '') {
    $sql .= " AND (titre LIKE :keywords OR description LIKE :keywords)";
    $params[':keywords'] = "%$keywords%";
}
if ($location !== '') {
    $sql .= " AND localisation LIKE :location";
    $params[':location'] = "%$location%";
}
if ($fonction !== '') {
    $sql .= " AND titre LIKE :fonction";
    $params[':fonction'] = "%$fonction%";
}
if ($contrat !== '') {
    $sql .= " AND type_contrat = :contrat";
    $params[':contrat'] = $contrat;
}
if ($salaire !== '') {
    // Simple salary filter example
    if ($salaire == 'moins_20000') {
        $sql .= " AND salaire LIKE 'moins%'";
    } elseif ($salaire == '20000_40000') {
        $sql .= " AND salaire LIKE '20%'";
    } elseif ($salaire == 'plus_40000') {
        $sql .= " AND salaire LIKE 'plus%'";
    }
}
if ($secteur !== '') {
    $sql .= " AND secteur = :secteur";
    $params[':secteur'] = $secteur;
}

$sql .= " ORDER BY date_creation DESC";

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die("Erreur lors de la recherche : " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Résultats de recherche - AURA_infini</title>
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
        }
        h2 {
            font-weight: 700;
            margin-bottom: 20px;
            text-align: center;
        }
        .list-group-item {
            background: transparent;
            border: 1px solid rgba(255,255,255,0.3);
            color: white;
            margin-bottom: 15px;
            border-radius: 8px;
        }
        .list-group-item h5 {
            font-weight: 700;
        }
        a.btn-primary {
            background-color: #00aaff;
            border: none;
            font-weight: 600;
        }
        a.btn-primary:hover {
            background-color: #0088cc;
            color: white;
        }
    </style>
</head>
<body>
<div class="container">
    <h2>Résultats de la recherche</h2>
    <?php if (count($jobs) > 0): ?>
        <ul class="list-group">
            <?php foreach ($jobs as $job): ?>
                <li class="list-group-item">
                    <h5><?php echo htmlspecialchars($job['titre']); ?></h5>
                    <p><?php echo nl2br(htmlspecialchars($job['description'])); ?></p>
                    <p><strong>Localisation:</strong> <?php echo htmlspecialchars($job['localisation']); ?></p>
                    <p><strong>Secteur:</strong> <?php echo htmlspecialchars($job['secteur']); ?></p>
                    <p><strong>Type de contrat:</strong> <?php echo htmlspecialchars($job['type_contrat']); ?></p>
                    <p><strong>Salaire:</strong> <?php echo htmlspecialchars($job['salaire']); ?></p>
                    <a href="apply_job.php?job_id=<?php echo $job['id']; ?>" class="btn btn-primary">Postuler</a>
                </li>
            <?php endforeach; ?>
        </ul>
    <?php else: ?>
        <p>Aucune offre d'emploi ne correspond à votre recherche.</p>
    <?php endif; ?>
    <a href="index.php" class="btn btn-primary mt-3">Retour à l'accueil</a>
</div>
<!-- Bootstrap JS CDN -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
