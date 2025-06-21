<?php
session_start();
if (!isset($_SESSION["loggedin"]) || $_SESSION["type_utilisateur"] !== "candidat") {
    header("location: login.php");
    exit;
}
require_once 'config.php';

$user_id = $_SESSION["id"];
$errors = [];
$success = "";

// Récupérer le profil existant
$sql = "SELECT * FROM profils_candidats WHERE utilisateur_id = :user_id";
$stmt = $pdo->prepare($sql);
$stmt->bindParam(':user_id', $user_id);
$stmt->execute();
$profile = $stmt->fetch();

// Traitement du formulaire
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nom_complet = trim($_POST['nom_complet']);
    $telephone = trim($_POST['telephone']);
    $adresse = trim($_POST['adresse']);
    $niveau_etudes = trim($_POST['niveau_etudes']);
    $competences = trim($_POST['competences']);
    $experience = trim($_POST['experience']);

    // Validation simple
    if (empty($nom_complet)) {
        $errors[] = "Le nom complet est obligatoire.";
    }

    // Gestion du téléchargement du CV
    $cv_filename = $profile ? $profile['nom_fichier_cv'] : null;
    if (isset($_FILES['cv']) && $_FILES['cv']['error'] == UPLOAD_ERR_OK) {
        $allowed_types = ['application/pdf'];
        if (!in_array($_FILES['cv']['type'], $allowed_types)) {
            $errors[] = "Le CV doit être un fichier PDF.";
        } else {
            $upload_dir = 'uploads/cv/';
            if (!is_dir($upload_dir)) {
                mkdir($upload_dir, 0755, true);
            }
            $cv_filename = $upload_dir . uniqid() . '_' . basename($_FILES['cv']['name']);
            if (!move_uploaded_file($_FILES['cv']['tmp_name'], $cv_filename)) {
                $errors[] = "Erreur lors du téléchargement du CV.";
            }
        }
    }

    if (empty($errors)) {
        if ($profile) {
            // Mise à jour
            $sql = "UPDATE profils_candidats SET nom_complet = :nom_complet, telephone = :telephone, adresse = :adresse, niveau_etudes = :niveau_etudes, competences = :competences, experience = :experience, nom_fichier_cv = :cv_filename WHERE utilisateur_id = :user_id";
        } else {
            // Insertion
            $sql = "INSERT INTO profils_candidats (nom_complet, telephone, adresse, niveau_etudes, competences, experience, nom_fichier_cv, utilisateur_id) VALUES (:nom_complet, :telephone, :adresse, :niveau_etudes, :competences, :experience, :cv_filename, :user_id)";
        }
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':nom_complet', $nom_complet);
        $stmt->bindParam(':telephone', $telephone);
        $stmt->bindParam(':adresse', $adresse);
        $stmt->bindParam(':niveau_etudes', $niveau_etudes);
        $stmt->bindParam(':competences', $competences);
        $stmt->bindParam(':experience', $experience);
        $stmt->bindParam(':cv_filename', $cv_filename);
        $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
        if ($stmt->execute()) {
            $success = "Profil mis à jour avec succès.";
            // Recharger le profil
            $stmt = $pdo->prepare("SELECT * FROM profils_candidats WHERE utilisateur_id = :user_id");
            $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
            $stmt->execute();
            $profile = $stmt->fetch();
        } else {
            $errors[] = "Erreur lors de la mise à jour du profil.";
        }
    }
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Mon Profil - AURA_infini</title>
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
        .profile-container {
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
        .form-control, .form-select {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
        }
        .form-control:focus, .form-select:focus {
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
        a {
            color: #cce7ff;
        }
        a:hover {
            color: white;
            text-decoration: underline;
        }
    </style>
</head>
<body>
<div class="profile-container">
    <h1>Mon Profil</h1>
    <nav>
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
    <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post" enctype="multipart/form-data" novalidate>
        <div class="mb-3">
            <label for="nom_complet">Nom complet</label>
            <input type="text" name="nom_complet" id="nom_complet" class="form-control" value="<?php echo htmlspecialchars($profile ? $profile['nom_complet'] : ''); ?>" required>
        </div>
        <div class="mb-3">
            <label for="telephone">Téléphone</label>
            <input type="text" name="telephone" id="telephone" class="form-control" value="<?php echo htmlspecialchars($profile ? $profile['telephone'] : ''); ?>">
        </div>
        <div class="mb-3">
            <label for="adresse">Adresse</label>
            <input type="text" name="adresse" id="adresse" class="form-control" value="<?php echo htmlspecialchars($profile ? $profile['adresse'] : ''); ?>">
        </div>
        <div class="mb-3">
            <label for="niveau_etudes">Niveau d'études</label>
            <select name="niveau_etudes" id="niveau_etudes" class="form-select">
                <option value="">Sélectionnez</option>
                <option value="Bac" <?php if ($profile && $profile['niveau_etudes'] == 'Bac') echo 'selected'; ?>>Bac</option>
                <option value="Bac+2" <?php if ($profile && $profile['niveau_etudes'] == 'Bac+2') echo 'selected'; ?>>Bac+2</option>
                <option value="Licence" <?php if ($profile && $profile['niveau_etudes'] == 'Licence') echo 'selected'; ?>>Licence</option>
                <option value="Master" <?php if ($profile && $profile['niveau_etudes'] == 'Master') echo 'selected'; ?>>Master</option>
                <option value="Doctorat" <?php if ($profile && $profile['niveau_etudes'] == 'Doctorat') echo 'selected'; ?>>Doctorat</option>
            </select>
        </div>
        <div class="mb-3">
            <label for="competences">Compétences</label>
            <textarea name="competences" id="competences" class="form-control" rows="4"><?php echo htmlspecialchars($profile ? $profile['competences'] : ''); ?></textarea>
        </div>
        <div class="mb-3">
            <label for="experience">Expérience</label>
            <textarea name="experience" id="experience" class="form-control" rows="4"><?php echo htmlspecialchars($profile ? $profile['experience'] : ''); ?></textarea>
        </div>
        <div class="mb-3">
            <label for="cv">Télécharger CV (PDF uniquement)</label>
            <input type="file" name="cv" id="cv" class="form-control" accept="application/pdf">
            <?php if ($profile && $profile['nom_fichier_cv']): ?>
                <p>CV actuel : <a href="<?php echo htmlspecialchars($profile['nom_fichier_cv']); ?>" target="_blank">Voir / Télécharger</a></p>
            <?php endif; ?>
        </div>
        <div class="mb-3">
            <input type="submit" class="btn btn-primary" value="Enregistrer">
        </div>
    </form>
</div>
<!-- Bootstrap JS CDN -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
