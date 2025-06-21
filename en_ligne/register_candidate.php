<?php
session_start();
require_once 'config.php'; // Database connection

// Initialisation des variables
$email = $password = $confirm_password = "";
$email_err = $password_err = $confirm_password_err = $register_err = "";

// Traitement du formulaire lors de la soumission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Validation email
    if (empty(trim($_POST["email"]))) {
        $email_err = "Veuillez entrer un email.";
    } elseif (!filter_var($_POST["email"], FILTER_VALIDATE_EMAIL)) {
        $email_err = "Format d'email invalide.";
    } else {
        // Vérifier si l'email existe déjà
        $sql = "SELECT id FROM utilisateurs WHERE email = :email";
        if ($stmt = $pdo->prepare($sql)) {
            $stmt->bindParam(":email", $param_email, PDO::PARAM_STR);
            $param_email = trim($_POST["email"]);
            if ($stmt->execute()) {
                if ($stmt->rowCount() == 1) {
                    $email_err = "Cet email est déjà utilisé.";
                } else {
                    $email = trim($_POST["email"]);
                }
            } else {
                $register_err = "Erreur serveur, veuillez réessayer plus tard.";
            }
            unset($stmt);
        }
    }

    // Validation mot de passe
    if (empty(trim($_POST["password"]))) {
        $password_err = "Veuillez entrer un mot de passe.";
    } elseif (strlen(trim($_POST["password"])) < 6) {
        $password_err = "Le mot de passe doit contenir au moins 6 caractères.";
    } else {
        $password = trim($_POST["password"]);
    }

    // Validation confirmation mot de passe
    if (empty(trim($_POST["confirm_password"]))) {
        $confirm_password_err = "Veuillez confirmer le mot de passe.";
    } else {
        $confirm_password = trim($_POST["confirm_password"]);
        if (empty($password_err) && ($password != $confirm_password)) {
            $confirm_password_err = "Les mots de passe ne correspondent pas.";
        }
    }

    // Insertion dans la base si pas d'erreurs
    if (empty($email_err) && empty($password_err) && empty($confirm_password_err)) {
        $sql = "INSERT INTO utilisateurs (type_utilisateur, email, mot_de_passe) VALUES ('candidat', :email, :mot_de_passe)";
        if ($stmt = $pdo->prepare($sql)) {
            $stmt->bindParam(":email", $param_email, PDO::PARAM_STR);
            $stmt->bindParam(":mot_de_passe", $param_password, PDO::PARAM_STR);
            $param_email = $email;
            $param_password = password_hash($password, PASSWORD_DEFAULT); // Hash du mot de passe
            if ($stmt->execute()) {
                // Redirection vers la page de connexion
                header("location: login.php");
                exit();
            } else {
                $register_err = "Erreur lors de l'inscription, veuillez réessayer.";
            }
            unset($stmt);
        }
    }
    unset($pdo);
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Inscription Candidat - Cadremploi</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Bootstrap CSS CDN -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            background: linear-gradient(135deg, #007bff 0%, #ff7e5f 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .register-container {
            background: rgba(255, 255, 255, 0.1);
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
            width: 100%;
            max-width: 420px;
        }
        h2 {
            font-weight: 700;
            margin-bottom: 20px;
            text-align: center;
        }
        label {
            font-weight: 600;
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
        .btn-link {
            color: #cce7ff;
            text-align: center;
            display: block;
            margin-top: 15px;
        }
        .btn-link:hover {
            color: #ffffff;
            text-decoration: underline;
        }
        .alert-danger {
            background-color: rgba(255, 0, 0, 0.7);
            border: none;
            color: white;
        }
    </style>
</head>
<body>
<div class="register-container">
    <h2>Inscription Candidat</h2>
    <p class="text-center">Veuillez remplir ce formulaire pour créer un compte candidat.</p>
    <?php 
    if(!empty($register_err)){
        echo '<div class="alert alert-danger">' . $register_err . '</div>';
    }        
    ?>
    <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post" novalidate>
        <div class="mb-3">
            <label>Email</label>
            <input type="email" name="email" class="form-control <?php echo (!empty($email_err)) ? 'is-invalid' : ''; ?>" value="<?php echo htmlspecialchars($email); ?>">
            <div class="invalid-feedback"><?php echo $email_err; ?></div>
        </div>    
        <div class="mb-3">
            <label>Mot de passe</label>
            <input type="password" name="password" class="form-control <?php echo (!empty($password_err)) ? 'is-invalid' : ''; ?>">
            <div class="invalid-feedback"><?php echo $password_err; ?></div>
        </div>
        <div class="mb-3">
            <label>Confirmer le mot de passe</label>
            <input type="password" name="confirm_password" class="form-control <?php echo (!empty($confirm_password_err)) ? 'is-invalid' : ''; ?>">
            <div class="invalid-feedback"><?php echo $confirm_password_err; ?></div>
        </div>
        <div class="mb-3">
            <input type="submit" class="btn btn-primary" value="S'inscrire">
            <a href="login.php" class="btn btn-link">Connexion</a>
        </div>
    </form>
</div>
<!-- Bootstrap JS CDN -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
