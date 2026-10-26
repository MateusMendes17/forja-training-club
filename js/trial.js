/* ==========================================================================
   Marcação de experiência — três passos, validação e confirmação simulada
   ========================================================================== */

import {
  addDays,
  classes,
  endTime,
  formatPrice,
  fromISODate,
  getClass,
  getNextSessionDate,
  getSession,
  getTrainer,
  plans,
  schedule,
  site,
  toISODate,
} from "./data.js";
import { escapeHTML, icon, showToast, trackEvent } from "./ui.js";

const DATE_RANGE_DAYS = 60;
const PERIODS = {
  manha: { label: "Manhã · 10h00", start: "10:00", end: "10:45" },
  tarde: { label: "Tarde · 15h00", start: "15:00", end: "15:45" },
  fimdia: { label: "Fim do dia · 18h30", start: "18:30", end: "19:15" },
};

const state = {
  step: 1,
  type: "aula",
  date: "",
  selectedSessionId: "",
  sessionFilter: "",
  trainerFilter: "",
  planId: "",
  confirmation: null,
};

let form;
let errorSummary;
let dateInput;
let slotsContainer;
let slotsError;
let sessionContext;
let aulaFields;
let visitaFields;
let periodSelect;
let successPanel;
let submitButton;
let busy = false;

function parseLocalISO(value) {
  if (!value) return null;
  const parsed = fromISODate(value);
  if (!(parsed instanceof Date) || Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

function todayStart() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function capitalize(value = "") {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function longDate(date) {
  if (!(date instanceof Date)) return "—";
  return capitalize(
    new Intl.DateTimeFormat("pt-PT", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date),
  );
}

function sessionsFor(date, { ignoreFilters = false } = {}) {
  if (!(date instanceof Date)) return [];
  const day = date.getDay();
  const isToday =
    toISODate(date) === toISODate(new Date()) &&
    date.getFullYear() === new Date().getFullYear();
  const now = new Date();

  return schedule
    .filter((session) => {
      if (session.day !== day) return false;
      if (!ignoreFilters && state.sessionFilter && session.classId !== state.sessionFilter)
        return false;
      if (!ignoreFilters && state.trainerFilter && session.trainerId !== state.trainerFilter)
        return false;
      if (isToday) {
        const [hour, minute] = endTime(session.start, session.duration).split(":").map(Number);
        const finish = new Date(date);
        finish.setHours(hour, minute, 0, 0);
        if (finish <= now) return false;
      }
      return true;
    })
    .sort((a, b) => a.start.localeCompare(b.start));
}

function hasSessionsOn(date) {
  return sessionsFor(date, { ignoreFilters: true }).length > 0;
}

function firstUsefulDate() {
  const start = todayStart();
  for (let offset = 0; offset <= 7; offset += 1) {
    const candidate = addDays(start, offset);
    if (sessionsFor(candidate).length) return candidate;
  }
  return start;
}

function findSession(id) {
  return id ? getSession(id) : null;
}

function updateSessionContext() {
  if (!sessionContext) return;
  const bits = [];
  if (state.sessionFilter) {
    bits.push(getClass(state.sessionFilter)?.name ?? "Modalidade");
  }
  if (state.trainerFilter) {
    bits.push(getTrainer(state.trainerFilter)?.name ?? "Treinador");
  }
  if (!bits.length) {
    sessionContext.hidden = true;
    sessionContext.innerHTML = "";
    return;
  }
  sessionContext.hidden = false;
  sessionContext.innerHTML = `
    <span>Filtro ativo: <strong>${bits.map(escapeHTML).join(" · ")}</strong></span>
    <button type="button" class="filter-reset" data-clear-session-filter>${icon("close")} Ver todas</button>`;
}

function generateSlots({ preserve = true } = {}) {
  if (!slotsContainer || !dateInput) return;
  const date = parseLocalISO(dateInput.value);
  const slots = date ? sessionsFor(date) : [];

  if (preserve) {
    const exists = slots.some((session) => session.id === state.selectedSessionId);
    if (!exists) state.selectedSessionId = "";
  }

  if (!date) {
    slotsContainer.innerHTML = `<p class="slot-empty">Escolhe uma data para veres os horários disponíveis.</p>`;
  } else if (!slots.length) {
    slotsContainer.innerHTML = `
      <div class="slot-empty">
        <p>Não há aulas ${state.sessionFilter || state.trainerFilter ? "com este filtro" : ""} neste dia.</p>
        <p style="margin-top:.35rem;">Tenta outra data${state.sessionFilter || state.trainerFilter ? " ou remove o filtro" : ""}.</p>
      </div>`;
  } else {
    slotsContainer.innerHTML = slots
      .map(
        (session) => `
        <label class="slot-option">
          <input type="radio" name="sessao" value="${escapeHTML(session.id)}"${state.selectedSessionId === session.id ? " checked" : ""}>
          <span class="slot-option__radio" aria-hidden="true"></span>
          <span class="slot-option__main">
            <strong>${escapeHTML(session.name)} · ${escapeHTML(session.trainerName)}</strong>
            <span>${session.duration} min · ${escapeHTML(session.level)} · ${escapeHTML(session.room)}</span>
          </span>
          <span class="slot-option__time">${escapeHTML(session.start)}</span>
        </label>`,
      )
      .join("");
  }
  updateSessionContext();
}

function setType(type) {
  state.type = type === "visita" ? "visita" : "aula";
  if (aulaFields) aulaFields.hidden = state.type !== "aula";
  if (visitaFields) visitaFields.hidden = state.type !== "visita";
  if (periodSelect) {
    periodSelect.disabled = state.type !== "visita";
    if (state.type === "visita" && !periodSelect.value) periodSelect.value = "manha";
  }
  if (slotsError) slotsError.textContent = "";
}

function clearErrorFor(name) {
  const target = form?.querySelector(`[data-field-error="${name}"]`);
  if (target) target.textContent = "";
  const field = form?.querySelector(`[name="${name}"]`);
  if (field && "ariaInvalid" in field) field.removeAttribute("aria-invalid");
  form?.querySelectorAll(`[name="${name}"]`).forEach((element) => element.removeAttribute("aria-invalid"));
  if (errorSummary) errorSummary.innerHTML = "";
  if (name === "sessao") {
    slotsContainer?.classList.remove("is-invalid");
    slotsContainer?.querySelectorAll(".slot-option").forEach((slot) => slot.classList.remove("is-invalid"));
  }
}

function markError(field, message) {
  const error = form?.querySelector(`[data-field-error="${field}"]`);
  if (error) error.textContent = message;
  const elements =
    field === "sessao"
      ? form?.querySelectorAll('input[name="sessao"]')
      : form?.querySelectorAll(`[name="${field}"]`);
  elements?.forEach((element) => element.setAttribute("aria-invalid", "true"));
  if (field === "sessao") {
    slotsContainer?.classList.add("is-invalid");
    slotsContainer?.querySelectorAll(".slot-option").forEach((slot) => slot.classList.add("is-invalid"));
  }
}

function validateStep(step) {
  const errors = [];
  if (step === 1) {
    const date = parseLocalISO(dateInput?.value);
    const min = todayStart();
    const max = addDays(min, DATE_RANGE_DAYS);

    if (!date) {
      errors.push({ field: "data", message: "Escolhe uma data.", focus: dateInput });
    } else if (date < min) {
      errors.push({ field: "data", message: "Escolhe uma data a partir de hoje.", focus: dateInput });
    } else if (date > max) {
      errors.push({
        field: "data",
        message: `Escolhe uma data nos próximos ${DATE_RANGE_DAYS} dias.`,
        focus: dateInput,
      });
    }

    if (state.type === "aula") {
      const selected = findSession(state.selectedSessionId);
      const selectedRadio = form?.querySelector('input[name="sessao"]:checked');
      if (!selected || !selectedRadio) {
        errors.push({
          field: "sessao",
          message: "Escolhe uma aula do horário disponível.",
          focus: slotsContainer?.querySelector("input") ?? slotsError,
        });
      } else if (date && selected.day !== date.getDay()) {
        errors.push({
          field: "sessao",
          message: "A aula escolhida não acontece no dia selecionado. Escolhe outro horário.",
          focus: slotsContainer?.querySelector("input"),
        });
      }
    } else if (!periodSelect?.value) {
      errors.push({
        field: "periodo",
        message: "Escolhe um período para a visita.",
        focus: periodSelect,
      });
    }
  }

  if (step === 2) {
    const name = form?.elements.nome;
    const email = form?.elements.email;
    const phone = form?.elements.telemovel;
    if (!name?.value.trim() || name.value.trim().length < 2) {
      errors.push({ field: "nome", message: "Indica o teu nome.", focus: name });
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!email?.value.trim() || !emailPattern.test(email.value.trim())) {
      errors.push({ field: "email", message: "Indica um email válido.", focus: email });
    }
    const digits = phone?.value.replace(/\D/g, "") ?? "";
    if (!digits || digits.length < 9) {
      errors.push({
        field: "telemovel",
        message: "Indica um número de telemóvel com pelo menos 9 dígitos.",
        focus: phone,
      });
    }
  }

  if (step === 3) {
    const privacy = form?.elements.privacidade;
    if (!privacy?.checked) {
      errors.push({
        field: "privacidade",
        message: "Precisamos do teu consentimento para tratar os dados desta marcação.",
        focus: privacy,
      });
    }
  }

  errors.forEach((error) => markError(error.field, error.message));
  return errors;
}

function showErrors(errors) {
  if (!errorSummary) return;
  if (!errors.length) {
    errorSummary.innerHTML = "";
    return;
  }
  errorSummary.innerHTML = `
    <strong>Há campos por corrigir.</strong>
    <ul>
      ${errors
        .map((error) => {
          const targetId =
            error.focus?.id || (error.field === "sessao" ? "trial-slots" : error.field);
          return `<li><a href="#${escapeHTML(targetId)}" data-error-link>${escapeHTML(error.message)}</a></li>`;
        })
        .join("")}
    </ul>`;
  errorSummary.hidden = false;
  errorSummary.focus({ preventScroll: true });
  errorSummary.scrollIntoView({ behavior: "smooth", block: "center" });
  trackEvent("trial_validation_error", { step: state.step, fields: errors.map((error) => error.field) });
}

function setStep(step, { focus = true } = {}) {
  state.step = step;
  form?.querySelectorAll("[data-step]").forEach((section) => {
    section.hidden = Number(section.dataset.step) !== step;
  });
  document.querySelectorAll("[data-step-indicator]").forEach((indicator) => {
    const number = Number(indicator.dataset.stepIndicator);
    indicator.classList.toggle("is-active", number === step);
    indicator.classList.toggle("is-complete", number < step);
    if (number === step) indicator.setAttribute("aria-current", "step");
    else indicator.removeAttribute("aria-current");
  });
  if (errorSummary) errorSummary.innerHTML = "";
  if (step === 3) updateSummary();
  if (focus) {
    const heading = form?.querySelector(`[data-step="${step}"] h3`);
    heading?.setAttribute("tabindex", "-1");
    heading?.focus({ preventScroll: false });
  }
}

function sessionForSummary() {
  return findSession(state.selectedSessionId);
}

function visitTime() {
  return PERIODS[periodSelect?.value] ?? PERIODS.manha;
}

function updateSummary() {
  const container = document.getElementById("trial-summary");
  if (!container) return;
  const date = parseLocalISO(dateInput?.value);
  const session = sessionForSummary();
  const typeLabel = state.type === "aula" ? "Aula experimental" : "Visita e avaliação";
  const when =
    state.type === "aula" && session
      ? `${longDate(date)} · ${session.start}–${endTime(session.start, session.duration)}`
      : `${longDate(date)} · ${visitTime().label}`;
  const trainer = state.type === "aula" && session ? getTrainer(session.trainerId)?.name : "Equipa FORJA";
  const chosenPlan = state.planId ? plans.find((plan) => plan.id === state.planId) : null;

  container.innerHTML = `
    <div class="summary-card__head">
      <span>Resumo da tua marcação</span>
      <button class="summary-edit" type="button" data-edit-step="1">Editar</button>
    </div>
    <dl class="summary-card__body">
      <div class="summary-line"><dt>Tipo</dt><dd>${escapeHTML(typeLabel)}</dd></div>
      <div class="summary-line"><dt>Quando</dt><dd>${escapeHTML(when)}</dd></div>
      <div class="summary-line"><dt>Aula / Motivo</dt><dd>${escapeHTML(state.type === "aula" ? session?.name ?? "—" : "Visita com avaliação inicial")}</dd></div>
      <div class="summary-line"><dt>Treinador</dt><dd>${escapeHTML(trainer ?? "Equipa FORJA")}</dd></div>
      ${
        chosenPlan
          ? `<div class="summary-line summary-line--full"><dt>Plano de interesse</dt><dd>${escapeHTML(chosenPlan.name)} · ${formatPrice(chosenPlan.monthly)}/mês</dd></div>`
          : ""
      }
    </dl>`;
}

function collectData() {
  const formData = new FormData(form);
  const date = parseLocalISO(dateInput?.value);
  const session = sessionForSummary();
  const tipo = formData.get("tipo") === "visita" ? "visita" : "aula";
  const period = visitTime();
  return {
    tipo,
    date,
    session,
    period,
    nome: String(formData.get("nome") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    telemovel: String(formData.get("telemovel") ?? "").trim(),
    contacto: String(formData.get("contacto") ?? ""),
    objetivo: String(formData.get("objetivo") ?? ""),
    saude: String(formData.get("saude") ?? "").trim(),
    planId: state.planId,
  };
}

function referenceCode() {
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `FORJA-${new Date().getFullYear()}-${suffix}`;
}

function icsPieces(data) {
  const date = data.date;
  const startTime = data.tipo === "aula" && data.session ? data.session.start : data.period.start;
  const endTimeValue =
    data.tipo === "aula" && data.session
      ? endTime(data.session.start, data.session.duration)
      : data.period.end;
  const iso = toISODate(date).replaceAll("-", "");
  return {
    start: `${iso}T${startTime.replace(":", "")}00`,
    end: `${iso}T${endTimeValue.replace(":", "")}00`,
  };
}

function buildICS(data) {
  const escapeICS = (value = "") =>
    String(value)
      .replaceAll("\\", "\\\\")
      .replaceAll("\n", "\\n")
      .replaceAll(",", "\\,")
      .replaceAll(";", "\\;");
  const { start, end } = icsPieces(data);
  const title =
    data.tipo === "aula" && data.session
      ? `Aula experimental — ${data.session.name}`
      : "Visita e avaliação — FORJA";
  const description =
    data.tipo === "aula" && data.session
      ? `Aula experimental na FORJA Training Club com ${data.session.trainerName}. Chega 15 minutos antes. Marcação simulada: confirma com a equipa.`
      : "Visita com avaliação inicial na FORJA Training Club. Chega 5 minutos antes. Marcação simulada: confirma com a equipa.";
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//FORJA Training Club//Experiencia//PT",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@forja.pt`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escapeICS(title)}`,
    `LOCATION:${escapeICS(`${site.address.street}, ${site.address.postalCode} ${site.address.city}`)}`,
    `DESCRIPTION:${escapeICS(description)}`,
    "URL:https://forja-training-club.vercel.app/experimenta.html",
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

function downloadICS() {
  if (!state.confirmation) return;
  const blob = new Blob([buildICS(state.confirmation)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `forja-experiencia-${toISODate(state.confirmation.date)}.ics`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
  showToast("Ficheiro .ics gerado. Abre-o para adicionar ao calendário.");
  trackEvent("trial_ics_download", { type: state.confirmation.tipo });
}

function renderSuccess(data) {
  if (!successPanel) return;
  const date = data.date;
  const session = data.session;
  const typeLabel = data.tipo === "aula" ? "Aula experimental" : "Visita com avaliação";
  const when =
    data.tipo === "aula" && session
      ? `${longDate(date)} · ${session.start}–${endTime(session.start, session.duration)}`
      : `${longDate(date)} · ${data.period.label}`;
  const reference = referenceCode();

  successPanel.innerHTML = `
    <span class="success-panel__mark" aria-hidden="true">${icon("check")}</span>
    <p class="eyebrow">Pedido registado nesta demonstração</p>
    <h3 tabindex="-1" data-success-title>Recebemos o teu pedido, ${escapeHTML(data.nome.split(" ")[0])}.</h3>
    <p>Esta é uma <strong>confirmação simulada</strong>. Nenhum email ou reserva real foi criado. Numa versão em produção, receberias a confirmação da equipa e os dados para alterar ou cancelar.</p>
    <div class="summary-card">
      <div class="summary-card__head">
        <span>Reserva ${escapeHTML(reference)}</span>
        <span>Aguarda contacto</span>
      </div>
      <dl class="summary-card__body">
        <div class="summary-line"><dt>Tipo</dt><dd>${escapeHTML(typeLabel)}</dd></div>
        <div class="summary-line"><dt>Quando</dt><dd>${escapeHTML(when)}</dd></div>
        <div class="summary-line"><dt>Modalidade</dt><dd>${escapeHTML(session?.name ?? "Visita e avaliação")}</dd></div>
        <div class="summary-line"><dt>Contacto</dt><dd>${escapeHTML(data.email)}<br>${escapeHTML(data.telemovel)}</dd></div>
      </dl>
    </div>
    <p class="demo-note" style="margin-top:.8rem;">Simulação local. A equipa da FORJA confirmaria a disponibilidade por telefone, email ou WhatsApp.</p>
    <div class="success-actions">
      <button class="btn btn--solid btn--sm" type="button" data-download-booking-ics>
        <span>Adicionar ao calendário</span>
        ${icon("download")}
      </button>
      <a class="btn btn--sweep btn--sm" href="${site.whatsappUrl}" target="_blank" rel="noopener noreferrer">
        <span>Falar por WhatsApp</span>
        ${icon("whatsapp")}
      </a>
      <button class="btn btn--ghost btn--sm" type="button" data-trial-restart>
        <span>Marcar outra experiência</span>
        ${icon("arrow-left")}
      </button>
    </div>`;
  successPanel.hidden = false;
  successPanel.querySelector("[data-success-title]")?.focus();
  successPanel.scrollIntoView({ behavior: "smooth", block: "center" });
}

async function handleSubmit(event) {
  event.preventDefault();
  if (busy) return;

  const step1 = validateStep(1);
  if (step1.length) {
    setStep(1, { focus: false });
    showErrors(step1);
    return;
  }
  const step2 = validateStep(2);
  if (step2.length) {
    setStep(2, { focus: false });
    showErrors(step2);
    return;
  }
  const step3 = validateStep(3);
  if (step3.length) {
    showErrors(step3);
    return;
  }

  busy = true;
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.setAttribute("aria-busy", "true");
    submitButton.innerHTML = `<span>A confirmar...</span>${icon("clock")}`;
  }

  const data = collectData();
  await new Promise((resolve) => window.setTimeout(resolve, 650));
  state.confirmation = data;
  clearAllErrors();
  form.hidden = true;
  document.querySelector(".steps")?.setAttribute("hidden", "");
  document.querySelector("[data-booking-form-head]")?.setAttribute("hidden", "");
  equivalentScreenreaderAnnouncement(data, "sucesso");
  renderSuccess(data);
  trackEvent("trial_submit", {
    type: data.tipo,
    class: data.session?.classId ?? "visita",
    plan: data.planId || "none",
    health_shared: Boolean(data.saude),
  });
  busy = false;
  if (submitButton) {
    submitButton.disabled = false;
    submitButton.removeAttribute("aria-busy");
  }
}

function equivalentScreenreaderAnnouncement(data, outcome) {
  const announcer = document.getElementById("trial-announcer");
  if (!announcer) return;
  announcer.textContent = `Marcação simulada com ${outcome}: ${data.tipo === "visita" ? "visita" : data.session?.name ?? "aula"}.`;
}

function resetForm() {
  form?.reset();
  state.step = 1;
  state.type = "aula";
  state.selectedSessionId = "";
  state.sessionFilter = "";
  state.trainerFilter = "";
  state.date = toISODate(firstUsefulDate());
  state.confirmation = null;
  if (dateInput) dateInput.value = state.date;
  setType("aula");
  generateSlots({ preserve: false });
  if (successPanel) successPanel.hidden = true;
  if (form) form.hidden = false;
  document.querySelector(".steps")?.removeAttribute("hidden");
  document.querySelector("[data-booking-form-head]")?.removeAttribute("hidden");
  setStep(1);
  clearAllErrors();
}

function clearAllErrors() {
  form?.querySelectorAll("[data-field-error]").forEach((element) => {
    element.textContent = "";
  });
  form?.querySelectorAll("[aria-invalid]").forEach((element) => element.removeAttribute("aria-invalid"));
  if (errorSummary) errorSummary.innerHTML = "";
}

function applyQueryState() {
  const params = new URLSearchParams(window.location.search);
  const planId = params.get("plano");
  if (plans.some((plan) => plan.id === planId)) state.planId = planId;
  state.sessionFilter = params.get("aula") ?? "";
  state.trainerFilter = params.get("treinador") ?? "";

  if (state.sessionFilter && !getClass(state.sessionFilter)) state.sessionFilter = "";
  if (state.trainerFilter && !getTrainer(state.trainerFilter)) state.trainerFilter = "";

  const session = params.get("sessao") ? findSession(params.get("sessao")) : null;
  let date = parseLocalISO(params.get("data"));
  if (session) {
    state.sessionFilter = session.classId;
    if (!date || date.getDay() !== session.day) {
      date = getNextSessionDate(session, new Date()) ?? firstUsefulDate();
    }
    state.selectedSessionId = session.id;
  }

  if (!date || date < todayStart() || date > addDays(todayStart(), DATE_RANGE_DAYS)) {
    date = firstUsefulDate();
  }
  state.date = toISODate(date);
  state.type = "aula";
  if (dateInput) {
    dateInput.value = state.date;
    dateInput.min = toISODate(todayStart());
    dateInput.max = toISODate(addDays(todayStart(), DATE_RANGE_DAYS));
  }
  const typeAula = form?.querySelector('input[name="tipo"][value="aula"]');
  if (typeAula) typeAula.checked = true;
  setType("aula");
  generateSlots({ preserve: true });
}

function bindForm() {
  form?.addEventListener("submit", handleSubmit);

  form?.addEventListener("change", (event) => {
    const target = event.target;
    if (target.name === "tipo") {
      setType(target.value);
      clearErrorFor("tipo");
      clearErrorFor("sessao");
      clearErrorFor("periodo");
    }
    if (target.name === "sessao") {
      state.selectedSessionId = target.value;
      clearErrorFor("sessao");
    }
    if (target.name === "periodo") clearErrorFor("periodo");
    if (target.name === "privacidade") clearErrorFor("privacidade");
  });

  form?.addEventListener("input", (event) => {
    const target = event.target;
    if (target.name === "data") {
      state.date = target.value;
      state.selectedSessionId = "";
      generateSlots({ preserve: false });
      clearErrorFor("data");
      clearErrorFor("sessao");
    }
    if (["nome", "email", "telemovel"].includes(target.name)) {
      clearErrorFor(target.name);
    }
  });

  document.querySelectorAll("[data-next]").forEach((button) => {
    button.addEventListener("click", () => {
      const errors = validateStep(state.step);
      if (errors.length) {
        showErrors(errors);
        return;
      }
      setStep(state.step + 1);
    });
  });

  document.querySelectorAll("[data-prev]").forEach((button) => {
    button.addEventListener("click", () => {
      setStep(Math.max(1, state.step - 1));
    });
  });

  document.addEventListener("click", (event) => {
    const edit = event.target.closest("[data-edit-step]");
    if (edit) {
      setStep(Number(edit.dataset.editStep));
    }
    if (event.target.closest("[data-clear-session-filter]")) {
      state.sessionFilter = "";
      state.trainerFilter = "";
      state.selectedSessionId = "";
      generateSlots({ preserve: false });
      clearErrorFor("sessao");
    }
    if (event.target.closest("[data-download-booking-ics]")) {
      downloadICS();
    }
    if (event.target.closest("[data-trial-restart]")) {
      resetForm();
    }
  });

  errorSummary?.addEventListener("click", (event) => {
    const link = event.target.closest("[data-error-link]");
    if (!link) return;
    event.preventDefault();
    const id = link.getAttribute("href").slice(1);
    const target =
      document.getElementById(id) ??
      form?.querySelector(`[name="${CSS.escape(id)}"]`);
    target?.focus();
  });
}

export function initTrial() {
  form = document.getElementById("trial-form");
  errorSummary = document.querySelector("[data-error-summary]");
  dateInput = form?.querySelector("[name='data']");
  slotsContainer = document.querySelector("[data-session-slots]");
  slotsError = form?.querySelector("[data-field-error='sessao']");
  sessionContext = document.querySelector("[data-session-context]");
  aulaFields = document.querySelector("[data-aula-fields]");
  visitaFields = document.querySelector("[data-visita-fields]");
  periodSelect = form?.querySelector("[name='periodo']");
  successPanel = document.getElementById("booking-success");
  submitButton = form?.querySelector("[data-submit-trial]");
  if (!form || !dateInput) return;

  applyQueryState();
  bindForm();
  setStep(1, { focus: false });
  document.documentElement.dataset.pageReady = "trial";
}
