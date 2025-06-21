<?php
session_start();
require_once 'config.php';

$email = $password = "";
$email_err = $password_err = $login_err = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (empty(trim($_POST["email"]))) {
        $email_err = "Veuillez entrer votre email.";
    } else {
        $email = trim($_POST["email"]);
    }

    if (empty(trim($_POST["password"]))) {
        $password_err = "Veuillez entrer votre mot de passe.";
    } else {
        $password = trim($_POST["password"]);
    }

    if (empty($email_err) && empty($password_err)) {
        $sql = "SELECT id, type_utilisateur, email, mot_de_passe FROM utilisateurs WHERE email = :email AND statut = 'actif'";
        if ($stmt = $pdo->prepare($sql)) {
            $stmt->bindParam(":email", $param_email, PDO::PARAM_STR);
            $param_email = $email;
            if ($stmt->execute()) {
                if ($stmt->rowCount() == 1) {
                    if ($row = $stmt->fetch()) {
                        $id = $row["id"];
                        $type_utilisateur = $row["type_utilisateur"];
                        $hashed_password = $row["mot_de_passe"];
                        if (password_verify($password, $hashed_password)) {
                            // si mdp correct, démarrer la session
                            $_SESSION["loggedin"] = true;
                            $_SESSION["id"] = $id;
                            $_SESSION["type_utilisateur"] = $type_utilisateur;
                            $_SESSION["email"] = $email;

                            // Récup donnée selon type utilisateur
                            if ($type_utilisateur == 'candidat') {
                                $sql_info = "SELECT nom_complet, nom_fichier_cv FROM profils_candidats WHERE utilisateur_id = :id";
                                $stmt_info = $pdo->prepare($sql_info);
                                $stmt_info->bindParam(':id', $id, PDO::PARAM_INT);
                                $stmt_info->execute();
                                $info = $stmt_info->fetch(PDO::FETCH_ASSOC);
                                if ($info) {
                                    // prendre le premier mot
                                    $prenom = explode(' ', trim($info['nom_complet']))[0];
                                    $_SESSION["prenom"] = $prenom;
                                    // Image de profil : on peut utiliser le CV comme placeholder ou une image par défaut
                                    $_SESSION["image_profil"] = $info['nom_fichier_cv'] ? 'uploads/cv/' . $info['nom_fichier_cv'] : 'uploads/default_user.png';
                                } else {
                                    $_SESSION["prenom"] = "Candidat";
                                    $_SESSION["image_profil"] = 'uploads/default_user.png';
                                }
                                header("location: candidate_dashboard.php");
                            } elseif ($type_utilisateur == 'recruteur') {
                                // Pour recruteur, on peut récupérer le nom de l'entreprise comme prénom et une image par défaut
                                $sql_info = "SELECT nom_entreprise FROM utilisateurs WHERE id = :id";
                                $stmt_info = $pdo->prepare($sql_info);
                                $stmt_info->bindParam(':id', $id, PDO::PARAM_INT);
                                $stmt_info->execute();
                                $info = $stmt_info->fetch(PDO::FETCH_ASSOC);
                                $_SESSION["prenom"] = $info['nom_entreprise'] ?? "Recruteur";
                                $_SESSION["image_profil"] = 'uploads/default_company.png';
                                header("location: recruiter_dashboard.php");
                            } elseif ($type_utilisateur == 'admin') {
                                $_SESSION["prenom"] = "Admin";
                                $_SESSION["image_profil"] = 'uploads/default_admin.png';
                                header("location: admin_dashboard.php");
                            } else {
                                header("location: index.php");
                            }
                            exit();
                        } else {
                            $login_err = "Mot de passe incorrect.";
                        }
                    }
                } else {
                    $login_err = "Votre compte est bloqué.";
                }
            } else {
                $login_err = "Erreur serveur, veuillez réessayer plus tard.";
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
    <title>Connexion - AURA_infini</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Bootstrap CSS CDN -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            background: #1e3a8a; 
            color: white;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            position: relative;
            overflow: hidden;
        }
        body::before {
            content: "";
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle at center, #3b82f6, #1e3a8a);
            filter: blur(100px);
            z-index: 0;
        }
        .login-container {
            position: relative;
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
            padding: 10px 40px;
            border-radius: 20px;
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
            width: 100%;
            max-width: 420px;
            z-index: 1;
            animation: coolFadeSlideUp 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            opacity: 0;
        }
        @keyframes coolFadeSlideUp {
            0% {
                opacity: 0;
                transform: translateY(40px) scale(0.95);
            }
            60% {
                opacity: 1;
                transform: translateY(-10px) scale(1.02);
            }
            80% {
                transform: translateY(5px) scale(0.98);
            }
            100% {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        h2 {
            font-weight: 700;
            margin-bottom: 20px;
            text-align: center;
            font-size: 2rem;
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
            background-color: #3b82f6;
            border: none;
            font-weight: 600;
            width: 100%;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transition: background-color 0.3s ease;
        }
        .btn-primary:hover {
            background-color: #2563eb;
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
        .admin-login-link {
            margin-top: 15px;
            display: block;
            text-align: center;
            color: #cce7ff;
        }
        .admin-login-link:hover {
            color: #ffffff;
            text-decoration: underline;
        }
       
        /* Idle bounce animation */
        @keyframes idleBounce {
            0%, 100% {
                transform: translateY(0);
            }
            50% {
                transform: translateY(-10px);
            }
        }
    </style>
</head>
<body>
<div class="login-container" id="login-container">
    <h2>Connexion</h2>
    <p class="text-center">Veuillez entrer vos identifiants pour vous connecter.</p>
    <?php 
    if(!empty($login_err)){
        echo '<div class="alert alert-danger">' . $login_err . '</div>';
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
            <input type="submit" class="btn btn-primary" value="Se connecter">
        </div>
    </form>
    <a href="register_candidate.php" class="btn btn-link">Inscription candidat</a>
    <a href="register_recruiter.php" class="btn btn-link">Inscription recruteur</a>
    <a href="admin_login.php" class="btn btn-link admin-login-link">Connexion Administrateur</a>
    <div id="emoji" style="font-size: 3rem; margin-top: 20px; opacity: 0; transition: opacity 0.5s ease;">😊</div>
</div>

<!-- Bootstrap JS CDN -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

