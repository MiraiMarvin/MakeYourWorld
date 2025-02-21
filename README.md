# Laylow Custom Cover Generator

Un site promotionnel fictif permettant de créer des covers personnalisées à travers un questionnaire immersif et interactif. Le projet combine art génératif, personnalisation utilisateur et une direction artistique inspirée par l'univers de **Laylow** (gothique, dystopique, sombre, introspectif).

## 🎨 Fonctionnalités

### 1. Génération de covers personnalisées

Les utilisateurs répondent à un questionnaire de personnalité contenant des questions profondes et existentielles, comme :

- "Si votre âme avait une forme, serait-elle fluide ou anguleuse ?"
- "Si votre cœur brillait d'une lumière, quelle en serait la couleur ?"
- "Votre esprit est-il plus proche d'un labyrinthe ou d'un horizon infini ?"

Chaque réponse influence la génération de la cover à travers :
- Les **couleurs** (inspirées par les réponses émotionnelles)
- Les **textures** (grain, motifs abstraits)
- Les **formes** (cercle, carré, fluides aléatoires)

### 2. Expérience artistique immersive

- Direction artistique fidèle à l'univers de Laylow : ambiance **gothique et cybernétique**
- Visuels abstraits et émotionnels
- Textures avec **grain dynamique** et **effets d'éclairage**

### 3. Interface personnalisable et interactive

- **Tweakpane** : interface pour ajuster les paramètres en temps réel
- **Canvas API** : moteur graphique pour le rendu dynamique

## 🛠 Technologies utilisées

### Frontend
- **React.js** : Framework JavaScript
- **TypeScript** : Typage statique et robustesse du code

### Graphisme génératif
- **Canvas API** : Rendu graphique dans le navigateur
- **CSS** : Effets de grain et masques

### Interaction utilisateur
- **Tweakpane** : Interface de contrôle paramétrique
- **Formulaires dynamiques** : Gestion du questionnaire

## 📦 Installation

1. Clonez le dépôt :
```bash
git clone https://github.com/yourusername/laylow-cover-generator.git
cd laylow-cover-generator
```

2. Installez les dépendances :
```bash
npm install
```

3. Lancez le projet en local :
```bash
npm start
```

4. Accédez au site sur `http://localhost:3000`

## 📁 Structure du projet

```
src/
├── components/
│   ├── ArtCanvas.tsx   # Composant principal pour le canvas génératif
│   └── Questionnaire.tsx # Composant pour le formulaire de personnalité
├── styles/
│   └── global.css      # Styles globaux (effets de grain, mise en page)
├── utils/
│   └── generator.ts    # Algorithmes pour la génération graphique
└── App.tsx            # Point d'entrée principal de l'application
```

## 🚀 Fonctionnalités futures

- **Partage sur les réseaux sociaux** : Export et partage direct des covers
- **Génération en PDF ou SVG** : Export haute qualité
- **Animations** : Effets dynamiques pendant la personnalisation
- **Connexion à une API** : Intégration des données de Laylow

## 👥 Contributeurs

- **Marvin Clerc** (Conception et développement)

## 📄 Licence

Ce projet est sous licence **MIT**. Vous êtes libre de l'utiliser, de le modifier et de le distribuer tout en citant l'auteur original.
