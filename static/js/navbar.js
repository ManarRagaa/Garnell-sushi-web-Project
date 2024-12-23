document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger-menu");
  const navbar = document.querySelector(".navbar-links");

  // Ensure the elements exist before adding event listeners
  if (hamburger && navbar) {
      hamburger.addEventListener("click", () => {
          console.log("Hamburger clicked!"); // Debugging
          navbar.classList.toggle("show");
      });
  } else {
      console.error("Could not find hamburger or navbar elements.");
  }
});

  