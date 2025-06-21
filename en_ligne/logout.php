<?php
session_start();

// Détruire toutes les sessions
$_SESSION = array();
session_destroy();

// Rediriger vers la page d'accueil ou de connexion
header("location: index.php");
exit;
?>
