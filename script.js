const cards = document.querySelectorAll(".vehicle-card");
let current = 0;

document.getElementById("next").addEventListener("click", () => {
  cards[current].classList.remove("active");
  current = (current + 1) % cards.length;
  cards[current].classList.add("active");
});

document.getElementById("prev").addEventListener("click", () => {
  cards[current].classList.remove("active");
  current = (current - 1 + cards.length) % cards.length;
  cards[current].classList.add("active");
});
