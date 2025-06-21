<?php
session_start();
if (isset($_SESSION["loggedin"]) && $_SESSION["type_utilisateur"] === "recruteur") {
    header("location: recruiter_dashboard.php");
    exit;
} else {
    header("location: login.php");
    exit;
}
?>
