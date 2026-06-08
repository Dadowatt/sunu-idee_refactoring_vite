# Sunu-Idées

## Présentation

Sunu-Idées est une application web de type Single Page Application (SPA) permettant de partager des idées de manière anonyme au sein d'une communauté.

Le projet a été entièrement refactorisé pour adopter une architecture moderne basée sur Vite.js, une séparation modulaire du code et l’utilisation de Supabase pour la base de données.

Une intelligence artificielle via OpenRouter permet la classification automatique des idées.

---

## Lien du projet

https://sunu-idees-supabase.vercel.app/

---

## Déploiement

L’application est déployée sur Vercel.

Elle utilise :
- Vite pour le build et le serveur de développement
- Supabase comme base de données cloud
- OpenRouter pour la classification IA
- Variables d’environnement sécurisées (.env)

---

## Objectif du projet

Développer une SPA moderne permettant de :

- Créer des idées
- Classer automatiquement les idées avec une IA
- Afficher les idées dynamiquement sous forme de cartes
- Modifier des idées
- Supprimer des idées
- Archiver des idées
- Liker des idées
- Filtrer les idées par catégorie
- Stocker les données dans une base cloud (Supabase)

---

## Fonctionnalités principales

### Création d’une idée

Un formulaire permet d’ajouter une idée avec :

- un titre
- une description
- une catégorie générée automatiquement par IA (OpenRouter)

---

### Intelligence artificielle

L’IA analyse le contenu et attribue une catégorie parmi :

- pedagogie
- campus
- technique
- evenement

---

## Fonctionnalités complémentaires

- filtrage des idées par catégorie
- système de likes dynamique
- édition des idées
- suppression avec confirmation
- archivage des idées
- affichage dynamique des dates
- protection contre l’injection HTML (sanitization)
- gestion des erreurs API
- synchronisation temps réel avec Supabase

---

## Affichage des idées

Les idées sont affichées sous forme de cartes dynamiques.

Chaque carte contient :

- titre
- catégorie
- description
- nombre de likes
- date de publication
- statut (actif ou archivé)

---

## Architecture du projet

Le projet est organisé selon une architecture modulaire :

```txt
src/
├── api/         → fonctions backend (Vercel serverless)
├── services/    → appels API (Supabase, OpenRouter)
├── features/    → logique métier (likes, archive, IA)
├── ui/          → composants d’interface
├── utils/       → fonctions utilitaires
└── main.js      → orchestration de l’application

---
## Installation et utilisation

1. Cloner le projet

git clone https://github.com/Dadowatt/sunu-idee_refactoring_vite.git

cd sunu-idee_refactoring_vite

2. Installer les dépendances
npm install

3. Lancer le projet en local
npm run dev

4. Variables d’environnement

Créer un fichier .env :

VITE_SUPABASE_URL=xxxxxxxx
VITE_SUPABASE_ANON_KEY=xxxxxxxx
OPENROUTER_API_KEY=xxxxxxxx

Créer également un fichier .env.example :

VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
OPENROUTER_API_KEY=

## Base de données Supabase
id (primary key)
titre (text)
description (text)
categorie (text)
likes (integer)
liked (boolean)
archive (boolean)
date (timestamp)

## Lancer l’application
npm run dev

Puis ouvrir :
http://localhost:5173

## Prérequis
Node.js installé
Compte Supabase
Clé API OpenRouter