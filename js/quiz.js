/* ==========================================================================
   Simulador de plano — quatro perguntas, resultado indicativo e sem pressão
   ========================================================================== */

import {
  classes,
  quizQuestions,
  schedule,
  plans,
  getClass,
  formatPrice,
} from "./data.js";
import { escapeHTML, icon, trackEvent } from "./ui.js";

const state = {
  index: 0,
  answers: {},
  complete: false,
};

let container;
let countLabel;
let progressBar;
let restartButton;
let backButton;
let nextButton;
let nav;
let quizRoot;

const ranges = {
  manha: (hour) => hour < 12,
  almoco: (hour) => hour >= 12 && hour < 15,
  tarde: (hour) => hour >= 15 && hour < 18,
  noite: (hour) => hour >= 18,
};

function hourOf(time) {
  return Number(time.split(":")[0]);
}

function announce(message) {
  const announcer = quizRoot?.querySelector("[data-quiz-announcer]");
  if (!announcer) return;
  announcer.textContent = "";
  window.setTimeout(() => {
    announcer.textContent = message;
  }, 30);
}

function updateProgress() {
  if (state.complete) {
    if (countLabel) countLabel.textContent = "Recomendação pronta";
    if (progressBar) progressBar.style.width = "100%";
    return;
  }
  if (countLabel) {
    countLabel.textContent = `${state.index + 1} de ${quizQuestions.length}`;
  }
  if (progressBar) {
    progressBar.style.width = `${((state.index + 1) / quizQuestions.length) * 100}%`;
  }
}

function updateNav() {
  if (!backButton || !nextButton) return;
  backButton.hidden = state.index === 0;
  const isLast = state.index === quizQuestions.length - 1;
  nextButton.innerHTML = `<span>${isLast ? "Ver recomendação" : "Continuar"}</span>${icon("arrow-right")}`;
  restartButton.hidden = Object.keys(state.answers).length === 0 && state.index === 0;
}

function renderQuestion({ focus = false } = {}) {
  if (!container) return;
  state.complete = false;
  const question = quizQuestions[state.index];
  const selected = state.answers[question.id];

  container.innerHTML = `
    <div class="quiz-step">
      <p class="eyebrow">Pergunta ${escapeHTML(question.number)}</p>
      <h3 class="quiz-step__title" tabindex="-1" data-quiz-question-title>${escapeHTML(question.title)}</h3>
      <p class="quiz-step__helper">${escapeHTML(question.helper)}</p>
      <fieldset class="quiz-options">
        <legend class="sr-only">${escapeHTML(question.title)}</legend>
        ${question.options
          .map(
            (option) => `
          <label class="quiz-option${selected === option.value ? " is-selected" : ""}">
            <input type="radio" name="quiz-${escapeHTML(question.id)}" value="${escapeHTML(option.value)}"${selected === option.value ? " checked" : ""}>
            <span class="quiz-option__mark" aria-hidden="true"></span>
            <span class="quiz-option__text">
              <span class="quiz-option__label">${escapeHTML(option.label)}</span>
              <span class="quiz-option__hint">${escapeHTML(option.hint)}</span>
            </span>
            ${icon("arrow-right")}
          </label>`,
          )
          .join("")}
      </fieldset>
      <p class="quiz-error" data-quiz-error role="alert"></p>
    </div>`;

  updateProgress();
  updateNav();

  if (focus) {
    container.querySelector("[data-quiz-question-title]")?.focus({ preventScroll: false });
  }
}

function recommendedPlan() {
  const { objetivo, preferencia, frequencia } = state.answers;
  if (
    objetivo === "mobilidade" ||
    (frequencia === "5+" && preferencia === "ambos")
  ) {
    return "pro";
  }
  if (
    preferencia === "sala" &&
    objetivo !== "iniciantes" &&
    frequencia !== "5+"
  ) {
    return "essencial";
  }
  return "clube";
}

function planCopy(planId) {
  if (planId === "essencial") {
    return "Queres treinar com autonomia na sala, com plano e acompanhamento na avaliação. O Essencial dá-te essa base sem pagar por aulas que não vais usar.";
  }
  if (planId === "pro") {
    return "Procuras treino próximo, tempo para recuperar e alguma flexibilidade na rotina. O Pro acrescenta acompanhamento e zona de recuperação ao plano Clube.";
  }
  return "Queres variar entre sala e aulas, sem decidir tudo sozinho. O Clube junta acesso completo à sala e às aulas de grupo, com prioridade na marcação.";
}

function suggestedClasses() {
  const { objetivo, horario } = state.answers;
  const periodTest = ranges[horario] ?? (() => true);
  const periodClassIds = new Set(
    schedule
      .filter((session) => periodTest(hourOf(session.start)))
      .map((session) => session.classId),
  );

  const scored = classes.map((item) => {
    let score = 0;
    if (objetivo && item.goals.includes(objetivo)) score += 4;
    if (periodClassIds.has(item.id)) score += 3;
    if (state.answers.preferencia === "aulas" || state.answers.preferencia === "ambos") {
      score += 1;
    }
    return { item, score };
  });

  return scored
    .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name, "pt"))
    .slice(0, 3)
    .map(({ item }) => item);
}

function nextSlotForClass(classId) {
  return schedule
    .filter((session) => session.classId === classId)
    .sort((a, b) => {
      const dayA = a.day === 0 ? 7 : a.day;
      const dayB = b.day === 0 ? 7 : b.day;
      return dayA - dayB || a.start.localeCompare(b.start);
    })[0];
}

function renderResult() {
  if (!container) return;
  state.complete = true;
  const planId = recommendedPlan();
  const planName = planId === "essencial" ? "Essencial" : planId === "pro" ? "Pro" : "Clube";
  const chosenPlan = plans.find((plan) => plan.id === planId) ?? plans[1];
  const chosenClasses = suggestedClasses();
  const periodLabel =
    {
      manha: "de manhã",
      almoco: "à hora de almoço",
      tarde: "à tarde",
      noite: "à noite",
    }[state.answers.horario] ?? "na tua rotina";

  container.innerHTML = `
    <div class="quiz-result">
      <p class="eyebrow quiz-result__eyebrow">Leitura das tuas respostas</p>
      <h3 tabindex="-1" data-quiz-result-title>O teu ponto de partida: <span>Plano ${planName}.</span></h3>
      <p class="quiz-result__copy">${escapeHTML(planCopy(planId))} As aulas em baixo são sugestões a partir das tuas respostas e do horário que escolheste ${escapeHTML(periodLabel)}. A equipa confirma tudo na avaliação inicial.</p>

      <div class="quiz-recommendation">
        <span class="quiz-recommendation__mark" aria-hidden="true">${icon("ticket")}</span>
        <div style="min-width: 0; flex: 1;">
          <strong>Plano ${planName}</strong>
          <span>${formatPrice(chosenPlan.monthly)}/mês, IVA incluído</span>
        </div>
        <a class="link-arrow" href="#plano-${planId}">Ver condições ${icon("arrow-right")}</a>
      </div>

      <div class="quiz-classes" role="group" aria-label="Aulas sugeridas">
        ${chosenClasses
          .map((item) => {
            const slot = nextSlotForClass(item.id);
            return `
            <a href="aula.html?id=${encodeURIComponent(item.id)}">
              <span>${escapeHTML(item.name)} <small>· ${escapeHTML(slot ? `${slot.duration} min · ${slot.level}` : item.tagline)}</small></span>
              ${icon("arrow-up-right")}
            </a>`;
          })
          .join("")}
      </div>

      <div class="quiz-result__actions">
        <a class="btn btn--solid btn--sm" href="experimenta.html?plano=${planId}&origem=quiz">
          <span>Marcar com o Plano ${planName}</span>
          ${icon("arrow-up-right")}
        </a>
        <a class="btn btn--sweep btn--sm" href="horario.html">
          <span>Ver horário completo</span>
          ${icon("calendar")}
        </a>
      </div>
      <p class="demo-note" style="margin-top: 1rem;">Sugestão gerada localmente. Não substitui uma avaliação nem constitui aconselhamento clínico.</p>
    </div>`;

  if (nav) nav.hidden = true;
  if (restartButton) restartButton.hidden = false;
  updateProgress();
  announce(`Recomendação pronta: plano ${planName}.`);
  container.querySelector("[data-quiz-result-title]")?.focus();
  trackEvent("quiz_complete", {
    recommended_plan: planId,
    objective: state.answers.objetivo,
    frequency: state.answers.frequencia,
  });
}

function handleNext() {
  const question = quizQuestions[state.index];
  const checked = container?.querySelector(`input[name="quiz-${question.id}"]:checked`);
  const error = container?.querySelector("[data-quiz-error]");

  if (!checked) {
    if (error) error.textContent = "Escolhe uma opção para continuares.";
    container?.querySelector("input")?.focus();
    return;
  }

  state.answers[question.id] = checked.value;
  restartButton.hidden = false;

  if (state.index === quizQuestions.length - 1) {
    renderResult();
    return;
  }

  state.index += 1;
  renderQuestion({ focus: true });
  announce(`Pergunta ${state.index + 1} de ${quizQuestions.length}.`);
}

function handleBack() {
  if (state.index === 0) return;
  state.index -= 1;
  renderQuestion({ focus: true });
  announce(`Pergunta ${state.index + 1} de ${quizQuestions.length}.`);
}

function restart() {
  state.index = 0;
  state.answers = {};
  state.complete = false;
  if (nav) nav.hidden = false;
  renderQuestion({ focus: true });
  announce("Simulador reiniciado.");
}

export function initQuiz() {
  container = document.getElementById("quiz-step-container");
  quizRoot = document.querySelector("[data-quiz-app]");
  countLabel = document.querySelector("[data-quiz-count]");
  progressBar = document.querySelector("[data-quiz-progress]");
  restartButton = document.querySelector("[data-quiz-restart]");
  backButton = document.querySelector("[data-quiz-back]");
  nextButton = document.querySelector("[data-quiz-next]");
  nav = document.querySelector("[data-quiz-nav]");
  if (!container || !nextButton) return;

  renderQuestion();
  nextButton.addEventListener("click", handleNext);
  backButton?.addEventListener("click", handleBack);
  restartButton?.addEventListener("click", restart);

  container.addEventListener("change", (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || input.type !== "radio") return;
    input.closest("fieldset")?.querySelectorAll(".quiz-option").forEach((option) => {
      option.classList.toggle("is-selected", Boolean(option.querySelector("input:checked")));
    });
    state.answers[quizQuestions[state.index].id] = input.value;
    const error = container.querySelector("[data-quiz-error]");
    if (error) error.textContent = "";
    restartButton.hidden = false;
    updateNav();
  });
}
