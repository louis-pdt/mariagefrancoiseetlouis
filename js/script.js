const toggle = document.querySelector(".nav-toggle");
const links = document.querySelector(".nav-links");

toggle?.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    links.classList.remove("open");
    toggle?.setAttribute("aria-expanded", "false");
  });
});
