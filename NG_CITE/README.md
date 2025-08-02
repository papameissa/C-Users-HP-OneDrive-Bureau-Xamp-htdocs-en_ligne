# Plateforme Culturelle Niarry Gouye

Une plateforme web moderne et professionnelle pour connecter la communauté culturelle du quartier Niarry Gouye à Dakar, Sénégal.

## 🎯 Fonctionnalités Principales

### 🏠 Page d'Accueil Dynamique
- Flux d'actualités culturelles en temps réel
- Événements à la une avec système de recommandations
- Artistes en vedette et espaces disponibles
- Statistiques communautaires interactives

### 👥 Système d'Authentification Complet
- Inscription différenciée par rôles (Habitant, Artiste, Gestionnaire)
- Profils personnalisables avec portfolios pour artistes
- Système de vérification et sécurité avancée
- Gestion des permissions par niveaux d'accès

### 🎭 Gestion d'Événements Avancée
- Création d'événements avec formulaires intelligents
- Système de participation et favoris
- Filtres avancés par catégorie, date, lieu
- Notifications automatiques aux participants

### 🏛️ Réservation d'Espaces Intelligente
- Calendrier de réservation en temps réel
- Système de paiement intégré (Wave Money, Orange Money)
- Gestion des conflits et validation automatique
- Notifications email/SMS pour admins et utilisateurs

### 💬 Communication Intégrée
- Messagerie interne complète
- Système de notifications push et email
- Forums de discussion thématiques
- Partage de fichiers multimédias

### 📱 Paiements Mobiles
- Intégration Wave Money et Orange Money
- Interface de paiement sécurisée et intuitive
- Gestion des transactions et reçus
- Support multi-devises (FCFA)

### 🔔 Notifications Intelligentes
- Notifications email automatiques
- SMS pour événements importants
- Alertes en temps réel pour les gestionnaires
- Personnalisation des préférences de notification

### 👨‍💼 Tableau de Bord Administrateur
- Gestion des réservations en attente
- Statistiques détaillées de la plateforme
- Modération des contenus et utilisateurs
- Système de rapports et analytics

## 🛠️ Technologies Utilisées

### Frontend
- **React 18** avec TypeScript pour une interface moderne
- **Tailwind CSS** pour un design responsive et professionnel
- **Lucide React** pour une iconographie cohérente
- **React Router** pour la navigation SPA
- **React Hot Toast** pour les notifications utilisateur

### Services Intégrés
- **EmailJS** pour l'envoi d'emails automatiques
- **APIs SMS** pour les notifications mobiles
- **Wave Money & Orange Money** pour les paiements
- **Système de géolocalisation** pour les espaces

### Architecture
- **Architecture modulaire** avec séparation des responsabilités
- **Services centralisés** pour notifications et paiements
- **Gestion d'état** avec Context API
- **Responsive design** mobile-first

## 🚀 Installation et Démarrage

```bash
# Cloner le projet
git clone [repository-url]
cd niarry-gouye-platform

# Installer les dépendances
npm install

# Démarrer en mode développement
npm run dev

# Build pour production
npm run build
```

## 📋 Configuration

### Variables d'Environnement
Créer un fichier `.env` avec :

```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key

# SMS API Configuration
VITE_SMS_API_URL=your_sms_api_url
VITE_SMS_API_KEY=your_sms_api_key

# Payment APIs
VITE_WAVE_API_KEY=your_wave_api_key
VITE_ORANGE_API_KEY=your_orange_api_key
```

### Configuration des Services

1. **EmailJS** : Créer un compte sur emailjs.com et configurer les templates
2. **SMS API** : S'inscrire auprès d'un fournisseur SMS local (ex: Twilio)
3. **Wave Money** : Obtenir les clés API auprès de Wave
4. **Orange Money** : Configuration avec Orange Developer

## 👥 Comptes de Démonstration

### Gestionnaire
- **Email** : amadou@example.com
- **Mot de passe** : password
- **Accès** : Tableau de bord admin, gestion des espaces

### Artiste
- **Email** : mamadou@example.com
- **Mot de passe** : password
- **Accès** : Création d'événements, portfolio

### Habitant
- **Email** : fatima@example.com
- **Mot de passe** : password
- **Accès** : Participation aux événements, réservations

## 🎨 Design et UX

### Palette de Couleurs
- **Orange Principal** : #E97E2F (chaleur, créativité)
- **Bleu Secondaire** : #1E40AF (confiance, professionnalisme)
- **Vert Accent** : #059669 (succès, validation)
- **Tons Neutres** : Grays pour l'équilibre

### Principes de Design
- **Mobile-First** : Optimisé pour smartphones
- **Accessibilité** : Contraste élevé, navigation clavier
- **Micro-interactions** : Animations fluides et feedback
- **Cohérence** : Système de design unifié

## 📊 Fonctionnalités Métier

### Pour les Habitants
- Découverte d'événements culturels locaux
- Réservation d'espaces pour événements privés
- Connexion avec artistes et créateurs
- Participation active à la vie culturelle

### Pour les Artistes
- Promotion de leurs œuvres et services
- Gestion de leur calendrier et disponibilités
- Réseau professionnel et collaborations
- Monétisation de leurs talents

### Pour les Gestionnaires
- Optimisation de l'utilisation des espaces
- Gestion centralisée des réservations
- Communication directe avec la communauté
- Statistiques et rapports détaillés

## 🔒 Sécurité et Confidentialité

- **Chiffrement** des mots de passe avec bcrypt
- **Validation** de toutes les entrées utilisateur
- **Protection CSRF** pour les formulaires
- **Conformité RGPD** pour les données personnelles
- **Paiements sécurisés** via APIs certifiées

## 📈 Métriques et Analytics

### Indicateurs Clés
- Nombre d'utilisateurs actifs mensuels
- Taux de participation aux événements
- Utilisation des espaces culturels
- Satisfaction utilisateur (NPS)

### Rapports Disponibles
- Statistiques d'usage par rôle
- Performance des événements
- Revenus des réservations
- Engagement communautaire

## 🌍 Impact Social

### Objectifs Sociaux
- **Cohésion communautaire** renforcée
- **Valorisation** du patrimoine culturel local
- **Démocratisation** de l'accès à la culture
- **Développement économique** local

### Bénéfices Attendus
- Augmentation de 200% de la visibilité culturelle
- 30% de participation communautaire
- 50% d'amélioration de l'utilisation des espaces
- Création d'un réseau de 100+ acteurs culturels

## 🚀 Roadmap Future

### Phase 2 (Q2 2024)
- Application mobile native (iOS/Android)
- Système de streaming pour événements virtuels
- Intelligence artificielle pour recommandations
- Intégration réalité augmentée

### Phase 3 (Q3 2024)
- Extension à d'autres quartiers
- Marketplace pour produits culturels
- Système de certification des artistes
- Partenariats institutionnels

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez :

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Contact

**Équipe Niarry Gouye**
- Email : contact@niarrygouye.sn
- Téléphone : +221 77 123 45 67
- Site web : https://niarrygouye.sn

---

*Fait avec ❤️ pour la communauté culturelle de Niarry Gouye*