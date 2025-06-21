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

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $titre = trim($_POST['titre']);
    $description = trim($_POST['description']);
    $localisation = trim($_POST['localisation']);
    $secteur = trim($_POST['secteur']);
    $type_contrat = trim($_POST['type_contrat']);
    $salaire = trim($_POST['salaire']);
    $image_path = null;

    // Validation simple
    if (empty($titre)) {
        $errors[] = "Le titre est obligatoire.";
    }
    if (empty($description)) {
        $errors[] = "La description est obligatoire.";
    }

    // Gestion du téléchargement de l'image
    if (isset($_FILES['image']) && $_FILES['image']['error'] == UPLOAD_ERR_OK) {
        $allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
        if (!in_array($_FILES['image']['type'], $allowed_types)) {
            $errors[] = "Le fichier image doit être au format JPG, PNG ou GIF.";
        } else {
            $upload_dir = 'uploads/job_images/';
            if (!is_dir($upload_dir)) {
                mkdir($upload_dir, 0755, true);
            }
            $image_path = $upload_dir . uniqid() . '_' . basename($_FILES['image']['name']);
            if (!move_uploaded_file($_FILES['image']['tmp_name'], $image_path)) {
                $errors[] = "Erreur lors du téléchargement de l'image.";
            }
        }
    }

    if (empty($errors)) {
        $sql = "INSERT INTO offres_emploi (recruteur_id, titre, description, localisation, secteur, type_contrat, salaire, image) VALUES (:recruteur_id, :titre, :description, :localisation, :secteur, :type_contrat, :salaire, :image)";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':recruteur_id', $user_id);
        $stmt->bindParam(':titre', $titre);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':localisation', $localisation);
        $stmt->bindParam(':secteur', $secteur);
        $stmt->bindParam(':type_contrat', $type_contrat);
        $stmt->bindParam(':salaire', $salaire);
        $stmt->bindParam(':image', $image_path);
        if ($stmt->execute()) {
            $success = "Offre ajoutée avec succès.";
        } else {
            $errors[] = "Erreur lors de l'ajout de l'offre.";
        }
    }
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Ajouter une offre - AURA_infini</title>
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
        .add-job-container {
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
            background: rgba(0, 0, 0, 0.3);
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
        img.preview {
            max-width: 100%;
            max-height: 200px;
            margin-top: 10px;
            border-radius: 8px;
        }
    </style>
    <script>
        function previewImage(event) {
            var output = document.getElementById('imagePreview');
            output.src = URL.createObjectURL(event.target.files[0]);
            output.style.display = 'block';
        }
    </script>
</head>
<body>
<div class="add-job-container">
    <h1>Ajouter une offre d'emploi</h1>
    <nav>
        <a href="manage_jobs.php">Gérer mes offres</a> |
        <a href="recruiter_dashboard.php">Tableau de bord</a> |
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
            <label for="titre">Titre</label>
            <input type="text" name="titre" id="titre" class="form-control" value="<?php echo isset($titre) ? htmlspecialchars($titre) : ''; ?>" required>
        </div>
        <div class="mb-3">
            <label for="description">Description</label>
            <textarea name="description" id="description" class="form-control" rows="5" required><?php echo isset($description) ? htmlspecialchars($description) : ''; ?></textarea>
        </div>
        <div class="mb-3">
            <label for="localisation">Localisation</label>
            <input type="text" name="localisation" id="localisation" class="form-control" value="<?php echo isset($localisation) ? htmlspecialchars($localisation) : ''; ?>">
        </div>
        <div class="mb-3">
            <label for="secteur">Secteur</label>
            <input type="text" name="secteur" id="secteur" class="form-control" value="<?php echo isset($secteur) ? htmlspecialchars($secteur) : ''; ?>">
        </div>
        <div class="mb-3">
            <label for="type_contrat">Type de contrat</label>
            <select name="type_contrat" id="type_contrat" class="form-select">
                <option value="">Sélectionnez</option>
                <option value="CDI" <?php if (isset($type_contrat) && $type_contrat == 'CDI') echo 'selected'; ?>>CDI</option>
                <option value="CDD" <?php if (isset($type_contrat) && $type_contrat == 'CDD') echo 'selected'; ?>>CDD</option>
                <option value="Stage" <?php if (isset($type_contrat) && $type_contrat == 'Stage') echo 'selected'; ?>>Stage</option>
            </select>
        </div>
        <div class="mb-3">
            <label for="salaire">Salaire</label>
            <input type="text" name="salaire" id="salaire" class="form-control" value="<?php echo isset($salaire) ? htmlspecialchars($salaire) : ''; ?>">
        </div>
        <div class="mb-3">
            <label for="image">Image (JPG, PNG, GIF)</label>
            <input type="file" name="image" id="image" class="form-control" accept="image/*" onchange="previewImage(event)">
            <img id="imagePreview" class="preview" style="display:none;" />
        </div>
        <div class="mb-3">
            <input type="submit" class="btn btn-primary" value="Ajouter l'offre">
        </div>
    </form>
</div>
<!-- Bootstrap JS CDN -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
