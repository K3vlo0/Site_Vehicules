const cards = document.querySelectorAll(".vehicle-card");
let current = 0;

function updateCarousel() {
  cards.forEach((card, index) => {
    // Supprime toutes les classes
    card.classList.remove("active", "prev", "next", "far-prev", "far-next");
    
    // Calcule la position relative par rapport à la carte active
    const position = index - current;
    
    if (position === 0) {
      // Carte active (centre)
      card.classList.add("active");
    } else if (position === 1) {
      // Carte suivante (droite)
      card.classList.add("next");
    } else if (position === -1) {
      // Carte précédente (gauche)
      card.classList.add("prev");
    } else if (position === 2) {
      // Carte lointaine droite
      card.classList.add("far-next");
    } else if (position === -2) {
      // Carte lointaine gauche
      card.classList.add("far-prev");
    }
    // Les autres cartes restent invisibles (pas de classe)
  });
}

// Bouton suivant
document.getElementById("next").addEventListener("click", () => {
  current = (current + 1) % cards.length;
  updateCarousel();
});

// Bouton précédent
document.getElementById("prev").addEventListener("click", () => {
  current = (current - 1 + cards.length) % cards.length;
  updateCarousel();
});

// Navigation clavier
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    current = (current + 1) % cards.length;
    updateCarousel();
  } else if (e.key === "ArrowLeft") {
    current = (current - 1 + cards.length) % cards.length;
    updateCarousel();
  }
});

// Clic sur une carte pour la sélectionner
cards.forEach((card, index) => {
  card.addEventListener("click", () => {
    current = index;
    updateCarousel();
  });
});

// Initialisation
updateCarousel();
