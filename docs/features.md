# Fonctionnalités de ZouuSafe

## 1. Compte parent

Le parent peut créer un compte afin d'accéder à son tableau de bord.

Données utilisées :
- parent
- child

## 2. Gestion des enfants

Le parent peut ajouter un ou plusieurs profils enfants.

Données utilisées :
- child
- parent_id

## 3. Recherche sécurisée

L'enfant peut effectuer une recherche dans un environnement adapté.

Données utilisées :
- search_history
- child_id

## 4. Contrôle du temps d'écran

Le parent peut définir une limite de temps d'écran.

Données utilisées :
- safety_setting
- screen_time_limit
- screen_time_used

## 5. Contenus bloqués

Les contenus non adaptés sont enregistrés dans la base.

Données utilisées :
- blocked_content
- child_id

## 6. Appareils connectés

Un enfant peut utiliser plusieurs appareils.

Données utilisées :
- device
- child_id

## 7. Alertes parentales

Le parent reçoit une alerte lorsqu'un comportement à risque est détecté.

Données utilisées :
- alert
- child_id