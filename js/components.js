/* ==========================================================================
   FORJA Training Club — componentes de conteúdo reutilizáveis
   ========================================================================== */

import { escapeHTML, icon } from "./ui.js";
import { formatDateShort, formatPrice, goalLabels } from "./data.js";

export function levelLabel(item) {
  if (!item.levels?.length) return "Todos os níveis";
  if (
    item.levels.includes("Todos os níveis") ||
    item.levels.length === 3
  ) {
    return "Todos os níveis";
  }
  if (item.levels.length > 1) return "Vários níveis";
  return item.levels[0];
}

export function classCard(item) {
  const goal = item.goals?.[0] ? goalLabels[item.goals[0]] : "Treino";
  return `
    <article class="class-card" data-reveal>
      <a class="class-card__link" href="aula.html?id=${encodeURIComponent(item.id)}">
        <figure class="class-card__media">
          <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.imageAlt)}" width="1000" height="750" loading="lazy">
          <span class="class-card__number" aria-hidden="true">${escapeHTML(item.number)}</span>
          <span class="tag class-card__level">${escapeHTML(levelLabel(item))}</span>
        </figure>
        <div class="class-card__body">
          <div class="class-card__meta">
            <span>${icon("clock")}${item.duration} min</span>
            <span>${icon("spark")}Intensidade ${item.intensity}/5</span>
          </div>
          <h3 class="class-card__title">${escapeHTML(item.name)}</h3>
          <p class="class-card__summary">${escapeHTML(item.summary)}</p>
          <div class="class-card__footer">
            <span class="class-card__goal">${escapeHTML(goal)}</span>
            <span class="class-card__arrow" aria-hidden="true">${icon("arrow-up-right")}</span>
          </div>
        </div>
      </a>
    </article>`;
}

export function trainerCard(trainer, { linked = false } = {}) {
  const tag = linked ? "a" : "button";
  const attrs = linked
    ? `href="treinadores.html#${encodeURIComponent(trainer.id)}"`
    : `type="button" data-trainer-open="${escapeHTML(trainer.id)}"`;
  return `
    <${tag} class="trainer-card" ${attrs} data-reveal>
      <span class="trainer-card__media">
        <img src="${escapeHTML(trainer.image)}" alt="${escapeHTML(trainer.imageAlt)}" width="800" height="1000" loading="lazy">
        <span class="trainer-card__number" aria-hidden="true">${escapeHTML(
          String(
            ["diogo", "marta", "bruno", "catarina", "tomas"].indexOf(
              trainer.id,
            ) + 1,
          ).padStart(2, "0"),
        )}</span>
      </span>
      <span class="trainer-card__body">
        <span class="trainer-card__role">${escapeHTML(trainer.role)}</span>
        <span class="trainer-card__name">${escapeHTML(trainer.name)}</span>
        <span class="trainer-card__specialties">${trainer.specialties.map(escapeHTML).join(" · ")}</span>
        <span class="trainer-card__action">
          <span>${linked ? "Ver perfil" : "Conhecer"}</span>
          ${icon("arrow-up-right")}
        </span>
      </span>
    </${tag}>`;
}

function priceParts(value) {
  const formatted = new Intl.NumberFormat("pt-PT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
  return formatted;
}

export function planCard(plan, { compact = false } = {}) {
  const classes = [
    "plan-card",
    plan.highlight ? "plan-card--featured" : "",
    compact ? "plan-card--compact" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const extraFeatures = plan.includes
    .map(
      (feature) => `
      <li>${icon("check")}<span>${escapeHTML(feature)}</span></li>`,
    )
    .join("");

  const missingFeatures = plan.notIncluded
    .map(
      (feature) => `
      <li class="is-absent">${icon("close")}<span>${escapeHTML(feature)}</span></li>`,
    )
    .join("");

  return `
    <article id="plano-${escapeHTML(plan.id)}" class="${classes}" data-plan-card="${escapeHTML(plan.id)}" data-reveal>
      ${plan.badge ? `<span class="plan-card__badge">${escapeHTML(plan.badge)}</span>` : ""}
      <div class="plan-card__head">
        <div class="plan-card__kicker">
          <span>FORJA / ${escapeHTML(plan.name)}</span>
          <span>IVA incluído</span>
        </div>
        <h3 class="plan-card__name">${escapeHTML(plan.name)}</h3>
        <p class="plan-card__tagline">${escapeHTML(plan.tagline)}</p>
        <div class="plan-card__price" aria-live="polite">
          <span class="plan-card__value" data-price-value>${priceParts(plan.monthly)}</span>
          <span class="plan-card__currency">€</span>
          <span class="plan-card__period" data-price-period>/mês</span>
        </div>
        <p class="plan-card__price-note" data-price-note>Sem fidelização · 30 dias de aviso para cancelar</p>
        <p class="plan-card__save" data-price-save hidden></p>
      </div>
      <a class="btn btn--${plan.highlight ? "sweep" : "ghost"} plan-card__cta" href="experimenta.html?plano=${encodeURIComponent(plan.id)}" data-track="select_plan" data-track-location="plan-card">
        <span>Escolher ${escapeHTML(plan.name)}</span>${icon("arrow-up-right")}
      </a>
      <ul class="plan-card__includes">
        ${extraFeatures}
        ${missingFeatures}
      </ul>
      ${compact ? "" : `<dl class="plan-card__terms">
        <div><dt>Inscrição</dt><dd>${escapeHTML(plan.enrollment)}</dd></div>
        <div><dt>Fidelização</dt><dd data-term-commitment>${escapeHTML(plan.commitment.monthly)}</dd></div>
        <div><dt>Cancelamento</dt><dd data-term-cancellation>${escapeHTML(plan.cancellation.monthly)}</dd></div>
      </dl>`}
    </article>`;
}

export function facilityTile(item) {
  return `
    <a class="facility-tile" href="instalacoes.html#${encodeURIComponent(item.id)}">
      <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.imageAlt)}" width="1200" height="900" loading="lazy">
      <span class="facility-tile__content">
        <span class="facility-tile__num">${escapeHTML(item.number)}</span>
        <h3>${escapeHTML(item.name)}</h3>
        <p>${item.area} m² · ${escapeHTML(item.summary)}</p>
      </span>
    </a>`;
}

export function faqItem(faq) {
  return `
    <details class="faq-item" data-faq-item>
      <summary>${escapeHTML(faq.question)}</summary>
      <div class="faq-item__answer">
        <p>${escapeHTML(faq.answer)}</p>
      </div>
    </details>`;
}

export function formatSlotDate(date) {
  return formatDateShort(date).replace(/^./, (letter) => letter.toUpperCase());
}

export function formattedMonthly(value) {
  return formatPrice(value);
}
