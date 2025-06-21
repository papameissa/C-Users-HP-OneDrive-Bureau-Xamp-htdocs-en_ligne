-- Base de données : online_recruitment

DROP DATABASE IF EXISTS en_ligne;
CREATE DATABASE en_ligne CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE en_ligne;

-- Table : utilisateurs (candidats, recruteurs et administrateurs)
CREATE TABLE utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type_utilisateur ENUM('candidat', 'recruteur', 'admin') NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    nom_entreprise VARCHAR(255) DEFAULT NULL, -- pour les recruteurs
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    statut ENUM('actif', 'bloque') DEFAULT 'actif'
) ENGINE=InnoDB;

-- Table : profils_candidats
CREATE TABLE profils_candidats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id INT NOT NULL,
    nom_complet VARCHAR(255) NOT NULL,
    telephone VARCHAR(50),
    adresse VARCHAR(255),
    niveau_etudes VARCHAR(255),
    competences TEXT,
    experience TEXT,
    nom_fichier_cv VARCHAR(255),
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Table : offres_emploi
CREATE TABLE offres_emploi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recruteur_id INT NOT NULL,
    titre VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    localisation VARCHAR(255),
    secteur VARCHAR(255),
    type_contrat VARCHAR(100),
    salaire VARCHAR(100),
    image VARCHAR(255) DEFAULT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recruteur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Table : candidatures
CREATE TABLE candidatures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidat_id INT NOT NULL,
    offre_emploi_id INT NOT NULL,
    lettre_motivation TEXT,
    statut ENUM('en_attente', 'accepte', 'refuse') DEFAULT 'en_attente',
    date_candidature TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (candidat_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
    FOREIGN KEY (offre_emploi_id) REFERENCES offres_emploi(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Table : messages (pour la messagerie interne candidat-recruteur)
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    expediteur_id INT NOT NULL,
    destinataire_id INT NOT NULL,
    message TEXT NOT NULL,
    date_envoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (expediteur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
    FOREIGN KEY (destinataire_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Données d'exemple

-- Insérer un administrateur
INSERT INTO utilisateurs (type_utilisateur, email, mot_de_passe, statut) VALUES
('admin', 'admin@example.com', SHA2('adminpassword', 256), 'actif');

-- Insérer un recruteur exemple
INSERT INTO utilisateurs (type_utilisateur, email, mot_de_passe, nom_entreprise, statut) VALUES
('recruteur', 'recruteur@example.com', SHA2('recruteurpass', 256), 'Entreprise Exemple', 'actif');

-- Insérer un candidat exemple
INSERT INTO utilisateurs (type_utilisateur, email, mot_de_passe, statut) VALUES
('candidat', 'candidat@example.com', SHA2('candidatpass', 256), 'actif');

-- Insérer un profil candidat
INSERT INTO profils_candidats (utilisateur_id, nom_complet, telephone, adresse, niveau_etudes, competences, experience, nom_fichier_cv) VALUES
(3, 'Jean Dupont', '0123456789', '123 Rue Principale, Ville', 'Master', 'PHP, MySQL, JavaScript', '5 ans chez Société X', NULL);

-- Insérer une offre d'emploi
INSERT INTO offres_emploi (recruteur_id, titre, description, localisation, secteur, type_contrat, salaire) VALUES
(2, 'Développeur PHP', 'Recherche développeur PHP expérimenté.', 'Paris', 'Informatique', 'CDI', '35000-45000 EUR');
