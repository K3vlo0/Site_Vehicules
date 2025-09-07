const cards = document.querySelectorAll(".vehicle-card");
const container = document.querySelector(".container");
let current = 0;

// Fonction pour centrer le carrousel sur la carte active
function updateCarousel() {
  // Supprime la classe active de toutes les cartes
  cards.forEach(card => card.classList.remove("active"));
  
  // Ajoute la classe active à la carte courante
  cards[current].classList.add("active");
  
  // Calcule le déplacement pour centrer la carte active
  const cardWidth = cards[0].offsetWidth + 30; // largeur + margins
  const containerWidth = container.offsetWidth;
  const offset = (containerWidth / 2) - (cardWidth / 2) - (current * cardWidth);
  
  // Applique la transformation à toutes les cartes
  cards.forEach((card, index) => {
    card.style.transform = `translateX(${offset}px) scale(${index === current ? 1 : 0.85})`;
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
    if (index !== current) {
      current = index;
      updateCarousel();
    }
  });
});

// Initialisation
updateCarousel();
