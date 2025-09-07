const cards = document.querySelectorAll(".vehicle-card");
let current = 0;

function updateCarousel() {
  // Supprime la classe active de toutes les cartes
  cards.forEach((card, index) => {
    card.classList.remove("active");
  });
  
  // Ajoute la classe active à la carte courante
  cards[current].classList.add("active");
  
  // Fait défiler vers la carte active sur mobile
  if (window.innerWidth <= 900) {
    cards[current].scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }
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

// Détection du redimensionnement pour s'adapter
window.addEventListener("resize", () => {
  updateCarousel();
});

// Initialisation
updateCarousel();
