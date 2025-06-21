<?php
session_start();
if (!isset($_SESSION["loggedin"])) {
    header("location: login.php");
    exit;
}
require_once 'config.php';

$user_id = $_SESSION["id"];
$errors = [];
$success = "";

// Traitement du formulaire de dépôt de CV
if ($_SERVER["REQUEST_METHOD"] == "POST") {
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
            if (move_uploaded_file($_FILES['cv']['tmp_name'], $cv_filename)) {
                // Enregistrer le CV dans le profil candidat
                $sql = "SELECT * FROM profils_candidats WHERE utilisateur_id = :user_id";
                $stmt = $pdo->prepare($sql);
                $stmt->bindParam(':user_id', $user_id);
                $stmt->execute();
                $profile = $stmt->fetch();

                if ($profile) {
                    $sql = "UPDATE profils_candidats SET nom_fichier_cv = :cv_filename WHERE utilisateur_id = :user_id";
                } else {
                    $sql = "INSERT INTO profils_candidats (utilisateur_id, nom_fichier_cv) VALUES (:user_id, :cv_filename)";
                }
                $stmt = $pdo->prepare($sql);
                $stmt->bindParam(':cv_filename', $cv_filename);
                $stmt->bindParam(':user_id', $user_id);
                if ($stmt->execute()) {
                    $success = "CV déposé avec succès.";
                } else {
                    $errors[] = "Erreur lors de l'enregistrement du CV.";
                }
            } else {
                $errors[] = "Erreur lors du téléchargement du fichier.";
            }
        }
    } else {
        $errors[] = "Veuillez sélectionner un fichier PDF.";
    }
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Dépôt de CV - Cadremploi</title>
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
        .depot-container {
            max-width: 600px;
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
        .form-control {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
        }
        .form-control:focus {
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
<div class="depot-container">
    <h1>Dépôt de CV</h1>
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
            <label for="cv">Sélectionnez votre CV (PDF uniquement)</label>
            <input type="file" name="cv" id="cv" class="form-control" accept="application/pdf" required>
        </div>
        <div class="mb-3">
            <input type="submit" class="btn btn-primary" value="Déposer le CV">
        </div>
    </form>
</div>
<!-- Bootstrap JS CDN -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
