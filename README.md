# 🏗️ Configurateur de Garde-corps – Version 3.0 (Standalone)

Projet développé par **Sébastien Spiegel** dans le cadre du parcours **Développeur Web & Web Mobile (DWWM)**.  
Ce configurateur permet de **concevoir, visualiser et enregistrer des devis de garde-corps** (inox, verre, câbles, etc.) via une interface web dynamique reliée à une base de données MySQL.

---

## 🚀 Objectif du projet

Créer un **outil complet de configuration de garde-corps** pour la société **FSA Inox**, fonctionnant sans CMS (standalone PHP MVC).  
L’utilisateur peut :
- Choisir un modèle (câbles, barres, verre, etc.)
- Configurer chaque étape (type, finition, pose, forme, mesures…)
- Visualiser un **aperçu dynamique**
- Valider et **envoyer un devis** vers la base de données

L’administrateur peut ensuite **gérer ces devis depuis l’interface Admin** (CRUD complet).

---

## ⚙️ Technologies utilisées

| Côté | Technologie |
|------|--------------|
| **Serveur** | PHP 8.3 (MVC fait maison) |
| **Base de données** | MySQL / MariaDB |
| **Front-end** | HTML5, CSS3, JavaScript ES Modules |
| **Interface** | Responsive + preview dynamique |
| **Sécurité** | CSRF Token, .htaccess, validation côté serveur |
| **Hébergement local** | WAMP sur Windows 11 |

---

## 🗂️ Fonctionnalités principales

### 🎛️ Configurateur utilisateur
- Choix du type de garde-corps (barres, câbles, verre…)
- Étapes dynamiques selon le type (finition, pose, forme, mesures…)
- Aperçu mis à jour en temps réel
- Résumé final avant validation
- Enregistrement du devis en BDD (valeurs “value”)

### 🔑 Espace administrateur
- Gestion des devis (AdmindevisController)
  - Liste complète avec labels (type, finition, pose, verre…)
  - Détail, édition et suppression
  - Sécurité CSRF intégrée

---

## 🧠 Base de données (extrait simplifié)

Principales tables :
- `cfg_devis` — enregistre les devis du configurateur  
- `cfg_types`, `cfg_finitions`, `cfg_poses`, `cfg_formes`, `cfg_verres`, `cfg_ancrages` — tables de référence  
- `cfg_models` — modèles principaux (ex : câbles, barres, verre)  
- `users`, `sessions` — gestion utilisateurs (évolutif)

---

## 💻 Installation locale

1. Placer le dossier du projet dans `C:\wamp64\www\`  
   (ou équivalent sur ton serveur local)
2. Créer une base de données `configurateur` (ou ton nom choisi)
3. Importer le fichier SQL (`configurateur.sql`)
4. Configurer la connexion dans `app/core/Database.php`
5. Démarrer WAMP puis ouvrir :  
   👉 [http://localhost/Gardecorps_v3.0/public](http://localhost/Gardecorps_v3.0/public)


✨ Auteur

Sébastien Spiegel
📍 France — 2025
Formation : Développeur Web & Web Mobile (DWWM)
Projet professionnel : Configurateur de Garde-corps pour FSA Inox

🧱 Licence

Projet réalisé dans le cadre d’un cursus pédagogique.
Reproduction ou usage commercial interdits sans autorisation de l’auteur
