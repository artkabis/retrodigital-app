# Créer le projet React de base
#npx create-react-app retrodigital-app
#cd retrodigital-app

# Nettoyer les fichiers non nécessaires
rm -rf src/*
rm -rf public/*

# Créer la structure de dossiers
mkdir -p public/images/{profiles,collections,items}
mkdir -p src/{data,components/{auth,collections,items,scanning,common},context,services,utils,styles/components}

# Créer les fichiers de base dans public
touch public/index.html
touch public/favicon.ico

# Créer les fichiers d'images (placeholders)
touch public/images/profiles/{martin.jpg,sophie.jpg,default.jpg}
touch public/images/collections/{scifi.jpg,vinyles.jpg,films.jpg,default.jpg}
touch public/images/items/{fondation.jpg,dune.jpg,dsotm.jpg,ctte.jpg,neuromancer.jpg,casablanca.jpg,godfather.jpg,default.jpg}

# Créer les fichiers sources dans src
touch src/App.js
touch src/index.js
touch src/data/mockData.js

# Créer les fichiers de composants
touch src/components/auth/{Login.js,Register.js,Profile.js}
touch src/components/collections/{CollectionList.js,CollectionDetail.js,CollectionForm.js}
touch src/components/items/{ItemList.js,ItemDetail.js,ItemForm.js,ItemCard.js}
touch src/components/scanning/{BarcodeScanner.js,ImageScanner.js}
touch src/components/common/{Header.js,Footer.js,Sidebar.js,LoadingIndicator.js}

# Créer les fichiers de contexte
touch src/context/{AuthContext.js,CollectionContext.js}

# Créer les fichiers de services
touch src/services/{authService.js,collectionService.js,scanService.js}

# Créer les fichiers utilitaires
touch src/utils/{formatters.js,validators.js}

# Créer les fichiers de style
touch src/styles/global.css
touch src/styles/components/{auth.css,collections.css,items.css}

# Installer les dépendances nécessaires
npm install react-router-dom