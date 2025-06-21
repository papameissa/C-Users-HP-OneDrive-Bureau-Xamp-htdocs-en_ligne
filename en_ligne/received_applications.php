<?php
// Gestion des actions accepter/refuser
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'], $_POST['application_id'])) {
    session_start();
    require_once 'config.php';

    if (!isset($_SESSION["loggedin"]) || $_SESSION["type_utilisateur"] !== 'recruteur') {
        header("location: login.php");
        exit;
    }

    $application_id = (int)$_POST['application_id'];
    $action = $_POST['action'];

    if (in_array($action, ['accepte', 'refuse'])) {
        $sql_update = "UPDATE candidatures SET statut = :statut WHERE id = :id";
        $stmt_update = $pdo->prepare($sql_update);
        $stmt_update->bindParam(':statut', $action, PDO::PARAM_STR);
        $stmt_update->bindParam(':id', $application_id, PDO::PARAM_INT);
        $stmt_update->execute();
    }

    header("Location: received_applications.php");
    exit;
}
?>

<?php
session_start();
require_once 'config.php';

// Vérifier que l'utilisateur est connecté et est recruteur
if (!isset($_SESSION["loggedin"]) || $_SESSION["type_utilisateur"] !== 'recruteur') {
    header("location: login.php");
    exit;
}

$recruteur_id = $_SESSION["id"];

// Récupérer les offres d'emploi du recruteur
$sql_offres = "SELECT id, titre FROM offres_emploi WHERE recruteur_id = :recruteur_id ORDER BY date_creation DESC";
$stmt_offres = $pdo->prepare($sql_offres);
$stmt_offres->bindParam(':recruteur_id', $recruteur_id, PDO::PARAM_INT);
$stmt_offres->execute();
$offres = $stmt_offres->fetchAll(PDO::FETCH_ASSOC);

?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Candidatures reçues - AURA_infini</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- Bootstrap CSS CDN -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        /* Adapté du style CSS de index.php */
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
        .offer-section {
            margin-bottom: 40px;
        }
        .offer-section h3 {
            font-weight: 600;
            font-size: 1.5rem;
            margin-bottom: 20px;
            border-bottom: 2px solid #00aaff;
            padding-bottom: 5px;
        }
        table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0 10px;
        }
        th, td {
            padding: 12px 15px;
            background: rgba(255, 255, 255, 0.15);
            color: white;
            border-radius: 8px;
            text-align: left;
            vertical-align: middle;
        }
        th {
            background: rgba(0, 170, 255, 0.8);
            font-weight: 700;
        }
        tr:hover td {
            background: rgba(0, 170, 255, 0.3);
        }
        .application-status {
            font-weight: 700;
            text-transform: uppercase;
        }
        .status-pending {
            color: #ffc107;
        }
        .status-accepted {
            color: #28a745;
        }
        .status-rejected {
            color: #dc3545;
        }
        .btn-action {
            margin-right: 5px;
        }
        .back-button {
            margin-bottom: 20px;
            display: inline-block;
            background-color: #00aaff;
            color: white;
            padding: 8px 15px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 600;
        }
        .back-button:hover {
            background-color: #0088cc;
            color: white;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <a href="espace_recruteur.php" class="back-button">&larr; Retour</a>
        <h1>Candidatures reçues</h1>
        <?php if (count($offres) === 0): ?>
            <p>Vous n'avez pas encore publié d'offres d'emploi.</p>
        <?php else: ?>
            <?php foreach ($offres as $offre): ?>
                <div class="offer-section">
                    <h3>Offre: <?php echo htmlspecialchars($offre['titre']); ?></h3>
                    <?php
                    // Récupérer les candidatures pour cette offre
                    $sql_candidatures = "SELECT c.id, c.lettre_motivation, c.statut, u.email, p.nom_complet 
                                         FROM candidatures c
                                         JOIN utilisateurs u ON c.candidat_id = u.id
                                         LEFT JOIN profils_candidats p ON u.id = p.utilisateur_id
                                         WHERE c.offre_emploi_id = :offre_id
                                         ORDER BY c.date_candidature DESC";
                    $stmt_candidatures = $pdo->prepare($sql_candidatures);
                    $stmt_candidatures->bindParam(':offre_id', $offre['id'], PDO::PARAM_INT);
                    $stmt_candidatures->execute();
                    $candidatures = $stmt_candidatures->fetchAll(PDO::FETCH_ASSOC);
                    ?>
                    <?php if (count($candidatures) === 0): ?>
                        <p>Aucune candidature reçue pour cette offre.</p>
                    <?php else: ?>
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Candidat</th>
                                    <th>Email</th>
                                    <th>Lettre de motivation</th>
                                    <th>Statut</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($candidatures as $candidature): ?>
                                    <tr>
                                        <td><?php echo htmlspecialchars($candidature['nom_complet'] ?? 'N/A'); ?></td>
                                        <td><?php echo htmlspecialchars($candidature['email']); ?></td>
                                        <td><?php echo nl2br(htmlspecialchars($candidature['lettre_motivation'])); ?></td>
                                        <td class="application-status 
                                            <?php 
                                                echo $candidature['statut'] === 'en_attente' ? 'status-pending' : 
                                                     ($candidature['statut'] === 'accepte' ? 'status-accepted' : 'status-rejected');
                                            ?>">
                                            <?php 
                                                echo $candidature['statut'] === 'en_attente' ? 'En attente' : 
                                                     ($candidature['statut'] === 'accepte' ? 'Acceptée' : 'Refusée');
                                            ?>
                                        </td>
                                        <td>
                                            <?php if ($candidature['statut'] === 'en_attente'): ?>
                                                <form method="POST" style="display:inline;">
                                                    <input type="hidden" name="application_id" value="<?php echo $candidature['id']; ?>">
                                                    <button type="submit" name="action" value="accepte" class="btn btn-success btn-action">Accepter</button>
                                                    <button type="submit" name="action" value="refuse" class="btn btn-danger btn-action">Refuser</button>
                                                </form>
                                            <?php else: ?>
                                                <em>Aucune action</em>
                                            <?php endif; ?>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    <?php endif; ?>
                </div>
            <?php endforeach; ?>
        <?php endif; ?>
    </div>
</body>
</html>
</body>
</html>
