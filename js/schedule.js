/* ==========================================================================
   Horário — filtros combinados, vista semanal/diária e detalhe acessível
   ========================================================================== */

import {
  dayNames,
  dayNamesShort,
  endTime,
  formatDateLong,
  getClass,
  getNextSessionDate,
  levels,
  schedule,
  startOfWeek,
  addDays,
  toISODate,
  classes,
  trainers,
  site,
} from "./data.js";
import { openDialog, closeDialog, escapeHTML, icon, showToast, trackEvent } from "./ui.js";

const dayOrder = [1, 2, 3, 4, 5, 6, 0];
const params = new URLSearchParams(window.location.search);
const validDay = (value) =>
  value !== null &&
  value !== "" &&
  dayOrder.includes(Number(value));
const state = {
  query: params.get("q") ?? "",
  classId: params.get("modalidade") ?? "",
  level: params.get("nivel") ?? "",
  trainerId: params.get("treinador") ?? "",
  activeDay: validDay(params.get("dia"))
    ? Number(params.get("dia"))
    : new Date().getDay(),
  view:
    params.get("vista") === "dia" || validDay(params.get("dia"))
      ? "day"
      : "week",
};

const now = new Date();
const weekStart = startOfWeek(now);
const weekDates = dayOrder.map((day, index) => ({
  day,
  date: addDays(weekStart, index),
}));

const centralDate = weekDates.find(({ day }) => day === state.activeDay)?.date ?? now;

let filterForm;
let resultsLabel;
let resetButton;
let scheduleGrid;
let dayTabs;
let viewButtons;
let dialog;

function normalize(value = "") {
  return value
    .toString()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

function isPastToday(session) {
  if (session.day !== now.getDay()) return false;
  const [h, m] = endTime(session.start, session.duration).split(":").map(Number);
  const finish = new Date(now);
  finish.setHours(h, m, 0, 0);
  return finish < now;
}

function sessionMatches(session) {
  if (state.classId && session.classId !== state.classId) return false;
  if (state.trainerId && session.trainerId !== state.trainerId) return false;
  if (state.level && session.level !== state.level) return false;
  if (state.query) {
    const haystack = normalize(
      [session.name, session.trainerName, session.room, getClass(session.classId)?.tagline]
        .filter(Boolean)
        .join(" "),
    );
    if (!haystack.includes(normalize(state.query))) return false;
  }
  return true;
}

function filteredSessions() {
  return schedule
    .filter(sessionMatches)
    .slice()
    .sort((a, b) => {
      const dayDiff = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
      return dayDiff || a.start.localeCompare(b.start);
    });
}

function filteredForView() {
  const sessions = filteredSessions();
  return state.view === "day"
    ? sessions.filter((session) => session.day === state.activeDay)
    : sessions;
}

function updateUrl() {
  const next = new URLSearchParams();
  if (state.query) next.set("q", state.query);
  if (state.classId) next.set("modalidade", state.classId);
  if (state.level) next.set("nivel", state.level);
  if (state.trainerId) next.set("treinador", state.trainerId);
  if (state.view === "day") {
    next.set("vista", "dia");
    next.set("dia", String(state.activeDay));
  } else {
    next.set("vista", "semana");
  }
  const query = next.toString();
  window.history.replaceState(null, "", `horario.html${query ? `?${query}` : ""}`);
}

function dayCountLabel(count) {
  return `${count} ${count === 1 ? "aula" : "aulas"}`;
}

function sessionCard(session) {
  const past = isPastToday(session);
  return `
    <button class="session-card${past ? " is-past" : ""}" type="button" data-session-id="${escapeHTML(session.id)}">
      <span class="session-card__time">
        <span>${escapeHTML(session.start)}</span>
        <span class="session-card__duration">${session.duration} min</span>
      </span>
      <span class="session-card__name">${escapeHTML(session.name)}</span>
      <span class="session-card__meta">${escapeHTML(session.trainerName)} · ${escapeHTML(session.room)}</span>
      <span class="session-card__bottom">
        <span class="session-card__level">${escapeHTML(session.level)}</span>
        <span class="session-card__spots">${session.spots}/${session.capacity} vagas*</span>
      </span>
      <span class="sr-only">Ver detalhes da sessão</span>
    </button>`;
}

function renderDays() {
  if (!scheduleGrid) return;
  const allMatches = filteredSessions();
  const isDayView = state.view === "day";

  if (allMatches.length === 0) {
    scheduleGrid.innerHTML = `
      <div class="schedule-empty">
        <span class="schedule-empty__mark" aria-hidden="true">${icon("search")}</span>
        <h2>Sem horário para esta combinação.</h2>
        <p>Experimenta remover um filtro ou consultar a semana completa.</p>
        <button class="btn btn--sweep" type="button" data-reset-filters>Limpar filtros ${icon("close")}</button>
      </div>`;
    scheduleGrid.dataset.view = state.view;
    scheduleGrid.dataset.empty = "true";
    scheduleGrid.scrollLeft = 0;
    return;
  }

  delete scheduleGrid.dataset.empty;
  scheduleGrid.dataset.view = state.view;
  scheduleGrid.innerHTML = dayOrder
    .map((day, index) => {
      const date = weekDates[index].date;
      const sessions = allMatches.filter((session) => session.day === day);
      const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();
      const isActive = state.activeDay === day;
      return `
        <section class="schedule-day${isToday ? " is-today" : ""}${isActive ? " is-active" : ""}" aria-labelledby="schedule-day-${day}">
          <div class="schedule-day__head">
            <span class="schedule-day__name" id="schedule-day-${day}">${escapeHTML(dayNames[day])}</span>
            <span class="schedule-day__date">${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}</span>
          </div>
          <div class="schedule-day__sessions">
            ${
              sessions.length
                ? sessions.map(sessionCard).join("")
                : `<p class="schedule-day__empty">Dia sem aulas com estes filtros.</p>`
            }
          </div>
        </section>`;
    })
    .join("");

  if (isDayView) {
    scheduleGrid.querySelector(".schedule-day.is-active")?.setAttribute("aria-live", "polite");
  }
}

function renderCounts() {
  const count = filteredForView().length;
  if (resultsLabel) {
    resultsLabel.textContent = `${count} ${count === 1 ? "aula encontrada" : "aulas encontradas"}${
      state.view === "day" ? ` em ${dayNames[state.activeDay].toLowerCase()}` : " esta semana"
    }.`;
  }
  if (resetButton) {
    resetButton.disabled =
      !state.query &&
      !state.classId &&
      !state.level &&
      !state.trainerId &&
      state.view === "week";
  }
}

function renderDayTabs() {
  if (!dayTabs) return;
  dayTabs.hidden = state.view !== "day";
  dayTabs.innerHTML = weekDates
    .map(({ day, date }) => {
      const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear();
      return `
        <button class="day-tab${state.activeDay === day ? " is-active" : ""}${isToday ? " is-today" : ""}" type="button" data-day-tab="${day}" aria-pressed="${state.activeDay === day}" aria-label="${escapeHTML(dayNamesShort[day])} ${String(date.getDate()).padStart(2, "0")}, ${escapeHTML(dayNames[day])}, ${String(date.getDate()).padStart(2, "0")} de ${date.toLocaleDateString("pt-PT", { month: "long" })}">
          <span class="day-tab__name">${escapeHTML(dayNamesShort[day])}</span>
          <span class="day-tab__date">${String(date.getDate()).padStart(2, "0")}</span>
        </button>`;
    })
    .join("");
  requestAnimationFrame(() => {
    if (dayTabs.hidden) return;
    const active = dayTabs.querySelector(".day-tab.is-active");
    if (!active) return;
    const tabRect = dayTabs.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    const centered =
      dayTabs.scrollLeft +
      activeRect.left -
      tabRect.left -
      (tabRect.width - activeRect.width) / 2;
    dayTabs.scrollLeft = Math.max(
      0,
      Math.min(centered, dayTabs.scrollWidth - dayTabs.clientWidth),
    );
  });
}

function syncControls() {
  if (!filterForm) return;
  const q = filterForm.querySelector("[name='q']");
  const className = filterForm.querySelector("[name='modalidade']");
  const level = filterForm.querySelector("[name='nivel']");
  const trainer = filterForm.querySelector("[name='treinador']");
  const dayField = filterForm.querySelector("[name='dia']");
  if (q) q.value = state.query;
  if (className) className.value = state.classId;
  if (level) level.value = state.level;
  if (trainer) trainer.value = state.trainerId;
  if (dayField) dayField.value = state.view === "day" ? String(state.activeDay) : "";
  viewButtons?.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.scheduleView === state.view));
  });
}

function renderWeekLabel() {
  const first = weekDates[0].date;
  const last = weekDates[6].date;
  const element = document.getElementById("week-range");
  if (!element) return;
  const month = new Intl.DateTimeFormat("pt-PT", { month: "long" }).format(last);
  element.textContent = `${first.getDate()}–${last.getDate()} de ${month}`;
}

function renderAll() {
  renderDays();
  renderDayTabs();
  renderCounts();
  syncControls();
  renderWeekLabel();
  updateUrl();
}

function resetFilters() {
  state.query = "";
  state.classId = "";
  state.level = "";
  state.trainerId = "";
  state.view = "week";
  state.activeDay = new Date().getDay();
  renderAll();
  filterForm?.querySelector("[name='q']")?.focus({ preventScroll: true });
}

function icsDatePieces(session, sourceDate) {
  const date = getNextSessionDate(session, sourceDate) ?? sourceDate;
  const iso = toISODate(date).replaceAll("-", "");
  const start = session.start.replace(":", "") + "00";
  const end = endTime(session.start, session.duration).replace(":", "") + "00";
  return { iso, start, end, date };
}

function buildICS(sessions, sourceDate = new Date()) {
  const escapeICS = (value = "") =>
    String(value)
      .replaceAll("\\", "\\\\")
      .replaceAll("\n", "\\n")
      .replaceAll(",", "\\,")
      .replaceAll(";", "\\;");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//FORJA Training Club//Horario//PT",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:FORJA Training Club",
  ];
  sessions.forEach((session) => {
    const { iso, start, end, date } = icsDatePieces(session, sourceDate);
    const classItem = getClass(session.classId);
    lines.push(
      "BEGIN:VEVENT",
      `UID:${session.id}-${iso}@forja.pt`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
      `DTSTART:${iso}T${start}`,
      `DTEND:${iso}T${end}`,
      `SUMMARY:${escapeICS(`${session.name} · FORJA`)}`,
      `LOCATION:${escapeICS(`${site.address.street}, ${site.address.postalCode} ${site.address.city}`)}`,
      `DESCRIPTION:${escapeICS(
        `${classItem?.tagline ?? ""}. Treinador: ${session.trainerName}. Nível: ${session.level}. Duração: ${session.duration} min.`,
      )}`,
      `URL:https://forja-training-club.vercel.app/aula.html?id=${encodeURIComponent(session.classId)}`,
      "END:VEVENT",
    );
  });
  lines.push("END:VCALENDAR");
  const fileNameDate = toISODate(dateFromSessions(sessions, sourceDate));
  return {
    content: `${lines.join("\r\n")}\r\n`,
    filename: `forja-horario-${fileNameDate}.ics`,
  };
}

function dateFromSessions(sessions, sourceDate) {
  const first = sessions[0];
  if (!first) return sourceDate;
  return getNextSessionDate(first, sourceDate) ?? sourceDate;
}

function downloadICS(sessions, sourceDate) {
  if (!sessions.length) {
    showToast("Não há aulas para exportar com estes filtros.", "error");
    return;
  }
  const { content, filename } = buildICS(sessions, sourceDate);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast(`Calendário .ics gerado com ${sessions.length} ${sessions.length === 1 ? "aula" : "aulas"}.`);
  trackEvent("schedule_ics_download", { count: sessions.length, view: state.view });
}

function intensityMarkup(value) {
  return `
    <span class="intensity" role="img" aria-label="Intensidade ${value} de 5">
      ${[1, 2, 3, 4, 5]
        .map((step) => `<span class="intensity__bar${step <= value ? " is-on" : ""}"></span>`)
        .join("")}
    </span>`;
}

function openSessionDialog(session) {
  if (!dialog) return;
  const classItem = getClass(session.classId);
  const nextDate = getNextSessionDate(session, new Date()) ?? new Date();
  const dateIso = toISODate(nextDate);
  const dateLabel = formatDateLong(nextDate);
  const capacity = Number(session.capacity) || 0;
  const spots = Number(session.spots) || 0;
  const occupancy = capacity ? Math.round(((capacity - spots) / capacity) * 100) : 0;

  const body = dialog.querySelector("[data-session-dialog-body]");
  const eyebrow = dialog.querySelector("[data-session-dialog-eyebrow]");
  const book = dialog.querySelector("[data-session-book]");
  const ics = dialog.querySelector("[data-session-ics]");
  if (!body || !eyebrow) return;

  eyebrow.textContent = `${dayNames[session.day]} · ${dateLabel}`;
  body.innerHTML = `
    <p class="tag tag--accent">Aula ${escapeHTML(classItem?.number ?? "")} / ${escapeHTML(session.level)}</p>
    <h2 class="session-detail__title" id="session-dialog-title">${escapeHTML(session.name)}</h2>
    <p class="session-detail__tagline">${escapeHTML(classItem?.tagline ?? "Treino acompanhado na FORJA.")}</p>

    <div class="session-detail__meta">
      <div><span>Hora</span><strong>${escapeHTML(session.start)}–${escapeHTML(endTime(session.start, session.duration))}</strong></div>
      <div><span>Duração</span><strong>${session.duration} minutos</strong></div>
      <div><span>Treinador</span><strong>${escapeHTML(session.trainerName)}</strong></div>
      <div><span>Sala</span><strong>${escapeHTML(session.room)}</strong></div>
    </div>

    <p class="session-detail__copy">${escapeHTML(classItem?.description?.[0] ?? "")}</p>

    <div class="session-detail__columns">
      <div>
        <h3>O que esperar</h3>
        <ul>
          ${(classItem?.whatToExpect ?? []).slice(0, 4).map((item) => `<li>${escapeHTML(item)}</li>`).join("")}
        </ul>
      </div>
      <div>
        <h3>Antes de entrar</h3>
        <p>${escapeHTML(classItem?.bring?.slice(0, 4).join(" · ") ?? "Roupa desportiva e água.")}</p>
        <h3 style="margin-top: 0.8rem;">Intensidade</h3>
        <p>${intensityMarkup(classItem?.intensity ?? 3)} <span class="mono-label">${classItem?.intensity ?? 3}/5</span></p>
      </div>
    </div>

    <div class="availability-row">
      <div>
        <span class="availability-row__value"><span>${spots}</span> de ${capacity} lugares disponíveis*</span>
        <p class="availability-row__note">Ocupação simulada: ${occupancy}% · atualizada apenas nesta demonstração</p>
      </div>
      <span class="tag">${escapeHTML(session.level)}</span>
    </div>`;

  if (book) {
    book.href = `experimenta.html?sessao=${encodeURIComponent(session.id)}&data=${dateIso}`;
    book.dataset.track = "book_from_schedule";
    book.dataset.trackLocation = "schedule_modal";
  }
  if (ics) {
    ics.onclick = () => downloadICS([session], new Date());
  }

  dialog.dataset.sessionId = session.id;
  openDialog(dialog);
  trackEvent("schedule_session_open", { session: session.id, class: session.classId });
}

function bindFilters() {
  if (!filterForm) return;
  filterForm.addEventListener("change", (event) => {
    const field = event.target;
    if (!(field instanceof HTMLSelectElement)) return;
    if (field.name === "dia") {
      if (field.value === "") {
        state.view = "week";
      } else {
        state.view = "day";
        state.activeDay = Number(field.value);
      }
      renderAll();
    }
  });

  filterForm.addEventListener("submit", (event) => event.preventDefault());

  const search = filterForm.querySelector("[name='q']");
  let timer;
  search?.addEventListener("input", () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      state.query = search.value.trim();
      renderAll();
    }, 120);
  });

  filterForm.querySelector("[name='modalidade']")?.addEventListener("change", (event) => {
    state.classId = event.target.value;
    renderAll();
  });
  filterForm.querySelector("[name='nivel']")?.addEventListener("change", (event) => {
    state.level = event.target.value;
    renderAll();
  });
  filterForm.querySelector("[name='treinador']")?.addEventListener("change", (event) => {
    state.trainerId = event.target.value;
    renderAll();
  });

  resetButton?.addEventListener("click", resetFilters);
  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-reset-filters]")) resetFilters();
  });
}

function bindControls() {
  viewButtons?.forEach((button) => {
    button.addEventListener("click", () => {
      const selected = button.dataset.scheduleView;
      state.view = selected === "day" ? "day" : "week";
      if (state.view === "day" && !dayOrder.includes(state.activeDay)) {
        state.activeDay = new Date().getDay();
      }
      renderAll();
    });
  });

  dayTabs?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-day-tab]");
    if (!button) return;
    state.activeDay = Number(button.dataset.dayTab);
    state.view = "day";
    renderAll();
  });

  scheduleGrid?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-session-id]");
    if (!button) return;
    const session = schedule.find((item) => item.id === button.dataset.sessionId);
    if (session) openSessionDialog(session);
  });

  document.querySelector("[data-print-schedule]")?.addEventListener("click", () => {
    trackEvent("schedule_print");
    window.print();
  });

  document.querySelector("[data-download-ics]")?.addEventListener("click", () => {
    downloadICS(filteredForView());
  });

  document.querySelector("[data-session-dialog-close]")?.addEventListener("click", () => {
    closeDialog(dialog);
  });

  window.addEventListener("popstate", () => {
    const next = new URLSearchParams(window.location.search);
    state.query = next.get("q") ?? "";
    state.classId = next.get("modalidade") ?? "";
    state.level = next.get("nivel") ?? "";
    state.trainerId = next.get("treinador") ?? "";
    state.view =
      next.get("vista") === "dia" || validDay(next.get("dia")) ? "day" : "week";
    state.activeDay = validDay(next.get("dia")) ? Number(next.get("dia")) : new Date().getDay();
    renderAll();
  });
}

function buildFilterOptions() {
  if (!filterForm) return;
  const classSelect = filterForm.querySelector("[name='modalidade']");
  const trainerSelect = filterForm.querySelector("[name='treinador']");
  const levelSelect = filterForm.querySelector("[name='nivel']");
  const daySelect = filterForm.querySelector("[name='dia']");

  if (classSelect) {
    classSelect.insertAdjacentHTML(
      "beforeend",
      classes
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name, "pt"))
        .map((item) => `<option value="${escapeHTML(item.id)}">${escapeHTML(item.name)}</option>`)
        .join(""),
    );
  }
  if (trainerSelect) {
    trainerSelect.insertAdjacentHTML(
      "beforeend",
      trainers
        .map((trainer) => `<option value="${escapeHTML(trainer.id)}">${escapeHTML(trainer.name)}</option>`)
        .join(""),
    );
  }
  if (levelSelect) {
    levelSelect.insertAdjacentHTML(
      "beforeend",
      levels
        .map((level) => `<option value="${escapeHTML(level)}">${escapeHTML(level)}</option>`)
        .join(""),
    );
  }
  if (daySelect) {
    daySelect.insertAdjacentHTML(
      "beforeend",
      dayOrder
        .map((day) => `<option value="${day}">${escapeHTML(dayNames[day])}</option>`)
        .join(""),
    );
  }
}

export function initSchedule() {
  filterForm = document.querySelector("[data-schedule-filters]");
  resultsLabel = document.querySelector("[data-results-label]");
  resetButton = document.querySelector("[data-reset-filters]");
  scheduleGrid = document.getElementById("schedule-grid");
  dayTabs = document.querySelector("[data-day-tabs]");
  viewButtons = [...document.querySelectorAll("[data-schedule-view]")];
  dialog = document.getElementById("session-dialog");

  buildFilterOptions();
  bindFilters();
  bindControls();
  renderAll();
  document.documentElement.dataset.pageReady = "schedule";
}
