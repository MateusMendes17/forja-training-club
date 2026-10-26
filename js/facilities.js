/* ==========================================================================
   Instalações — seis zonas, regras de utilização e lightbox acessível
   ========================================================================== */

import { facilities, facilityRules, site } from "./data.js";
import { escapeHTML, icon, openDialog, closeDialog, trackEvent } from "./ui.js";

let lightbox;
let currentIndex = 0;
let opener = null;

function accessLabel(item) {
  return item.id === "recuperacao"
    ? "Sauna no Pro · massagem à parte"
    : "Incluída em todos os planos";
}

function renderZones() {
  const container = document.getElementById("facility-zones");
  if (!container) return;
  container.innerHTML = facilities
    .map(
      (item, index) => `
      <article class="facility-zone" id="${escapeHTML(item.id)}" data-reveal>
        <button class="facility-zone__media" type="button" data-lightbox-index="${index}" aria-label="Ampliar fotografia: ${escapeHTML(item.name)}">
          <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.imageAlt)}" width="1200" height="900" loading="lazy">
          <span class="facility-zone__zoom">${icon("search")} Ampliar</span>
        </button>
        <div class="facility-zone__content">
          <span class="facility-zone__num">Zona ${escapeHTML(item.number)}</span>
          <h2 class="facility-zone__title">${escapeHTML(item.name)}</h2>
          <div class="facility-zone__meta">
            <span class="tag">${item.area} m²</span>
            <span class="tag tag--accent">${escapeHTML(accessLabel(item))}</span>
          </div>
          <p class="facility-zone__description">${escapeHTML(item.description)}</p>
          <ul class="equipment-list">
            ${item.equipment.map((equipment) => `<li>${escapeHTML(equipment)}</li>`).join("")}
          </ul>
          <div style="display:flex; flex-wrap:wrap; gap:.8rem; margin-top:1.2rem;">
            <a class="link-arrow" href="horario.html">Ver aulas e horário ${icon("arrow-right")}</a>
            <a class="link-arrow" href="experimenta.html" data-track="cta_trial" data-track-location="facility_${escapeHTML(item.id)}">Marcar visita ${icon("arrow-up-right")}</a>
          </div>
          <p class="demo-note" style="margin-top:.8rem;">${escapeHTML(item.imageCredit)}.</p>
        </div>
      </article>`,
    )
    .join("");
}

function renderIndex() {
  const container = document.getElementById("facility-index");
  if (!container) return;
  container.innerHTML = facilities
    .map(
      (item) =>
        `<a class="chip" href="#${escapeHTML(item.id)}">${escapeHTML(item.number)} ${escapeHTML(item.name)}</a>`,
    )
    .join("");
}

function renderRules() {
  const container = document.getElementById("facility-rules");
  if (!container) return;
  container.innerHTML = facilityRules
    .map(
      (rule, index) => `
      <article class="rule-card" data-reveal>
        <span class="rule-card__num">${String(index + 1).padStart(2, "0")}</span>
        <h3>${escapeHTML(rule.title)}</h3>
        <p>${escapeHTML(rule.text)}</p>
      </article>`,
    )
    .join("");
}

function updateLightbox(index) {
  if (!lightbox) return;
  const total = facilities.length;
  currentIndex = (index + total) % total;
  const item = facilities[currentIndex];
  const image = lightbox.querySelector("[data-lightbox-image]");
  const counter = lightbox.querySelector("[data-lightbox-counter]");
  const caption = lightbox.querySelector("[data-lightbox-caption]");
  if (image) {
    image.src = item.image;
    image.alt = item.imageAlt;
  }
  if (counter) {
    counter.textContent = `${currentIndex + 1} / ${total} · ${item.name}`;
  }
  if (caption) {
    caption.innerHTML = `<strong>${escapeHTML(item.name)}</strong> — ${item.area} m². ${escapeHTML(item.summary)} <span class="muted">${escapeHTML(item.imageCredit)}.</span>`;
  }
}

function openLightbox(index, trigger) {
  if (!lightbox) return;
  opener = trigger ?? null;
  updateLightbox(index);
  openDialog(lightbox);
  trackEvent("facility_lightbox_open", { facility: facilities[currentIndex].id });
}

function bindLightbox() {
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-lightbox-index]");
    if (trigger) {
      openLightbox(Number(trigger.dataset.lightboxIndex), trigger);
    }
  });

  lightbox?.querySelector("[data-lightbox-prev]")?.addEventListener("click", () => updateLightbox(currentIndex - 1));
  lightbox?.querySelector("[data-lightbox-next]")?.addEventListener("click", () => updateLightbox(currentIndex + 1));
  lightbox?.querySelector("[data-lightbox-close]")?.addEventListener("click", () => closeDialog(lightbox));

  lightbox?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      updateLightbox(currentIndex - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      updateLightbox(currentIndex + 1);
    }
  });

  lightbox?.addEventListener("close", () => {
    opener?.focus({ preventScroll: true });
  });
}

function checkHash() {
  const id = decodeURIComponent(window.location.hash.slice(1));
  if (!facilities.some((item) => item.id === id)) return;
  window.setTimeout(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 120);
}

export function initFacilities() {
  lightbox = document.getElementById("facility-lightbox");
  renderZones();
  renderIndex();
  renderRules();
  bindLightbox();
  checkHash();
  window.addEventListener("hashchange", checkHash);
  trackEvent("facilities_view", { count: facilities.length });
  document.documentElement.dataset.pageReady = "facilities";
}
