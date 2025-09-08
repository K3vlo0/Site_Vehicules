// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  const cards = document.querySelectorAll(".vehicle-card");
  const categoryBtns = document.querySelectorAll(".category-btn");
  let current = 0;
  let currentCategory = 'all';
  let filteredCards = [...cards];

  // Filter cards by category
  function filterCardsByCategory(category) {
    currentCategory = category;
    
    if (category === 'all') {
      filteredCards = [...cards];
    } else {
      filteredCards = [...cards].filter(card => 
        card.getAttribute('data-category') === category
      );
    }
    
    // Reset current to 0 when changing category
    current = 0;
    updateCarousel();
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

  // Category navigation
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
    if (filteredCards.length === 0) return;
    
    if (e.key === "ArrowRight") {
      current = (current + 1) % filteredCards.length;
      updateCarousel();
    } else if (e.key === "ArrowLeft") {
      current = (current - 1 + filteredCards.length) % filteredCards.length;
      updateCarousel();
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

  // Initialize carousel
  updateCarousel();
});
