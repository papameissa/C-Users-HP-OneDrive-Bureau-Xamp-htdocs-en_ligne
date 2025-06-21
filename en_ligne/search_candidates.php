<?php
session_start();
require_once 'config.php';

// Vérifier que l'utilisateur est connecté et est recruteur
if (!isset($_SESSION["loggedin"]) || $_SESSION["type_utilisateur"] !== 'recruteur') {
    header("location: login.php");
    exit;
}

$search_skills = $search_education = $search_experience = "";
$results = [];

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $search_skills = trim($_GET['skills'] ?? '');
    $search_education = trim($_GET['education'] ?? '');
    $search_experience = trim($_GET['experience'] ?? '');

    $sql = "SELECT u.id, u.email, p.nom_complet, p.niveau_etudes, p.competences, p.experience
            FROM utilisateurs u
            JOIN profils_candidats p ON u.id = p.utilisateur_id
            WHERE u.type_utilisateur = 'candidat' AND u.statut = 'actif'";

    $params = [];

    if ($search_skills !== '') {
        $sql .= " AND p.competences LIKE :skills";
        $params[':skills'] = '%' . $search_skills . '%';
    }
    if ($search_education !== '') {
        $sql .= " AND p.niveau_etudes LIKE :education";
        $params[':education'] = '%' . $search_education . '%';
    }
    if ($search_experience !== '') {
        $sql .= " AND p.experience LIKE :experience";
        $params[':experience'] = '%' . $search_experience . '%';
    }

    $stmt = $pdo->prepare($sql);
    foreach ($params as $key => $val) {
        $stmt->bindValue($key, $val, PDO::PARAM_STR);
    }
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Recherche de candidats - AURA_infini</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Bootstrap CSS CDN -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        /* Style inspiré de l'image fournie */
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            background: linear-gradient(135deg, #007bff 0%, #ff7e5f 100%);
            color: white;
            min-height: 100vh;
            padding: 40px 20px;
        }
        h1 {
            font-weight: 700;
            font-size: 2.5rem;
            margin-bottom: 30px;
            text-align: center;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.1);
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }
        .candidate-card {
            background: rgba(255, 255, 255, 0.15);
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            color: white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
        .candidate-name {
            font-weight: 700;
            font-size: 1.4rem;
        }
        .candidate-info {
            margin-top: 5px;
        }
        .search-form .form-control {
            max-width: 300px;
            margin-right: 10px;
            background-color: transparent !important;
            color: white !important;
            border: 1px solid rgba(255, 255, 255, 0.5);
            border-radius: 0;
        }
        .search-form .form-control::placeholder {
            color: rgba(255, 255, 255, 0.8) !important;
        }
        .search-form .form-control:focus {
            background-color: rgba(255, 255, 255, 0.2) !important;
            color: white !important;
            border-color: #007bff !important;
            box-shadow: 0 0 0 0.2rem rgba(0,123,255,.75) !important;
            outline: none !important;
        }
        .search-form .btn-search {
            min-width: 120px;
            background-color: #00aaff;
            border: none;
            font-weight: 600;
            color: white;
        }
        .search-form .btn-search:hover {
            background-color: #0088cc;
        }
        .alert-danger {
            background-color: rgba(255, 0, 0, 0.7);
            border: none;
            color: white;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <a href="espace_recruteur.php" class="back-button">&larr; Retour</a>
        <h1>Recherche de candidats</h1>
        <form method="GET" class="search-form d-flex align-items-center mb-4" action="search_candidates.php">
            <input type="text" name="skills" class="form-control" placeholder="Compétences" value="<?php echo htmlspecialchars($search_skills); ?>">
            <input type="text" name="education" class="form-control" placeholder="Niveau d'études" value="<?php echo htmlspecialchars($search_education); ?>">
            <input type="text" name="experience" class="form-control" placeholder="Expérience" value="<?php echo htmlspecialchars($search_experience); ?>">
            <button type="submit" class="btn btn-primary btn-search">Rechercher</button>
        </form>

        <?php if (count($results) === 0): ?>
            <p>Aucun candidat trouvé avec ces critères.</p>
        <?php else: ?>
            <?php foreach ($results as $candidate): ?>
                <div class="candidate-card">
                    <div class="candidate-name"><?php echo htmlspecialchars($candidate['nom_complet'] ?? 'N/A'); ?></div>
                    <div class="candidate-info"><strong>Email:</strong> <?php echo htmlspecialchars($candidate['email']); ?></div>
                    <div class="candidate-info"><strong>Niveau d'études:</strong> <?php echo htmlspecialchars($candidate['niveau_etudes']); ?></div>
                    <div class="candidate-info"><strong>Compétences:</strong> <?php echo nl2br(htmlspecialchars($candidate['competences'])); ?></div>
                    <div class="candidate-info"><strong>Expérience:</strong> <?php echo nl2br(htmlspecialchars($candidate['experience'])); ?></div>
                </div>
            <?php endforeach; ?>
        <?php endif; ?>
    </div>
</body>
</html>
