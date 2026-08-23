# Fonctionnalités de ZouuSafe

## 1. Création du compte parent

Le parent peut créer un compte afin d'accéder à son espace personnel et au tableau de bord ZouuSafe.

Fonctionnalités associées :
- inscription du parent ;
- enregistrement des informations du compte ;
- accès sécurisé à l'espace parent.

Données principales :
- parent


## 2. Connexion du parent

Le parent peut se connecter à son compte afin d'accéder à son tableau de bord et aux profils de ses enfants.

Fonctionnalités associées :
- authentification ;
- ouverture d'une session sécurisée ;
- accès aux fonctionnalités réservées au parent.

Données principales :
- parent


## 3. Réinitialisation du mot de passe

Le parent peut demander la réinitialisation de son mot de passe lorsqu'il ne peut plus accéder à son compte.

Fonctionnalités associées :
- demande de réinitialisation ;
- génération d'un jeton temporaire ;
- définition d'un nouveau mot de passe.

Données principales :
- parent
- password_reset_token


## 4. Gestion des profils enfants

Le parent peut créer et gérer plusieurs profils enfants associés à son compte.

Fonctionnalités associées :
- ajouter un enfant ;
- consulter son profil ;
- modifier ses informations ;
- choisir ou modifier son avatar ;
- supprimer un profil enfant.

Données principales :
- child
- parent


## 5. Tableau de bord parent

Le parent dispose d'un tableau de bord lui permettant de consulter les principales informations concernant ses enfants.

Fonctionnalités associées :
- affichage des profils enfants ;
- aperçu des recherches ;
- aperçu des alertes ;
- suivi du temps d'écran ;
- accès rapide aux paramètres de sécurité.

Données principales :
- parent
- child
- search_history
- alert
- safety_setting


## 6. Recherche sécurisée

L'enfant dispose d'un espace de recherche adapté permettant d'effectuer des recherches dans un environnement sécurisé.

Fonctionnalités associées :
- saisie d'une recherche ;
- enregistrement de la recherche ;
- affichage de résultats adaptés ;
- filtrage des résultats par catégorie.

Catégories proposées :
- images ;
- vidéos ;
- histoires ;
- jeux ;
- coloriages.

Données principales :
- child
- search_history


## 7. Historique des recherches

Les recherches effectuées par l'enfant sont enregistrées afin de permettre le suivi de son activité.

Le parent peut consulter cet historique depuis son espace parental.

L'enfant peut également retrouver ses recherches récentes depuis son espace.

Données principales :
- search_history
- child


## 8. Paramètres de sécurité

Le parent peut configurer les paramètres de sécurité associés au profil de son enfant.

Fonctionnalités associées :
- choix du niveau de filtrage ;
- activation ou désactivation du Safe Search ;
- configuration de la limite de temps d'écran ;
- suivi du temps utilisé.

Données principales :
- safety_setting
- child


## 9. Gestion du temps d'écran

Le parent peut définir une durée maximale d'utilisation pour chaque enfant.

ZouuSafe permet également de suivre le temps d'écran utilisé au cours de la journée.

Données principales :
- safety_setting
- child


## 10. Contenus bloqués

ZouuSafe peut enregistrer les contenus considérés comme inadaptés afin de permettre leur suivi depuis l'espace parental.

Données principales :
- blocked_content
- child


## 11. Sites bloqués

Les sites ou domaines bloqués peuvent être enregistrés afin de permettre au parent de suivre les restrictions appliquées à un enfant.

Données principales :
- blocked_site
- parent
- child


## 12. Alertes de sécurité

Une alerte peut être enregistrée lorsqu'une activité nécessitant l'attention du parent est détectée.

Le parent peut consulter les alertes depuis son tableau de bord.

Données principales :
- alert
- child


## 13. Gestion des appareils

Un appareil peut être associé au profil d'un enfant afin d'identifier les appareils utilisés avec ZouuSafe.

Données principales :
- device
- child


## 14. Personnalisation de l'espace enfant

Chaque enfant dispose d'un profil personnalisé avec son prénom et son avatar.

L'interface enfant utilise ces informations afin de proposer un espace identifiable et adapté au profil sélectionné.

Données principales :
- child