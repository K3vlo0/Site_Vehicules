// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  const cards = document.querySelectorAll(".vehicle-card");
  const categoryBtns = document.querySelectorAll(".category-btn");
  const mainMenu = document.getElementById('main-menu');
  const vehicleCatalog = document.getElementById('vehicle-catalog');
  const categoryChoices = document.querySelectorAll('.category-choice');
  const backButton = document.getElementById('back-to-menu');
  
  let current = 0;
  let currentCategory = 'all';
  let currentCatalogType = 'all'; // 'lore-friendly' or 'import'
  let filteredCards = [...cards];

  // Show main menu, hide catalog
  function showMainMenu() {
    // Fade out catalog first
    vehicleCatalog.classList.add('hidden');
    
    setTimeout(() => {
      vehicleCatalog.style.display = 'none';
      mainMenu.style.display = 'flex';
      
      // Fade in main menu
      setTimeout(() => {
        mainMenu.classList.remove('hidden');
      }, 50);
    }, 500);
    
    currentCatalogType = 'all';
  }

  // Show catalog, hide main menu
  function showCatalog(catalogType) {
    // Fade out main menu first
    mainMenu.classList.add('hidden');
    
    setTimeout(() => {
      mainMenu.style.display = 'none';
      vehicleCatalog.style.display = 'block';
      
      // Fade in catalog
      setTimeout(() => {
        vehicleCatalog.classList.remove('hidden');
      }, 50);
    }, 500);
    
    currentCatalogType = catalogType;
    
    // Reset category to "Tous"
    currentCategory = 'all';
    categoryBtns.forEach(btn => btn.classList.remove('active'));
    categoryBtns[0].classList.add('active'); // Premier bouton "Tous"
    
    // Filter and show vehicles
    filterCardsByCatalogType();
  }

  // Filter cards by catalog type (lore-friendly or import)
  function filterCardsByCatalogType() {
    let availableCards;
    
    if (currentCatalogType === 'lore-friendly') {
      availableCards = [...cards].filter(card => 
        card.getAttribute('data-type') === 'lore-friendly'
      );
    } else if (currentCatalogType === 'import') {
      availableCards = [...cards].filter(card => 
        card.getAttribute('data-type') === 'import'
      );
    } else {
      availableCards = [...cards];
    }

    // Then filter by category
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

  // Filter cards by category within current catalog type
  function filterCardsByCategory(category) {
    currentCategory = category;
    filterCardsByCatalogType();
  }

  // Update carousel display
  function updateCarousel() {
    // Hide all cards first
    cards.forEach(card => {
      card.classList.remove("active", "prev", "next", "far-prev", "far-next");
    });
    
    // Only work with filtered cards
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
  }

  // Category choice event listeners (main menu)
  categoryChoices.forEach(choice => {
    choice.addEventListener('click', () => {
      const catalogType = choice.getAttribute('data-type');
      showCatalog(catalogType);
    });
  });

  // Back button event listener
  if (backButton) {
    backButton.addEventListener('click', showMainMenu);
  }

  // Category navigation (in catalog)
  categoryBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      // Update active category button
      categoryBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      
      // Filter cards
      const category = btn.getAttribute('data-category');
      filterCardsByCategory(category);
    });
  });

  // Carousel navigation - Next button
  const nextBtn = document.getElementById("next");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (filteredCards.length > 0) {
        current = (current + 1) % filteredCards.length;
        updateCarousel();
      }
    });
  }

  // Carousel navigation - Previous button
  const prevBtn = document.getElementById("prev");
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (filteredCards.length > 0) {
        current = (current - 1 + filteredCards.length) % filteredCards.length;
        updateCarousel();
      }
    });
  }

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    // Only work if catalog is visible
    if (vehicleCatalog.style.display === 'none') return;
    if (filteredCards.length === 0) return;
    
    if (e.key === "ArrowRight") {
      current = (current + 1) % filteredCards.length;
      updateCarousel();
    } else if (e.key === "ArrowLeft") {
      current = (current - 1 + filteredCards.length) % filteredCards.length;
      updateCarousel();
    } else if (e.key === "Escape") {
      showMainMenu();
    }
  });

  // Click on card to select
  cards.forEach((card, index) => {
    card.addEventListener("click", () => {
      // Find index in filtered cards
      const filteredIndex = filteredCards.indexOf(card);
      if (filteredIndex !== -1) {
        current = filteredIndex;
        updateCarousel();
      }
    });
  });

  // Initialize - show main menu
  function initializeApp() {
    mainMenu.style.display = 'flex';
    vehicleCatalog.style.display = 'none';
    mainMenu.classList.remove('hidden');
    vehicleCatalog.classList.add('hidden');
  }
  
  initializeApp();
});
