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

// Attendre le chargement complet du DOM
document.addEventListener('DOMContentLoaded', function() {
  const cards = document.querySelectorAll('.vehicle-card');
  const categoryBtns = document.querySelectorAll('.category-btn');
  const mainMenu = document.getElementById('main-menu');
  const vehicleCatalog = document.getElementById('vehicle-catalog');
  const categoryChoices = document.querySelectorAll('.category-choice');
  const backButton = document.getElementById('back-to-menu');
  const navigationHelp = document.getElementById('navigationHelp');
  const importantNotice = document.getElementById('importantNotice');
  
  let current = 0;
  let currentCategory = 'all';
  let currentCatalogType = 'all';
  let filteredCards = Array.from(cards);

  console.log('Total véhicules chargés:', cards.length);
  
  // Compter les véhicules par catégorie pour debug
  const categoryCounts = {};
  cards.forEach(function(card) {
    const category = card.getAttribute('data-category');
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });
  console.log('Répartition par catégorie:', categoryCounts);

  // Fonction pour masquer le message de rappel
  function hideImportantNotice() {
    if (importantNotice) {
      importantNotice.classList.add('hidden');
    }
  }

  // Fonction pour afficher le message de rappel
  function showImportantNotice() {
    if (importantNotice) {
      importantNotice.classList.remove('hidden');
    }
  }

  // Afficher le menu principal, cacher le catalogue
  function showMainMenu() {
    vehicleCatalog.classList.add('hidden');
    
    if (navigationHelp) {
      navigationHelp.style.display = 'none';
    }
    
    setTimeout(function() {
      vehicleCatalog.style.display = 'none';
      mainMenu.style.display = 'flex';
      
      setTimeout(function() {
        mainMenu.classList.remove('hidden');
        showImportantNotice(); // Afficher le message quand on revient au menu
      }, 50);
    }, 500);
    
    currentCatalogType = 'all';
  }

  // Afficher le catalogue, cacher le menu principal
  function showCatalog(catalogType) {
    mainMenu.classList.add('hidden');
    hideImportantNotice(); // Masquer le message quand on entre dans le catalogue
    
    setTimeout(function() {
      mainMenu.style.display = 'none';
      vehicleCatalog.style.display = 'block';
      
      if (navigationHelp && window.innerWidth > 768) {
        navigationHelp.style.display = 'block';
      }
      
      setTimeout(function() {
        vehicleCatalog.classList.remove('hidden');
      }, 50);
    }, 500);
    
    currentCatalogType = catalogType;
    currentCategory = 'all';
    
    // Réinitialiser les boutons de catégorie
    categoryBtns.forEach(function(btn) {
      btn.classList.remove('active');
    });
    if (categoryBtns[0]) {
      categoryBtns[0].classList.add('active');
    }
    
    filterCards();
  }

  // Fonction principale de filtrage
  function filterCards() {
    console.log('Filtrage: type=' + currentCatalogType + ', catégorie=' + currentCategory);
    
    const allCards = document.querySelectorAll('.vehicle-card');
    let visibleCards = [];
    
    allCards.forEach(function(card) {
      let shouldShow = true;
      
      // Filtrer par type de catalogue (vanilla vs import)
      if (currentCatalogType !== 'all') {
        const cardType = card.getAttribute('data-type');
        if (currentCatalogType === 'vanilla' && cardType !== 'vanilla') {
          shouldShow = false;
        } else if (currentCatalogType === 'import' && cardType !== 'import') {
          shouldShow = false;
        }
      }
      
      // Filtrer par catégorie de véhicule
      if (shouldShow && currentCategory !== 'all') {
        const cardCategory = card.getAttribute('data-category');
        if (cardCategory !== currentCategory) {
          shouldShow = false;
        }
      }
      
      if (shouldShow) {
        visibleCards.push(card);
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
        // Retirer toutes les classes d'état du carousel
        card.classList.remove('active', 'prev', 'next', 'far-prev', 'far-next');
      }
    });
    
    filteredCards = visibleCards;
    current = 0;
    
    console.log('Véhicules affichés: ' + filteredCards.length);
    
    // Compter par catégorie dans les résultats filtrés
    const filteredCategoryCounts = {};
    filteredCards.forEach(function(card) {
      const category = card.getAttribute('data-category');
      filteredCategoryCounts[category] = (filteredCategoryCounts[category] || 0) + 1;
    });
    console.log('Répartition filtrée:', filteredCategoryCounts);
    
    updateCarousel();
  }

  // Mettre à jour l'affichage du carousel
  function updateCarousel() {
    // Retirer toutes les classes d'état
    const allCards = document.querySelectorAll('.vehicle-card');
    allCards.forEach(function(card) {
      card.classList.remove('active', 'prev', 'next', 'far-prev', 'far-next');
    });
    
    if (filteredCards.length === 0) {
      console.log('Aucun véhicule à afficher');
      return;
    }
    
    // Appliquer les classes de position seulement aux cartes visibles
    filteredCards.forEach(function(card, index) {
      const position = index - current;
      
      if (position === 0) {
        card.classList.add('active');
      } else if (position === 1) {
        card.classList.add('next');
      } else if (position === -1) {
        card.classList.add('prev');
      } else if (position === 2) {
        card.classList.add('far-next');
      } else if (position === -2) {
        card.classList.add('far-prev');
      }
    });
  }

  // Navigation suivant avec boucle
  function nextCard() {
    if (filteredCards.length === 0) return;
    current = (current + 1) % filteredCards.length;
    updateCarousel();
  }

  // Navigation précédent avec boucle
  function prevCard() {
    if (filteredCards.length === 0) return;
    current = (current - 1 + filteredCards.length) % filteredCards.length;
    updateCarousel();
  }

  // Event listeners pour les choix de catalogue (menu principal)
  categoryChoices.forEach(function(choice) {
    choice.addEventListener('click', function() {
      const catalogType = choice.getAttribute('data-type');
      console.log('Catalogue sélectionné:', catalogType);
      showCatalog(catalogType);
    });
  });

  // Event listener pour le bouton retour
  if (backButton) {
    backButton.addEventListener('click', showMainMenu);
  }

  // Navigation par catégories (dans le catalogue)
  categoryBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      categoryBtns.forEach(function(b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');
      
      const category = btn.getAttribute('data-category');
      console.log('Catégorie sélectionnée:', category);
      currentCategory = category;
      current = 0;
      filterCards();
    });
  });

  // Boutons de navigation du carousel
  const nextBtn = document.getElementById('next');
  const prevBtn = document.getElementById('prev');
  
  if (nextBtn) {
    nextBtn.addEventListener('click', nextCard);
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', prevCard);
  }

  // Navigation au clavier
  document.addEventListener('keydown', function(e) {
    if (!vehicleCatalog || vehicleCatalog.style.display === 'none') return;
    if (filteredCards.length === 0) return;
    
    switch(e.key) {
      case 'ArrowRight':
        e.preventDefault();
        nextCard();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        prevCard();
        break;
      case 'Escape':
        e.preventDefault();
        showMainMenu();
        break;
      case ' ':
        e.preventDefault();
        nextCard();
        break;
    }
  });

  // Clic sur une carte pour la sélectionner
  document.addEventListener('click', function(e) {
    const card = e.target.closest('.vehicle-card');
    if (card && filteredCards.includes(card)) {
      const filteredIndex = filteredCards.indexOf(card);
      if (filteredIndex !== -1) {
        current = filteredIndex;
        updateCarousel();
      }
    }
  });

  // Support tactile pour mobile
  let startX = 0;
  let endX = 0;

  document.addEventListener('touchstart', function(e) {
    if (!vehicleCatalog || vehicleCatalog.style.display === 'none') return;
    startX = e.touches[0].clientX;
  });

  document.addEventListener('touchend', function(e) {
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

  // Fonction pour nettoyer le contenu parasite
  function cleanParasiteContent() {
    // Supprimer les nœuds de texte orphelins qui contiennent du code HTML
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    const textNodes = [];
    let node;
    
    while ((node = walker.nextNode())) {
      textNodes.push(node);
    }
    
    textNodes.forEach(function(textNode) {
      const content = textNode.textContent.trim();
      // Supprimer les nœuds qui contiennent des fragments HTML
      if (content.includes('images/') || content.includes('alt=') || content.includes('src=') || content.includes('apocalyptic.png')) {
        textNode.remove();
      }
    });
  }

  // Initialisation de l'application
  function initializeApp() {
    console.log('Initialisation de l\'application');
    
    mainMenu.style.display = 'flex';
    vehicleCatalog.style.display = 'none';
    mainMenu.classList.remove('hidden');
    vehicleCatalog.classList.add('hidden');
    
    if (navigationHelp) {
      navigationHelp.style.display = 'none';
    }
    
    // Nettoyer le contenu parasite
    cleanParasiteContent();
    
    // Afficher le message de rappel au démarrage
    showImportantNotice();
    
    // Initialiser avec tous les véhicules
    currentCatalogType = 'all';
    currentCategory = 'all';
    filterCards();
    
    // Nettoyer régulièrement le contenu parasite
    setInterval(cleanParasiteContent, 5000);
  }
  
  // Initialiser les animations et l'application
  createParticles();
  createSmoke();
  updateSurvivorCount();
  
  // Mettre à jour le compteur toutes les 30 secondes
  setInterval(updateSurvivorCount, 30000);
  
  initializeApp();
});
