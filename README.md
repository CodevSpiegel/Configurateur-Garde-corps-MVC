# 🛡️ MonCMS v5.3 - Configurateur de Garde-Corps

<div align="center">

![PHP Version](https://img.shields.io/badge/PHP-8.3.14-777BB4?style=for-the-badge&logo=php&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-9.1.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)

**Système de gestion de contenu sur mesure avec configurateur visuel interactif**

[Documentation](#-documentation) • [Installation](#-installation) • [Fonctionnalités](#-fonctionnalités) • [Architecture](#-architecture)

</div>

---

## 📋 Table des Matières

- [À Propos](#-à-propos)
- [Fonctionnalités](#-fonctionnalités)
- [Technologies](#-technologies)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Architecture](#-architecture)
- [Structure du Projet](#-structure-du-projet)
- [Utilisation](#-utilisation)
- [Sécurité](#-sécurité)
- [Performance](#-performance)
- [Documentation](#-documentation)
- [Contribution](#-contribution)
- [Auteur](#-auteur)
- [License](#-license)

---

## 🎯 À Propos

**MonCMS v5.3** est un système de gestion de contenu (CMS) développé sur mesure pour **France Inox**, entreprise spécialisée dans la fabrication et l'installation de garde-corps sur mesure.

Le projet intègre un **configurateur visuel interactif** permettant aux clients de :
- Personnaliser leur garde-corps en temps réel
- Visualiser le rendu final avant achat
- Générer automatiquement un devis détaillé
- Sauvegarder leurs configurations
- Gérer leurs demandes via un espace client

### 🎓 Contexte Académique

Ce projet a été développé dans le cadre d'un stage de 8 semaines (25 août - 17 octobre 2025) pour l'obtention du **Titre Professionnel Développeur Web et Web Mobile (DWWM)**.

**Objectifs pédagogiques :**
- Démontrer la maîtrise de l'architecture MVC
- Mettre en pratique les compétences full-stack
- Développer une application web complète en conditions réelles
- Gérer un projet de A à Z (analyse, conception, développement, déploiement)

---

## ✨ Fonctionnalités

### 🎨 Configurateur Visuel

- **7 types de garde-corps** configurables :
  - Barres horizontales en inox
  - Câbles tendus
  - Panneaux de verre
  - Verre à profilés
  - Tôle perforée inox
  - Filet inox
  - Barrières de piscine

- **Configuration étape par étape** :
  - Sélection du type
  - Choix de la finition (poli, brossé, brut)
  - Définition de la forme (droit, angle, L, U)
  - Saisie des mesures (longueur, largeur, hauteur)
  - Options d'ancrage et de pose
  - Calcul automatique du prix

- **Interface interactive** :
  - Visualisation en temps réel
  - Validation des contraintes techniques
  - Sauvegarde automatique de la progression
  - Export du devis en PDF (à venir)

### 👤 Gestion des Utilisateurs

- **Authentification sécurisée** :
  - Inscription avec validation email
  - Connexion avec option "Se souvenir de moi"
  - Récupération de mot de passe oublié
  - Sessions sécurisées (cookies HttpOnly, SameSite)

- **Espace client** :
  - Gestion du profil utilisateur
  - Historique complet des devis
  - Suivi du statut des demandes
  - Modification/suppression de configurations

### 📊 Interface d'Administration

- **Dashboard de suivi** :
  - Vue d'ensemble des devis
  - Statistiques en temps réel
  - Filtres et recherche avancée

- **Gestion des utilisateurs** :
  - Liste paginée des utilisateurs
  - Gestion des groupes et permissions
  - Modification des rôles
  - Suppression sécurisée

- **Gestion des devis** :
  - Validation/rejet des demandes
  - Changement de statut (brouillon, validé, archivé)
  - Vue détaillée des configurations
  - Export et impression

### 🔒 Sécurité

- Protection contre les injections SQL (requêtes préparées PDO)
- Protection XSS (échappement systématique)
- Protection CSRF (tokens sur formulaires sensibles)
- Sessions sécurisées stockées en base de données
- Hachage des mots de passe (bcrypt)
- Contrôle d'accès par groupes
- Validation stricte côté serveur

---

## 🛠️ Technologies

### Backend

| Technologie | Version | Usage |
|------------|---------|-------|
| **PHP** | 8.3.14 | Langage principal, types stricts |
| **MySQL** | 9.1.0 | Base de données relationnelle |
| **PDO** | - | Accès sécurisé à la BDD |
| **Apache** | 2.4+ | Serveur web |

### Frontend

| Technologie | Version | Usage |
|------------|---------|-------|
| **JavaScript** | ES6+ | Configurateur interactif |
| **CSS3** | - | Styles modernes |
| **HTML5** | - | Structure sémantique |

### Architecture

- **Pattern MVC** personnalisé from scratch
- **Architecture modulaire** par datasets
- **API REST** pour la communication client-serveur
- **Single Page Application** pour le configurateur

---

## 📦 Prérequis

Avant d'installer le projet, assurez-vous d'avoir :

- **PHP** >= 8.3.0
  - Extensions : `pdo_mysql`, `mbstring`, `json`
- **MySQL** >= 8.0 ou **MariaDB** >= 10.6
- **Apache** 2.4+ avec `mod_rewrite` activé
- **Composer** (optionnel, pour dépendances futures)

### Vérification de l'environnement

```bash
# Vérifier la version PHP
php -v

# Vérifier les extensions PHP
php -m | grep -E 'pdo_mysql|mbstring|json'

# Vérifier MySQL
mysql --version
```

---

## 🚀 Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/CodevSpiegel/Configurateur-Garde-corps-MVC.git
cd Configurateur-Garde-corps-MVC
```

### 2. Créer la base de données

```bash
# Se connecter à MySQL
mysql -u root -p

# Créer la base de données
CREATE DATABASE gardecorps CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

# Importer la structure
USE gardecorps;
SOURCE gardecorps.sql;

# Créer un utilisateur dédié (recommandé en production)
CREATE USER 'gardecorps_user'@'localhost' IDENTIFIED BY 'votre_mot_de_passe_fort';
GRANT ALL PRIVILEGES ON gardecorps.* TO 'gardecorps_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Configurer l'application

Modifier le fichier `app/config.php` :

```php
<?php
// Configuration de la base de données
define('DB_HOST', 'localhost');
define('DB_NAME', 'gardecorps');
define('DB_USER', 'gardecorps_user');
define('DB_PASS', 'votre_mot_de_passe_fort');
define('DB_CHARSET', 'utf8mb4');

// URL de base
define('BASE_URL', '/');

// Configuration email
define('MAIL_MODE', 'dev');  // 'prod' en production
define('MAIL_DEV_TO', 'votre-email@exemple.com');
```

### 4. Configurer Apache

Créer un VirtualHost ou utiliser le fichier `.htaccess` fourni :

**Option A : VirtualHost (recommandé)**

```apache
<VirtualHost *:80>
    ServerName gardecorps.local
    DocumentRoot "/chemin/vers/MonCMS-v5.3/public"
    
    <Directory "/chemin/vers/MonCMS-v5.3/public">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/gardecorps-error.log
    CustomLog ${APACHE_LOG_DIR}/gardecorps-access.log combined
</VirtualHost>
```

**Option B : .htaccess** (déjà fourni dans `/public`)

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php [QSA,L]
```

### 5. Configurer le fichier hosts (si VirtualHost local)

```bash
# Éditer /etc/hosts (Linux/Mac) ou C:\Windows\System32\drivers\etc\hosts (Windows)
sudo nano /etc/hosts

# Ajouter :
127.0.0.1   gardecorps.local
```

### 6. Redémarrer Apache

```bash
# Linux
sudo systemctl restart apache2

# Windows (XAMPP)
# Redémarrer depuis le panneau de contrôle XAMPP
```

### 7. Créer le compte administrateur

Accéder à : `http://gardecorps.local/auth/register`

Puis modifier manuellement dans la base de données :

```sql
UPDATE users 
SET user_group_id = 27 
WHERE id = 1;
```

> **Note :** Le groupe 27 correspond aux administrateurs

---

## ⚙️ Configuration

### Variables d'Environnement

Pour la production, utilisez un fichier `.env` (non inclus dans Git) :

```env
# Base de données
DB_HOST=localhost
DB_NAME=gardecorps
DB_USER=gardecorps_user
DB_PASS=mot_de_passe_securise

# Email
MAIL_MODE=prod
MAIL_FROM=noreply@franceinox.fr
MAIL_FROM_NAME=France Inox

# Environnement
APP_ENV=production
APP_DEBUG=false
```

### Modes de Déploiement

**Mode Développement** (`app/config.php`) :
```php
define('MAIL_MODE', 'dev');
ini_set('display_errors', 1);
error_reporting(E_ALL);
```

**Mode Production** :
```php
define('MAIL_MODE', 'prod');
ini_set('display_errors', 0);
error_reporting(0);
```

---

## 🏗️ Architecture

### Pattern MVC Personnalisé

```
┌─────────────┐
│   CLIENT    │
└──────┬──────┘
       │ HTTP Request
       ▼
┌─────────────────────────────────────┐
│          ROUTER                     │
│  - Parse URL                        │
│  - Load Controller                  │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│        CONTROLLER                   │
│  - Handle Request                   │
│  - Business Logic                   │
│  - Call Model                       │
└──────┬──────────────────────────────┘
       │
       ├────────────┐
       ▼            ▼
┌──────────┐  ┌──────────┐
│  MODEL   │  │   VIEW   │
│  - CRUD  │  │  - HTML  │
│  - PDO   │  │  - PHP   │
└──────────┘  └──────────┘
       │            │
       └────────┬───┘
                ▼
          ┌──────────┐
          │   BDD    │
          └──────────┘
```

### Flux de Requête

1. **Client** → Envoie une requête HTTP
2. **index.php** → Point d'entrée unique
3. **Router** → Parse l'URL et charge le contrôleur
4. **Controller** → Traite la logique métier
5. **Model** → Accède aux données (PDO)
6. **View** → Génère le HTML
7. **Client** ← Reçoit la réponse

### Système de Routage

**Format des URLs :**
```
http://domain.com/[controller]/[action]/[param1]/[param2]/...
```

**Exemples :**
```
/                           → HomeController::index()
/configurateur              → ConfigurateurController::index()
/configurateur/createDevis  → ConfigurateurController::createDevis()
/admin/users/show/5         → AdminController::show(5)
/auth/login                 → AuthController::login()
```

---

## 📁 Structure du Projet

```
MonCMS-v5.3/
│
├── 📂 app/                          # Cœur de l'application
│   ├── 📄 config.php                # Configuration globale
│   │
│   ├── 📂 controllers/              # Contrôleurs MVC
│   │   ├── HomeController.php       # Page d'accueil
│   │   ├── ConfigurateurController.php  # Configurateur
│   │   ├── AuthController.php       # Authentification
│   │   ├── AdminController.php      # Administration
│   │   └── PresentationController.php   # Page présentation
│   │
│   ├── 📂 core/                     # Classes système
│   │   ├── Router.php               # Système de routage
│   │   ├── Controller.php           # Classe parent contrôleurs
│   │   ├── Model.php                # Classe parent modèles
│   │   ├── Database.php             # Connexion PDO (Singleton)
│   │   ├── Sessions.php             # Gestion sessions sécurisées
│   │   ├── Emails.php               # Envoi d'emails
│   │   └── Functions.php            # Fonctions utilitaires
│   │
│   ├── 📂 models/                   # Modèles de données
│   │   ├── Auth.php                 # Authentification
│   │   ├── Users.php                # Gestion utilisateurs
│   │   └── Devis.php                # Gestion devis
│   │
│   └── 📂 views/                    # Templates HTML
│       ├── 📂 layout/               # Layouts communs
│       │   ├── header.php
│       │   └── footer.php
│       ├── 📂 home/                 # Accueil
│       ├── 📂 configurateur/        # Configurateur
│       ├── 📂 auth/                 # Authentification
│       ├── 📂 admin/                # Administration
│       └── 📂 errors/               # Pages d'erreur
│
├── 📂 public/                       # Racine web publique
│   ├── 📄 index.php                 # Point d'entrée unique
│   ├── 📄 .htaccess                 # Configuration Apache
│   │
│   └── 📂 assets/                   # Ressources statiques
│       ├── 📂 css/
│       │   ├── style.css            # Styles globaux
│       │   └── configurateur.css    # Styles configurateur
│       │
│       ├── 📂 js/
│       │   ├── app.js               # Script principal
│       │   └── 📂 configurateur/    # Module configurateur
│       │       ├── app.js           # Core du configurateur
│       │       ├── bootstrap.js     # Initialisation
│       │       ├── 📂 core/         # Classes principales
│       │       └── 📂 datasets/     # Données par type
│       │           ├── 📂 barres/
│       │           ├── 📂 cables/
│       │           ├── 📂 verre/
│       │           ├── 📂 verre-a-profile/
│       │           ├── 📂 tole-inox/
│       │           ├── 📂 filet-inox/
│       │           └── 📂 barriere-piscine/
│       │
│       └── 📂 images/               # Images (non inclus)
│
├── 📄 gardecorps.sql                # Structure BDD + données
├── 📄 README.md                     # Ce fichier
├── 📄 .gitignore                    # Fichiers ignorés par Git
└── 📄 LICENSE                       # Licence (propriétaire)
```

### Statistiques

- **37 fichiers PHP** (~3500 lignes)
- **13 fichiers JavaScript** (~2000 lignes)
- **2 fichiers CSS** (~400 lignes)
- **5 contrôleurs**
- **3 modèles**
- **7 datasets** de configuration

---

## 💻 Utilisation

### Interface Client

#### 1. Créer un compte

```
http://gardecorps.local/auth/register
```

Remplir le formulaire d'inscription avec :
- Login unique
- Email valide
- Mot de passe fort (min. 8 caractères)

#### 2. Se connecter

```
http://gardecorps.local/auth/login
```

Option "Se souvenir de moi" (session 30 jours)

#### 3. Configurer un garde-corps

```
http://gardecorps.local/configurateur
```

**Étapes :**
1. Choisir le type de garde-corps
2. Sélectionner la finition
3. Définir la forme (droit, angle, L, U)
4. Saisir les mesures
5. Choisir les options (ancrage, pose)
6. Valider et générer le devis

#### 4. Gérer ses devis

```
http://gardecorps.local/auth/list_devis
```

Actions disponibles :
- Visualiser les détails
- Modifier une configuration
- Supprimer un devis
- Exporter (à venir)

### Interface Administrateur

Accessible uniquement aux utilisateurs du groupe admin (ID 4 ou 27).

#### 1. Dashboard

```
http://gardecorps.local/admin/dashboard
```

Vue d'ensemble :
- Nombre total d'utilisateurs
- Nombre de devis par statut
- Dernières activités

#### 2. Gestion des utilisateurs

```
http://gardecorps.local/admin/users/list
```

Actions :
- Voir la liste paginée
- Modifier le groupe d'un utilisateur
- Voir le détail (profil + devis)
- Supprimer un utilisateur

#### 3. Gestion des devis

```
http://gardecorps.local/admin/devis/list
```

Actions :
- Filtrer par statut
- Voir les détails complets
- Changer le statut (brouillon → validé → archivé)
- Supprimer un devis

### API REST

#### Créer un devis (POST)

**Endpoint :**
```
POST /configurateur/createDevis
```

**Headers :**
```
Content-Type: application/json
```

**Body (exemple) :**
```json
{
  "typeId": 7,
  "finitionId": 1,
  "formeId": 1,
  "poseId": 1,
  "ancrageId": 1,
  "longueur_a": 100,
  "hauteur": 47,
  "quantity": 1
}
```

**Réponse (succès) :**
```json
{
  "ok": true,
  "devisId": 64
}
```

**Réponse (erreur) :**
```json
{
  "ok": false,
  "error": "Message d'erreur",
  "details": "Détails techniques"
}
```

---

## 🔐 Sécurité

### Mesures Implémentées

#### 1. Protection Injection SQL

Toutes les requêtes utilisent des **requêtes préparées PDO** :

```php
$stmt = $this->db->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$id]);
```

Avec typage strict :

```php
$stmt->bindValue(':id', $id, PDO::PARAM_INT);
```

#### 2. Protection XSS

Échappement systématique dans les vues :

```php
echo htmlspecialchars($user['user_login'], ENT_QUOTES, 'UTF-8');
```

#### 3. Sessions Sécurisées

- Stockage en base de données (table `user_sessions`)
- ID de session aléatoire (64 caractères hexadécimaux)
- Cookies sécurisés :
  ```php
  [
    'httponly' => true,
    'samesite' => 'Lax',
    'secure' => true  // en HTTPS
  ]
  ```
- Tracking IP et User-Agent
- Expiration automatique (7 ou 30 jours)

#### 4. Mots de Passe

Hachage avec bcrypt (via `password_hash()`) :

```php
$hash = password_hash($password, PASSWORD_DEFAULT);
```

Vérification :

```php
password_verify($password, $hash);
```

#### 5. Contrôle d'Accès

Middleware d'authentification :

```php
// Nécessite connexion
$this->session->requireAuth();

// Nécessite admin
$this->session->requireAdmin();
```

Groupes utilisateurs :
- **1** : Utilisateur standard
- **4, 27** : Administrateurs

#### 6. Validation des Données

Validation stricte côté serveur :

```php
// Exemple : validation d'un ID
if (!is_numeric($data['typeId']) || $data['typeId'] < 1) {
    throw new InvalidArgumentException('Type ID invalide');
}
```

### Recommandations Production

#### À faire avant déploiement :

- [ ] Changer tous les mots de passe par défaut
- [ ] Créer un utilisateur MySQL dédié (non-root)
- [ ] Activer HTTPS (certificat SSL/TLS)
- [ ] Désactiver l'affichage des erreurs PHP
- [ ] Configurer les en-têtes de sécurité HTTP
- [ ] Mettre en place un pare-feu applicatif (WAF)
- [ ] Configurer les sauvegardes automatiques
- [ ] Activer les logs de sécurité
- [ ] Implémenter le rate limiting
- [ ] Ajouter la protection CSRF sur tous les formulaires

#### En-têtes de Sécurité (à ajouter) :

```php
// app/core/Controller.php ou index.php
header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('X-XSS-Protection: 1; mode=block');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Permissions-Policy: geolocation=(), microphone=(), camera=()');
```

Pour HTTPS :
```php
header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
```

---

## ⚡ Performance

### Optimisations Implémentées

#### 1. Base de Données

- **Pattern Singleton** pour la connexion PDO (une seule instance)
- **Index** sur les colonnes fréquemment interrogées
- **Types de données optimisés** (TINYINT, SMALLINT au lieu de INT)
- **Requêtes préparées** (réutilisation du plan d'exécution)

#### 2. PHP

- **Types stricts** (`declare(strict_types=1)`)
- **Opérateur null coalescence** (`??`) pour valeurs par défaut
- **Héritage** pour réutilisation du code (Model, Controller)

#### 3. Frontend

- **JavaScript vanilla** (pas de framework lourd)
- **Modules ES6** (chargement à la demande)
- **LocalStorage** pour cache côté client
- **CSS3** moderne (pas de préprocesseur en production)

#### 4. Architecture

- **Point d'entrée unique** (évite chargements multiples)
- **Autoloading** des classes (pas de require_once partout)
- **Séparation des responsabilités** (MVC)

### Métriques de Performance

| Métrique | Valeur | Cible |
|----------|--------|-------|
| **Time to First Byte (TTFB)** | ~100ms | < 200ms |
| **Page Load Time** | ~800ms | < 1s |
| **Requêtes SQL** | 2-5 / page | < 10 |
| **Taille HTML** | ~15-30 KB | < 50 KB |
| **Taille JS total** | ~80 KB | < 150 KB |

### Pistes d'Amélioration Futures

1. **Cache** :
   - Implémenter Redis/Memcached
   - Cache des requêtes fréquentes
   - Cache de templates compilés

2. **CDN** :
   - Héberger les assets statiques sur CDN
   - Compression Gzip/Brotli

3. **Lazy Loading** :
   - Chargement différé des images
   - Code splitting JavaScript

4. **Optimisation BDD** :
   - Vues matérialisées pour statistiques
   - Partitionnement des tables volumineuses
   - Query caching

---

## 📚 Documentation

### Documentation Technique

Le code est **abondamment documenté** avec des commentaires en français :

```php
/**
 * ============================================================================
 * app\core\Router.php
 * ============================================================================
 * ✨ ROUTEUR PRINCIPAL DU FRAMEWORK MVC ✨
 * 
 * ➤ Rôle :
 *    Ce fichier gère la "traduction" de l'URL en un contrôleur, une action
 *    (méthode) et éventuellement des paramètres supplémentaires.
 * ============================================================================
 */
```

### Conventions de Codage

#### PHP

- **PSR-12** : Standard de codage PHP
- **CamelCase** pour les classes : `ConfigurateurController`
- **camelCase** pour les méthodes : `createDevis()`
- **snake_case** pour les colonnes BDD : `user_login`
- **UPPER_CASE** pour les constantes : `DB_HOST`

#### JavaScript

- **ES6+** moderne
- **camelCase** pour variables et fonctions
- **PascalCase** pour les classes
- **Commentaires JSDoc** pour les fonctions publiques

#### SQL

- **Noms en minuscules** : `users`, `cfg_devis`
- **Préfixes pour tables liées** : `cfg_*`, `user_*`
- **Index nommés explicitement** : `idx_user_date`

### Structure d'une Classe Modèle

```php
<?php
class ExampleModel extends Model
{
    /**
     * Récupère tous les éléments avec pagination
     * 
     * @param int $page Numéro de page (commence à 1)
     * @param int $perPage Nombre d'éléments par page
     * @return array Liste des éléments
     */
    public function list(int $page = 1, int $perPage = 10): array
    {
        $offset = max(0, ($page - 1) * $perPage);
        
        $sql = "SELECT * FROM table 
                ORDER BY id DESC 
                LIMIT :limit OFFSET :offset";
        
        $stmt = $this->db->prepare($sql);
        $stmt->bindValue(':limit', $perPage, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
```

### Structure d'un Contrôleur

```php
<?php
require_once ROOT . 'app/models/ExampleModel.php';

class ExampleController extends Controller
{
    private Sessions $session;
    
    public function __construct()
    {
        $this->session = new Sessions();
        $this->session->requireAuth(); // Protection
    }
    
    /**
     * Page d'accueil du module
     */
    public function index(): void
    {
        $title = "Titre de la page";
        $data = ['key' => 'value'];
        
        $this->view('example/index', compact('title', 'data'));
    }
}
```

---

## 🤝 Contribution

Ce projet est développé dans un cadre académique et n'accepte pas de contributions externes pour le moment.

### Pour signaler un bug

Si vous identifiez un bug ou une vulnérabilité de sécurité :

1. **NE PAS** créer d'issue publique pour les failles de sécurité
2. Contacter directement : codev.spiegel@gmail.com
3. Fournir :
   - Description détaillée du problème
   - Étapes de reproduction
   - Version PHP et MySQL
   - Logs d'erreur (si disponibles)

### Roadmap Future (v6.0)

- [ ] Export PDF des devis
- [ ] Système de notifications email
- [ ] Interface de paiement en ligne
- [ ] Application mobile (React Native)
- [ ] Tableau de bord avec graphiques (Chart.js)
- [ ] Tests unitaires (PHPUnit)
- [ ] Tests E2E (Cypress)
- [ ] CI/CD avec GitHub Actions
- [ ] Containerisation Docker
- [ ] Internationalisation (i18n)

---

## 👨‍💻 Auteur

**Sébastien SPIEGEL**

- 🎓 Stagiaire DWWM chez France Inox (août-octobre 2025)
- 📧 Email : codev.spiegel@gmail.com
- 💼 LinkedIn : https://www.linkedin.com/in/s%C3%A9bastien-spiegel-3354042a0/
- 🐙 GitHub : https://github.com/CodevSpiegel

### Encadrement

**Tuteur Entreprise :** Fabienne Lacorre - France Inox  
**Référent Pédagogique :** Anthony MERLIER - GRETA Sud Champagne

---

## 📄 License

**Proprietary** - © 2025 France Inox

Ce projet a été développé exclusivement pour **France Inox** et est protégé par le droit d'auteur. Toute utilisation, reproduction, modification ou distribution sans autorisation écrite préalable est strictement interdite.

### Restrictions

- ❌ Utilisation commerciale interdite
- ❌ Distribution interdite
- ❌ Modification interdite
- ❌ Usage privé sans autorisation interdit

Pour toute demande d'autorisation, contacter : [contact@franceinox.fr]

---

## 🙏 Remerciements

- **France Inox** pour la confiance et l'opportunité de stage
- **GRETA Sud Champagne** pour la formation DWWM
- **Anthony MERLIER** pour le suivi pédagogique
- La communauté PHP pour la documentation et les ressources

---

## 📞 Support

Pour toute question concernant ce projet :

- **Email :** codev.spiegel@gmail.com
- **Documentation :** Consultez les commentaires dans le code
- **Issues :** (Non disponible - projet privé)

---

<div align="center">

**MonCMS v5.3** - Développé avec ❤️ durant un stage DWWM

![Made with PHP](https://img.shields.io/badge/Made%20with-PHP-777BB4?style=flat-square&logo=php)
![Made with JavaScript](https://img.shields.io/badge/Made%20with-JavaScript-F7DF1E?style=flat-square&logo=javascript)
![Made with Love](https://img.shields.io/badge/Made%20with-❤-red?style=flat-square)

⭐ Si ce projet vous inspire, n'hésitez pas à le ⭐ !

</div>
