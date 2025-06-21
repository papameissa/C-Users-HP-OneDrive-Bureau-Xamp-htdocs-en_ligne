<?php
// Page de choix d'inscription entre candidat et recruteur
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Inscription - AURA_infini</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Bootstrap CSS CDN -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            background: #1e3a8a; /* deep blue background */
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
        .choice-container {
            position: relative;
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
            padding: 40px 50px;
            border-radius: 20px;
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
            text-align: center;
            width: 100%;
            max-width: 400px;
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
        h1 {
            font-weight: 700;
            margin-bottom: 30px;
            font-size: 2rem;
        }
        a.btn {
            margin: 10px;
            width: 150px;
            font-weight: 600;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transition: background-color 0.3s ease;
        }
        a.btn-candidat {
            background-color: #3b82f6;
            color: white;
        }
        a.btn-candidat:hover {
            background-color: #2563eb;
            color: white;
        }
        a.btn-recruteur {
            background-color: #2563eb;
            color: white;
        }
        a.btn-recruteur:hover {
            background-color: #1e40af;
            color: white;
        }
    </style>
</head>
<body>
<div class="choice-container">
    <h1>Inscription</h1>
    <p>Choisissez votre type de compte :</p>
    <a href="register_candidate.php" class="btn btn-candidat btn-lg">Candidat</a>
    <a href="register_recruiter.php" class="btn btn-recruteur btn-lg">Recruteur</a>
</div>
<!-- Bootstrap JS CDN -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
