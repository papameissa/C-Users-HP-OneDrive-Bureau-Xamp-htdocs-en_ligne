<?php
// Démarrer la session
session_start();
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>AURA_infini - Recrutement en ligne</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Bootstrap CSS CDN -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Custom CSS -->
    <style>
        
        .hero {
            background: linear-gradient(rgba(0,123,255,0.6), rgba(255,123,123,0.6)), url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1470&q=80') no-repeat center center;
            background-size: cover;
            color: white;
            padding: 1px 15px 20px 15px;
            text-align: center;
            position: relative;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .hero h1 {
            font-weight: 700;
            font-size: 2.5rem;
            margin-bottom: 40px;
        }
        .search-bar input, .search-bar select {
            border-radius: 0;
            height: 45px;
            background-color: transparent !important;
            color: white !important;
            border: 1px solid rgba(255, 255, 255, 0.5);
            backdrop-filter: none !important;
        }
        .search-bar input::placeholder, .search-bar select {
            color: rgba(255, 255, 255, 0.8) !important;
        }
        .search-bar input:focus, .search-bar select:focus {
            background-color: rgba(255, 255, 255, 0.2) !important;
            color: white !important;
            border-color: #007bff !important;
            box-shadow: 0 0 0 0.2rem rgba(0,123,255,.75) !important;
            outline: none !important;
        }
         .search-bar select option {
            background-color: rgba(0,123,255,0.6) !important;
            color: #fff !important;
        }
        .search-bar select {
            background-color: transparent !important;
            color: white !important;
            backdrop-filter: none !important;
            box-shadow: none !important;
        }
        .search-bar .btn-search {
            background-color: transparent !important;
            color: white;
            border-radius: 0;
            height: 45px;
            width: 60px;
        }
        .search-bar .btn-search:hover {
            background-color: #0056b3;
        }
        .navbar-nav .nav-link {
            color: #555;
            font-weight: 500;
        }
        .navbar-nav .nav-link:hover {
            color: #007bff;
        }
        .btn-inscription {
            background-color: #00aaff;
            color: white;
            font-weight: 600;
        }
        .btn-inscription:hover {
            background-color: #0088cc;
            color: white;
        }
    </style>
</head>
<body>
    
    <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
        <div class="container">
            <a class="navbar-brand d-flex align-items-center" href="index.php">

                 <span>AURA_infini</span> 
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
                <ul class="navbar-nav align-items-center">
                    <li class="nav-item dropdown">
                       
                        <ul class="dropdown-menu" aria-labelledby="offresDropdown">
                            <li><a class="dropdown-item" href="offres_secteur.php">Par secteur</a></li>
                            <li><a class="dropdown-item" href="offres_localisation.php">Par localisation</a></li>
                            <li><a class="dropdown-item" href="offres_contrat.php">Par type de contrat</a></li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown">
                        
                        <ul class="dropdown-menu" aria-labelledby="actualiteDropdown">
                            <li><a class="dropdown-item" href="actualite_conseils_carriere.php">Conseils carrière</a></li>
                            <li><a class="dropdown-item" href="actualite_tendances_emploi.php">Tendances emploi</a></li>
                        </ul>
                    </li>
                    <li class="nav-item dropdown">
                        
                        <ul class="dropdown-menu" aria-labelledby="conseilsDropdown">
                            <li><a class="dropdown-item" href="conseils_rediger_cv.php">Rédiger un CV</a></li>
                            <li><a class="dropdown-item" href="conseils_entretien_embauche.php">Entretien d'embauche</a></li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="depot_cv.php">Dépôt de CV</a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="espaceRecruteurDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Espace recruteur
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="espaceRecruteurDropdown">
                            <li><a class="dropdown-item" href="register_recruiter.php">Créer un compte</a></li>
                            <li><a class="dropdown-item" href="login.php">Connexion</a></li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a class="btn btn-inscription px-4 me-2" href="inscription.php">Inscription</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="login.php">Connexion</a>
                    </li>
              
                </ul>
            </div>
        </div>
    </nav>

    <!-- Section Hero avec formulaire de recherche -->
    <section class="hero">
        <div class="container">
            <h1>Augmentez votre Aura avec un job.</h1>
            <form class="row g-3 justify-content-center search-bar" method="GET" action="search.php">
                <div class="col-md-4">
                    <input type="text" name="keywords" class="form-control" placeholder="Métier, secteur, mots-clé" aria-label="Recherche par mots-clé">
                </div>
                <div class="col-md-3">
                    <input type="text" name="location" class="form-control" placeholder="Ville, département, région" aria-label="Recherche par localisation">
                </div>
                <div class="col-md-1 d-grid">
                    <button type="submit" class="btn btn-search" aria-label="Rechercher">
                        🔍
                    </button>
                </div>
                <div class="col-md-8 mt-3 d-flex justify-content-center gap-2">
                    <select name="fonction" class="form-select form-select-sm" aria-label="Filtrer par fonction">
                        <option value="" selected>Fonction</option>
                        <option value="developpeur">Développeur</option>
                        <option value="manager">Manager</option>
                        <option value="commercial">Commercial</option>
                    </select>
                    <select name="contrat" class="form-select form-select-sm" aria-label="Filtrer par type de contrat">
                        <option value="" selected>Contrat</option>
                        <option value="cdi">CDI</option>
                        <option value="cdd">CDD</option>
                        <option value="stage">Stage</option>
                    </select>
                    <select name="salaire" class="form-select form-select-sm" aria-label="Filtrer par salaire">
                        <option value="" selected>Salaire</option>
                        <option value="moins_20000">Moins de 20 000€</option>
                        <option value="20000_40000">20 000€ - 40 000€</option>
                        <option value="plus_40000">Plus de 40 000€</option>
                    </select>
                    <select name="secteur" class="form-select form-select-sm" aria-label="Filtrer par secteur">
                        <option value="" selected>Secteur</option>
                        <option value="informatique">Informatique</option>
                        <option value="sante">Santé</option>
                        <option value="finance">Finance</option>
                    </select>
                </div>
            </form>
        </div>
    </section>

    <!-- Section Offres d'emploi récentes -->
    <?php
    require_once 'config.php';
    try {
$stmt = $pdo->query("SELECT id, titre, description, localisation, secteur, type_contrat, salaire, image FROM offres_emploi ORDER BY date_creation DESC LIMIT 6");
$recent_jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        $recent_jobs = [];
    }
    ?>
    <section class="container my-5">
        <h2 class="text-center mb-4 text-primary">Offres d'emploi récentes</h2>
        <div class="row justify-content-center g-4">
<?php if (count($recent_jobs) > 0): ?>
    <?php foreach ($recent_jobs as $job): ?>
        <div class="col-md-4">
            <div class="card h-100 shadow-sm">
                <?php if (!empty($job['image'])): ?>
                    <img src="<?php echo htmlspecialchars($job['image']); ?>" class="card-img-top" alt="Image de l'offre">
                <?php endif; ?>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title"><?php echo htmlspecialchars($job['titre']); ?></h5>
                    <p class="card-text text-truncate"><?php echo nl2br(htmlspecialchars($job['description'])); ?></p>
                    <ul class="list-unstyled mt-auto mb-3">
                        <li><strong>Localisation:</strong> <?php echo htmlspecialchars($job['localisation']); ?></li>
                        <li><strong>Secteur:</strong> <?php echo htmlspecialchars($job['secteur']); ?></li>
                        <li><strong>Type de contrat:</strong> <?php echo htmlspecialchars($job['type_contrat']); ?></li>
                        <li><strong>Salaire:</strong> <?php echo htmlspecialchars($job['salaire']); ?></li>
                    </ul>
                    <a href="apply_job.php?job_id=<?php echo $job['id']; ?>" class="btn btn-primary mt-auto">Postuler</a>
                </div>
            </div>
        </div>
    <?php endforeach; ?>
<?php else: ?>
                <p class="text-center">Aucune offre d'emploi disponible actuellement.</p>
            <?php endif; ?>
        </div>
    </section>

    <!-- Footer -->
    <footer class="text-white text-center py-4 mt-auto" style="width: 100%; margin-top: 0; background: linear-gradient(rgba(10, 92, 179, 0.6));">
        <div class="container">
            <p class="mb-0">&copy; 2024 Cadremploi. Tous droits réservés.</p>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
