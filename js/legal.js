/* ==========================================================================
   Páginas legais — índice de secções recolhível em ecrãs pequenos
   ========================================================================== */

export function initLegal() {
  const toggle = document.querySelector("[data-legal-nav-toggle]");
  const sections = document.querySelector("[data-legal-sections]");
  if (!toggle || !sections) return;

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    sections.classList.toggle("is-open", open);
  };

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  sections.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  const smallScreen = window.matchMedia("(max-width: 760px)");
  smallScreen.addEventListener?.("change", () => setOpen(false));
}
