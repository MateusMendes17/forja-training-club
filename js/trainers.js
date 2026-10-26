/* ==========================================================================
   Treinadores — grelha editorial e perfis em diálogo acessível
   ========================================================================== */

import {
  dayNamesShort,
  getNextSessionDate,
  getSessionsForTrainer,
  getTrainer,
  site,
  toISODate,
  trainers,
} from "./data.js";
import { escapeHTML, icon, openDialog, closeDialog, trackEvent } from "./ui.js";
import { trainerCard } from "./components.js";

let dialog;

function nextSlots(trainer, limit = 4) {
  const now = new Date();
  return getSessionsForTrainer(trainer.id)
    .map((session) => ({ session, date: getNextSessionDate(session, now) }))
    .filter(({ date }) => date instanceof Date)
    .sort((a, b) => a.date - b.date || a.session.start.localeCompare(b.session.start))
    .slice(0, limit);
}

function dialogBody(trainer) {
  const slots = nextSlots(trainer);
  return `
    <div class="trainer-modal__grid">
      <figure class="trainer-modal__media">
        <img src="${escapeHTML(trainer.image)}" alt="${escapeHTML(trainer.imageAlt)}" width="800" height="1000">
      </figure>
      <div class="trainer-modal__content">
        <p class="trainer-modal__role">${escapeHTML(trainer.role)}</p>
        <h2 class="trainer-modal__name" id="trainer-dialog-title">${escapeHTML(trainer.name)}</h2>
        <p class="trainer-modal__bio">${escapeHTML(trainer.bio)}</p>
        <div class="trainer-modal__facts">
          <div>
            <h3>Especialidades</h3>
            <ul>
              ${trainer.specialties.map((item) => `<li class="tag">${escapeHTML(item)}</li>`).join("")}
            </ul>
          </div>
          <div>
            <h3>Certificações</h3>
            <ul>
              ${trainer.certifications.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}
            </ul>
          </div>
          <div>
            <h3>Idiomas</h3>
            <p>${trainer.languages.map(escapeHTML).join(" · ")}</p>
          </div>
        </div>
        <div class="trainer-modal__schedule">
          <h3>Próximas aulas</h3>
          <div class="trainer-slots">
            ${
              slots.length
                ? slots
                    .map(({ session, date }) => {
                      const day = dayNamesShort[date.getDay()];
                      const dayNumber = String(date.getDate()).padStart(2, "0");
                      const month = String(date.getMonth() + 1).padStart(2, "0");
                      return `
                        <a class="trainer-slot" href="experimenta.html?sessao=${encodeURIComponent(session.id)}&data=${toISODate(date)}">
                          <strong>${escapeHTML(day)} ${dayNumber}/${month}</strong>
                          <span><time>${escapeHTML(session.start)}</time> · ${escapeHTML(session.name)}</span>
                          ${icon("arrow-right")}
                        </a>`;
                    })
                    .join("")
                : `<p class="muted">Sem aulas agendadas nesta semana.</p>`
            }
          </div>
        </div>
        <p class="demo-note" style="margin-top: 1rem;">Perfil e certificações ilustrativos. Substituir antes da publicação.</p>
      </div>
    </div>`;
}

function setHash(id) {
  try {
    window.history.replaceState(null, "", `treinadores.html#${encodeURIComponent(id)}`);
  } catch {
    /* Histórico indisponível. */
  }
}

function clearHash() {
  if (!window.location.hash) return;
  try {
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}`,
    );
  } catch {
    /* Histórico indisponível. */
  }
}

function openTrainer(id, { updateHash = true } = {}) {
  const trainer = getTrainer(id);
  if (!trainer || !dialog) return;
  const body = dialog.querySelector("[data-trainer-body]");
  const cta = dialog.querySelector("[data-trainer-cta]");
  const eyebrow = dialog.querySelector("[data-trainer-eyebrow]");
  if (!body) return;

  body.innerHTML = dialogBody(trainer);
  if (eyebrow) eyebrow.textContent = `Equipa FORJA / ${trainer.role}`;
  if (cta) {
    cta.href = `experimenta.html?treinador=${encodeURIComponent(trainer.id)}`;
    cta.dataset.track = "trial_with_trainer";
    cta.dataset.trackLocation = `trainer_${trainer.id}`;
  }

  if (updateHash) setHash(trainer.id);
  dialog.dataset.trainerId = trainer.id;
  openDialog(dialog);
  trackEvent("trainer_profile_open", { trainer: trainer.id });
}

function bindDialog() {
  document.addEventListener("click", (event) => {
    const opener = event.target.closest("[data-trainer-open]");
    if (opener) {
      event.preventDefault();
      openTrainer(opener.dataset.trainerOpen);
    }
  });

  dialog?.addEventListener("close", () => {
    clearHash();
    const gridButton = dialog.dataset.trainerId
      ? document.querySelector(`[data-trainer-open="${dialog.dataset.trainerId}"]`)
      : null;
    gridButton?.focus({ preventScroll: true });
  });

  window.addEventListener("hashchange", () => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (getTrainer(id) && !dialog?.open) openTrainer(id, { updateHash: false });
  });
}

function openFromHash() {
  const id = decodeURIComponent(window.location.hash.slice(1));
  if (getTrainer(id)) {
    window.setTimeout(() => openTrainer(id, { updateHash: false }), 80);
  }
}

export function initTrainers() {
  const grid = document.getElementById("trainer-grid");
  dialog = document.getElementById("trainer-dialog");

  if (grid) {
    grid.innerHTML = trainers.map((trainer) => trainerCard(trainer)).join("");
  }

  bindDialog();
  openFromHash();
  trackEvent("trainers_view", { count: trainers.length });
  document.documentElement.dataset.pageReady = "trainers";
}

// Exportação usada apenas para eventual verificação manual em consola.
export { openTrainer };
