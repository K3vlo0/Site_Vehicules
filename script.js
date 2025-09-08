// Animation des particules de poussière
function createParticles() {
  const particlesContainer = document.getElementById('particles');
  
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.width = Math.random() * 4 + 2 + 'px';
    particle.style.height = particle.style.width;
    particle.style.animationDelay = Math.random() * 20 + 's';
    particle.style.animationDuration = (Math.random() * 15 + 20) + 's';
    particlesContainer.appendChild(particle);
  }
}

// Animation de la fumée radioactive
function createSmoke() {
  const smokeContainer = document.getElementById('smoke');
  
  for (let i = 0; i < 20; i++) {
    const smoke = document.createElement('div');
    smoke.className = 'smoke-particle';
    smoke.style.left = Math.random() * 100 + '%';
    smoke.style.width = Math.random() * 80 + 40 + 'px';
    smoke.style.height = smoke.style.width;
    smoke.style.animationDelay = Math.random() * 25 + 's';
    smoke.style.animationDuration = (Math.random() * 20 + 25) + 's';
    smokeContainer.appendChild(smoke);
  }
}

// Simulation du compteur de survivants
function updateSurvivorCount() {
  const counter = document.getElementById('survivorCount');
  if (counter) {
    const baseCount = 42;
    const variation = Math.floor(Math.random() * 10) - 5;
    const count = Math.max(1, baseCount + variation);
    counter.textContent = count;
  }
}

// Fonction de nettoyage radical du DOM
function cleanupDOM() {
  // Supprimer tous les nœuds de texte parasites dans le body
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  const textNodes = [];
  let node;
  while (node = walker.nextNode()) {
    textNodes.push(node);
  }

  textNodes.forEach(textNode => {
    const text = textNode.textContent.trim();
    const parent = textNode.parentNode;
    
    // Supprimer les nœuds de texte contenant "oto", "010", ou d'autres contenus parasites
    if (text.includes('oto') || text.includes('010') || text.includes('Prix :') || text.includes('Carburant :')) {
      // Vérifier que ce n'est pas dans un élément valide
      if (!parent.closest('.vehicle-card') && !parent.closest('.survivor-counter')) {
        textNode.remove();
      }
    }
    
    // Supprimer les nœuds de texte vides ou avec juste des espaces
    if (text === '' || text.match(/^\s*$/)) {
      textNode.remove();
    }
  });

  // Supprimer tous les éléments avec des classes ou IDs suspects
  const suspiciousElements = document.querySelectorAll('[class*="debug"], [id*="debug"], [class*="info"], [id*="info"]');
  suspiciousElements.forEach(el => el.remove());

  // Supprimer tout contenu directement dans le body qui n'est pas dans nos conteneurs principaux
  const allowedElements = [
    'particles', 'smoke', 'survivor-counter', 'navigation-help', 'social-buttons', 
    'main-menu', 'vehicle-catalog', 'script'
  ];
  
  Array.from(document.body.children).forEach(child => {
    const tagName = child.tagName.toLowerCase();
    const id = child.id;
    const className = child.className;
    
    // Garder seulement les éléments autorisés
    if (tagName === 'h1' || 
        allowedElements.includes(id) || 
        allowedElements.some(allowed => className.includes(allowed)) ||
        tagName === 'script') {
      return; // Garder cet élément
    } else {
      // Vérifier si l'élément contient du contenu parasite
      const text = child.textContent || '';
      if (text.includes('oto') || text.includes('010') || text.length < 3) {
        child.remove();
      }
    }
  });
}

// Attendre le chargement complet du DOM
document.addEventListener('DOMContentLoaded', function() {
  // Nettoyer le DOM dès le chargement
  cleanupDOM();
  
  const cards = document.querySelectorAll(".vehicle-card");
  const categoryBtns = document.querySelectorAll(".category-btn");
  const mainMenu = document.getElementById('main-menu');
  const vehicleCatalog = document.getElementById('vehicle-catalog');
  const categoryChoices = document.querySelectorAll('.category-choice');
  const backButton = document.getElementById('back-to-menu');
  const navigationHelp = document.getElementById('navigationHelp');
  
  let current = 0;
  let currentCategory = 'all';
  let currentCatalogType = 'all';
  let filteredCards = [...cards];

  // Nettoyer les cartes invalides ou vides
  function cleanupInvalidCards() {
    cards.forEach(card => {
      const h2 = card.querySelector('h2');
      const img = card.querySelector('img');
      
      // Supprimer les cartes sans nom ou avec des noms invalides
      if (!h2 || !h2.textContent.trim() || h2.textContent.trim().length < 2) {
        card.remove();
        return;
      }
      
      // Supprimer les cartes sans image valide
      if (!img || !img.src || img.src.includes('undefined')) {
        card.remove();
        return;
      }
      
      // Vérifier que la carte a les attributs nécessaires
      if (!card.getAttribute('data-category') || !card.getAttribute('data-type')) {
        card.remove();
        return;
      }
    });
    
    // Mettre à jour la liste des cartes après nettoyage
    filteredCards = [...document.querySelectorAll(".vehicle-card")];
  }

  // Afficher le menu principal, cacher le catalogue
  function showMainMenu() {
    // Nettoyer le DOM avant d'afficher le menu
    cleanupDOM();
    
    vehicleCatalog.classList.add('hidden');
    
    // Cacher l'aide à la navigation
    if (navigationHelp) {
      navigationHelp.style.display = 'none';
    }
    
    setTimeout(() => {
      vehicleCatalog.style.display = 'none';
      mainMenu.style.display = 'flex';
      
      setTimeout(() => {
        mainMenu.classList.remove('hidden');
        // Nettoyage supplémentaire après affichage
        cleanupDOM();
      }, 50);
    }, 500);
    
    currentCatalogType = 'all';
  }

  // Afficher le catalogue, cacher le menu principal
  function showCatalog(catalogType) {
    // Nettoyer le DOM avant d'afficher le catalogue
    cleanupDOM();
    
    mainMenu.classList.add('hidden');
    
    setTimeout(() => {
      mainMenu.style.display = 'none';
      vehicleCatalog.style.display = 'block';
      
      // Afficher l'aide à la navigation seulement sur desktop
      if (navigationHelp && window.innerWidth > 768) {
        navigationHelp.style.display = 'block';
      }
      
      setTimeout(() => {
        vehicleCatalog.classList.remove('hidden');
        // Nettoyage supplémentaire après affichage
        cleanupDOM();
      }, 50);
    }, 500);
    
    currentCatalogType = catalogType;
    currentCategory = 'all';
    categoryBtns.forEach(btn => btn.classList.remove('active'));
    if (categoryBtns[0]) categoryBtns[0].classList.add('active');
    
    filterCardsByCatalogType();
  }

  // Filtrer les cartes par type de catalogue (Vanilla ou import)
  function filterCardsByCatalogType() {
    const allCards = document.querySelectorAll(".vehicle-card");
    let availableCards;
    
    if (currentCatalogType === 'Vanilla') {
      availableCards = [...allCards].filter(card => 
        card.getAttribute('data-type') === 'Vanilla'
      );
    } else if (currentCatalogType === 'import') {
      availableCards = [...allCards].filter(card => 
        card.getAttribute('data-type') === 'import'
      );
    } else {
      availableCards = [...allCards];
    }

    // Ensuite filtrer par catégorie
    if (currentCategory === 'all') {
      filteredCards = availableCards;
    } else {
      filteredCards = availableCards.filter(card => 
        card.getAttribute('data-category') === currentCategory
      );
    }
    
    current = 0;
    updateCarousel();
  }

  // Mettre à jour l'affichage du carousel
  function updateCarousel() {
    // Cacher toutes les cartes d'abord
    const allCards = document.querySelectorAll(".vehicle-card");
    allCards.forEach(card => {
      card.classList.remove("active", "prev", "next", "far-prev", "far-next");
    });
    
    // Travailler uniquement avec les cartes filtrées
    if (filteredCards.length === 0) return;
    
    filteredCards.forEach((card, index) => {
      const position = index - current;
      
      if (position === 0) {
        card.classList.add("active");
      } else if (position === 1) {
        card.classList.add("next");
      } else if (position === -1) {
        card.classList.add("prev");
      } else if (position === 2) {
        card.classList.add("far-next");
      } else if (position === -2) {
        card.classList.add("far-prev");
      }
    });
    
    // Nettoyer après chaque mise à jour
    setTimeout(cleanupDOM, 100);
  }

  // Navigation suivant avec boucle dans la catégorie
  function nextCard() {
    if (filteredCards.length === 0) return;
    current = (current + 1) % filteredCards.length;
    updateCarousel();
  }

  // Navigation précédent avec boucle dans la catégorie
  function prevCard() {
    if (filteredCards.length === 0) return;
    current = (current - 1 + filteredCards.length) % filteredCards.length;
    updateCarousel();
  }

  // Event listeners pour les choix de catalogue (menu principal)
  categoryChoices.forEach(choice => {
    choice.addEventListener('click', () => {
      const catalogType = choice.getAttribute('data-type');
      showCatalog(catalogType);
    });
  });

  // Event listener pour le bouton retour
  if (backButton) {
    backButton.addEventListener('click', showMainMenu);
  }

  // Navigation par catégories (dans le catalogue)
  categoryBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      categoryBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      const category = btn.getAttribute('data-category');
      currentCategory = category;
      current = 0;
      filterCardsByCatalogType();
    });
  });

  // Bouton suivant du carousel
  const nextBtn = document.getElementById("next");
  if (nextBtn) {
    nextBtn.addEventListener("click", nextCard);
  }

  // Bouton précédent du carousel
  const prevBtn = document.getElementById("prev");
  if (prevBtn) {
    prevBtn.addEventListener("click", prevCard);
  }

  // Navigation au clavier améliorée
  document.addEventListener("keydown", (e) => {
    if (!vehicleCatalog || vehicleCatalog.style.display === 'none') return;
    if (filteredCards.length === 0) return;
    
    switch(e.key) {
      case "ArrowRight":
        e.preventDefault();
        nextCard();
        break;
      case "ArrowLeft":
        e.preventDefault();
        prevCard();
        break;
      case "Escape":
        e.preventDefault();
        showMainMenu();
        break;
      case " ":
        e.preventDefault();
        nextCard();
        break;
    }
  });

  // Clic sur une carte pour la sélectionner
  document.addEventListener("click", (e) => {
    const card = e.target.closest('.vehicle-card');
    if (card) {
      const filteredIndex = filteredCards.indexOf(card);
      if (filteredIndex !== -1) {
        current = filteredIndex;
        updateCarousel();
      }
    }
  });

  // Support tactile pour mobile (swipe)
  let startX = 0;
  let endX = 0;

  document.addEventListener('touchstart', (e) => {
    if (!vehicleCatalog || vehicleCatalog.style.display === 'none') return;
    startX = e.touches[0].clientX;
  });

  document.addEventListener('touchend', (e) => {
    if (!vehicleCatalog || vehicleCatalog.style.display === 'none') return;
    endX = e.changedTouches[0].clientX;
    handleSwipe();
  });

  function handleSwipe() {
    const diffX = startX - endX;
    const minSwipeDistance = 50;

    if (Math.abs(diffX) > minSwipeDistance) {
      if (diffX > 0) {
        nextCard();
      } else {
        prevCard();
      }
    }
  }

  // Initialisation de l'application
  function initializeApp() {
    cleanupInvalidCards();
    cleanupDOM();
    
    mainMenu.style.display = 'flex';
    vehicleCatalog.style.display = 'none';
    mainMenu.classList.remove('hidden');
    vehicleCatalog.classList.add('hidden');
    
    if (navigationHelp) {
      navigationHelp.style.display = 'none';
    }
    
    // Nettoyage final après initialisation
    setTimeout(cleanupDOM, 500);
  }
  
  // Initialiser les animations et l'application
  createParticles();
  createSmoke();
  updateSurvivorCount();
  
  // Mettre à jour le compteur toutes les 30 secondes
  setInterval(updateSurvivorCount, 30000);
  
  // Nettoyer le DOM régulièrement
  setInterval(cleanupDOM, 5000);
  
  initializeApp();
});

