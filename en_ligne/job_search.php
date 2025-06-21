<?php
session_start();
if (!isset($_SESSION["loggedin"]) || $_SESSION["type_utilisateur"] !== "candidat") {
    header("location: login.php");
    exit;
}
require_once 'config.php';

// Récupérer les filtres de recherche
$keywords = isset($_GET['keywords']) ? trim($_GET['keywords']) : '';
$location = isset($_GET['location']) ? trim($_GET['location']) : '';
$fonction = isset($_GET['fonction']) ? trim($_GET['fonction']) : '';
$contrat = isset($_GET['contrat']) ? trim($_GET['contrat']) : '';
$salaire = isset($_GET['salaire']) ? trim($_GET['salaire']) : '';
$secteur = isset($_GET['secteur']) ? trim($_GET['secteur']) : '';

// Construire la requête SQL avec filtres
$sql = "SELECT * FROM offres_emploi WHERE 1=1";
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
    // Simplification: filter by salary range keywords
    if ($salaire == 'moins_20000') {
        $sql .= " AND salaire LIKE 'moins%'";
    } elseif ($salaire == '20000_40000') {
        $sql .= " AND salaire LIKE '20%à40%'";
    } elseif ($salaire == 'plus_40000') {
        $sql .= " AND salaire LIKE 'plus%'";
    }
}
if ($secteur !== '') {
    $sql .= " AND secteur = :secteur";
    $params[':secteur'] = $secteur;
}

$sql .= " ORDER BY date_creation DESC";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$jobs = $stmt->fetchAll();
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Recherche d'offres - Cadremploi</title>
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
        .search-container {
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
        .job-card {
            background: rgba(255, 255, 255, 0.15);
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 15px;
            color: white;
        }
        .btn-primary {
            background-color: #00aaff;
            border: none;
            font-weight: 600;
        }
        .btn-primary:hover {
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
<div class="search-container">
    <h1>Recherche d'offres d'emploi</h1>
    <nav>
        <a href="candidate_dashboard.php">Tableau de bord</a> |
        <a href="logout.php">Déconnexion</a>
    </nav>
    <form method="GET" class="row g-3 mt-3 mb-4">
        <div class="col-md-4">
            <input type="text" name="keywords" class="form-control" placeholder="Métier, secteur, mots-clé" value="<?php echo htmlspecialchars($keywords); ?>">
        </div>
        <div class="col-md-3">
            <input type="text" name="location" class="form-control" placeholder="Ville, département, région" value="<?php echo htmlspecialchars($location); ?>">
        </div>
        <div class="col-md-2">
            <select name="fonction" class="form-select">
                <option value="">Fonction</option>
                <option value="Développeur" <?php if ($fonction == 'Développeur') echo 'selected'; ?>>Développeur</option>
                <option value="Manager" <?php if ($fonction == 'Manager') echo 'selected'; ?>>Manager</option>
                <option value="Commercial" <?php if ($fonction == 'Commercial') echo 'selected'; ?>>Commercial</option>
            </select>
        </div>
        <div class="col-md-1">
            <select name="contrat" class="form-select">
                <option value="">Contrat</option>
                <option value="CDI" <?php if ($contrat == 'CDI') echo 'selected'; ?>>CDI</option>
                <option value="CDD" <?php if ($contrat == 'CDD') echo 'selected'; ?>>CDD</option>
                <option value="Stage" <?php if ($contrat == 'Stage') echo 'selected'; ?>>Stage</option>
            </select>
        </div>
        <div class="col-md-1">
            <select name="salaire" class="form-select">
                <option value="">Salaire</option>
                <option value="moins_20000" <?php if ($salaire == 'moins_20000') echo 'selected'; ?>>Moins de 20 000€</option>
                <option value="20000_40000" <?php if ($salaire == '20000_40000') echo 'selected'; ?>>20 000€ - 40 000€</option>
                <option value="plus_40000" <?php if ($salaire == 'plus_40000') echo 'selected'; ?>>Plus de 40 000€</option>
            </select>
        </div>
        <div class="col-md-1">
            <select name="secteur" class="form-select">
                <option value="">Secteur</option>
                <option value="Informatique" <?php if ($secteur == 'Informatique') echo 'selected'; ?>>Informatique</option>
                <option value="Santé" <?php if ($secteur == 'Santé') echo 'selected'; ?>>Santé</option>
                <option value="Finance" <?php if ($secteur == 'Finance') echo 'selected'; ?>>Finance</option>
            </select>
        </div>
        <div class="col-md-1 d-grid">
            <button type="submit" class="btn btn-primary">🔍</button>
        </div>
    </form>

    <?php if (count($jobs) > 0): ?>
        <?php foreach ($jobs as $job): ?>
            <div class="job-card">
                <h5><?php echo htmlspecialchars($job['titre']); ?></h5>
                <p><strong>Localisation:</strong> <?php echo htmlspecialchars($job['localisation']); ?></p>
                <p><strong>Secteur:</strong> <?php echo htmlspecialchars($job['secteur']); ?></p>
                <p><strong>Type de contrat:</strong> <?php echo htmlspecialchars($job['type_contrat']); ?></p>
                <p><strong>Salaire:</strong> <?php echo htmlspecialchars($job['salaire']); ?></p>
                <p><?php echo nl2br(htmlspecialchars($job['description'])); ?></p>
                <a href="apply_job.php?job_id=<?php echo $job['id']; ?>" class="btn btn-primary">Postuler</a>
            </div>
        <?php endforeach; ?>
    <?php else: ?>
        <p>Aucune offre trouvée correspondant à vos critères.</p>
    <?php endif; ?>
</div>
<!-- Bootstrap JS CDN -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
