/* ==========================================================================
   Página inicial — composição de conteúdo factual e horário do dia
   ========================================================================== */

import {
  classes,
  facilities,
  faqs,
  formatDateLong,
  getClass,
  getNextSessionDate,
  getTodaySessions,
  plans,
  schedule,
  site,
  toISODate,
  addDays,
  formatDateShort,
} from "./data.js";
import { escapeHTML, icon, trackEvent } from "./ui.js";
import {
  classCard,
  facilityTile,
  faqItem,
  planCard,
  trainerCard,
} from "./components.js";
import { trainers } from "./data.js";

function renderClasses() {
  const container = document.getElementById("home-classes");
  if (!container) return;
  container.innerHTML = classes.slice(0, 6).map(classCard).join("");
}

function renderPlans() {
  const container = document.getElementById("home-plans");
  if (!container) return;
  container.innerHTML = plans
    .map((plan) => planCard(plan, { compact: true }))
    .join("");
}

function renderTrainers() {
  const container = document.getElementById("home-trainers");
  if (!container) return;
  container.innerHTML = trainers
    .slice(0, 4)
    .map((trainer) => trainerCard(trainer, { linked: true }))
    .join("");
}

function renderFacilities() {
  const container = document.getElementById("home-facilities");
  if (!container) return;
  container.innerHTML = facilities.map(facilityTile).join("");
}

function renderFaq() {
  const container = document.getElementById("home-faq");
  if (!container) return;
  container.innerHTML = faqs.slice(0, 4).map(faqItem).join("");
}

function pickUpcomingDay() {
  const now = new Date();
  const todaySessions = getTodaySessions(now);
  if (todaySessions.length) {
    return {
      mode: "today",
      date: now,
      sessions: todaySessions.slice(0, 5),
    };
  }

  for (let offset = 1; offset <= 7; offset += 1) {
    const candidate = addDays(now, offset);
    const sessions = schedule
      .filter((session) => session.day === candidate.getDay())
      .sort((a, b) => (a.start > b.start ? 1 : -1));
    if (sessions.length) {
      return {
        mode: "next",
        date: candidate,
        sessions: sessions.slice(0, 5),
      };
    }
  }

  return { mode: "empty", date: now, sessions: [] };
}

function renderToday() {
  const list = document.getElementById("today-list");
  const title = document.getElementById("today-title");
  const dateLabel = document.getElementById("today-date");
  const note = document.getElementById("today-note");
  const fullLink = document.getElementById("today-link");
  if (!list) return;

  const upcoming = pickUpcomingDay();
  if (!upcoming.sessions.length) {
    list.innerHTML = `
      <div class="today-empty">
        <h3>O horário está a atualizar.</h3>
        <p>Consulta o horário completo para veres todas as aulas da semana.</p>
      </div>`;
    return;
  }

  if (title) title.textContent = upcoming.mode === "today" ? "Hoje na FORJA." : "A seguir na FORJA.";
  if (dateLabel) dateLabel.textContent = formatDateLong(upcoming.date);
  if (note) {
    note.textContent =
      upcoming.mode === "today"
        ? "Aulas de hoje. Lugares ilustrativos nesta demonstração."
        : "Hoje já não há aulas. Esta é a próxima sessão do horário.";
  }
  if (fullLink) {
    fullLink.href = `horario.html?dia=${upcoming.mode === "today" ? upcoming.date.getDay() : upcoming.sessions[0].day}`;
    fullLink.innerHTML = `Ver horário completo ${icon("arrow-right")}`;
  }

  list.innerHTML = upcoming.sessions
    .map((session) => {
      const classItem = getClass(session.classId);
      const date = getNextSessionDate(session, new Date()) ?? upcoming.date;
      const bookingDate = toISODate(date);
      return `
        <a class="today-item" href="experimenta.html?sessao=${encodeURIComponent(session.id)}&data=${bookingDate}" data-track="book_from_home" data-track-location="home_today">
          <span class="today-item__time">${escapeHTML(session.start)}</span>
          <span class="today-item__main">
            <h3>${escapeHTML(session.name)}</h3>
            <span class="today-item__meta">
              <span>${session.duration} min</span>
              <span>${escapeHTML(session.trainerName.split(" ")[0])}</span>
              <span>${escapeHTML(session.room)}</span>
            </span>
          </span>
          <span class="today-item__action">Reservar ${icon("arrow-up-right")}</span>
        </a>`;
    })
    .join("");
}

function initFacilityScroller() {
  const scroller = document.querySelector("[data-facility-scroller]");
  const prev = document.querySelector("[data-scroller-prev]");
  const next = document.querySelector("[data-scroller-next]");
  if (!scroller) return;

  const scrollByCard = (direction) => {
    const firstCard = scroller.querySelector(".facility-tile");
    const width = firstCard ? firstCard.getBoundingClientRect().width + 16 : 320;
    scroller.scrollBy({ left: direction * width * 1.2, behavior: "smooth" });
  };

  prev?.addEventListener("click", () => scrollByCard(-1));
  next?.addEventListener("click", () => scrollByCard(1));

  const update = () => {
    const max = scroller.scrollWidth - scroller.clientWidth - 2;
    if (prev) prev.disabled = scroller.scrollLeft <= 2;
    if (next) next.disabled = scroller.scrollLeft >= max;
  };

  scroller.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}

export function initHome() {
  renderClasses();
  renderPlans();
  renderTrainers();
  renderFacilities();
  renderFaq();
  renderToday();
  initFacilityScroller();

  trackEvent("home_view", { page: "home" });

  // Facilita testes manuais sem alterar a navegação real.
  document.documentElement.dataset.pageReady = "home";
}
