/* ==========================================================================
   Planos — preços, comparação, condições e periodicidade
   ========================================================================== */

import {
  comparisonRows,
  extras,
  formatPrice,
  plans,
} from "./data.js";
import { escapeHTML, icon, trackEvent } from "./ui.js";
import { planCard } from "./components.js";

const state = {
  billing: new URLSearchParams(window.location.search).get("periodo") === "anual"
    ? "annual"
    : "monthly",
};

const monthlyNumber = new Intl.NumberFormat("pt-PT", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatNumber(value) {
  return monthlyNumber.format(value);
}

function priceLabel(plan, billing = state.billing) {
  return billing === "annual"
    ? `${formatNumber(plan.annual)} €/mês`
    : `${formatNumber(plan.monthly)} €/mês`;
}

function updateUrl() {
  const next = new URLSearchParams(window.location.search);
  if (state.billing === "annual") next.set("periodo", "anual");
  else next.delete("periodo");
  const query = next.toString();
  window.history.replaceState(null, "", `planos.html${query ? `?${query}` : ""}`);
}

function updateCards() {
  document.querySelectorAll("[data-plan-card]").forEach((card) => {
    const plan = plans.find((item) => item.id === card.dataset.planCard);
    if (!plan) return;
    const isAnnual = state.billing === "annual";
    const value = card.querySelector("[data-price-value]");
    const period = card.querySelector("[data-price-period]");
    const note = card.querySelector("[data-price-note]");
    const saving = card.querySelector("[data-price-save]");
    const commitment = card.querySelector("[data-term-commitment]");
    const cancellation = card.querySelector("[data-term-cancellation]");
    const cta = card.querySelector(".plan-card__cta");

    if (value) value.textContent = formatNumber(isAnnual ? plan.annual : plan.monthly);
    if (period) period.textContent = isAnnual ? "/mês · 12 meses" : "/mês";
    if (note) {
      note.textContent = isAnnual
        ? `Faturado mensalmente · total de ${formatPrice(plan.annual * 12)}/ano`
        : "Sem fidelização · 30 dias de aviso para cancelar";
    }
    if (saving) {
      const saved = (plan.monthly - plan.annual) * 12;
      saving.hidden = !isAnnual;
      saving.textContent = isAnnual ? `Poupa ${formatPrice(saved)} por ano` : "";
    }
    if (commitment) {
      commitment.textContent = isAnnual
        ? plan.commitment.annual
        : plan.commitment.monthly;
    }
    if (cancellation) {
      cancellation.textContent = isAnnual
        ? plan.cancellation.annual
        : plan.cancellation.monthly;
    }
    if (cta) {
      const href = new URL(cta.getAttribute("href"), window.location.href);
      if (isAnnual) href.searchParams.set("periodo", "anual");
      else href.searchParams.delete("periodo");
      cta.setAttribute("href", `experimenta.html${href.search}`);
    }
  });
}

function updateSwitches() {
  document.querySelectorAll("[data-billing]").forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.billing === state.billing),
    );
  });
  const note = document.querySelector("[data-billing-note]");
  if (note) {
    note.innerHTML =
      state.billing === "annual"
        ? "<strong>Anual:</strong> preço mensal mais baixo, com 12 meses de permanência. O valor é faturado mês a mês."
        : "<strong>Mensal:</strong> sem fidelização, com 30 dias de aviso prévio para cancelar.";
  }
}

function renderPlans() {
  const container = document.getElementById("plans-grid");
  if (!container) return;
  container.innerHTML = plans.map((plan) => planCard(plan)).join("");
}

function renderComparison() {
  const container = document.getElementById("comparison-table");
  if (!container) return;
  const isAnnual = state.billing === "annual";
  const rows = [
    {
      label: "Mensalidade",
      values: plans.map((plan) => priceLabel(plan)),
    },
    {
      label: "Fidelização",
      values: plans.map((plan) =>
        isAnnual ? "12 meses" : "Sem fidelização",
      ),
    },
    ...comparisonRows,
  ];

  const cell = (value) => {
    if (value === true) {
      return `<span class="cell-center">${icon("check")}<span class="sr-only">Incluído</span></span>`;
    }
    if (value === false) {
      return `<span class="cell-muted"><span aria-hidden="true">—</span><span class="sr-only">Não incluído</span></span>`;
    }
    return escapeHTML(String(value));
  };

  container.innerHTML = `
    <table class="comparison-table" aria-label="Comparação dos planos FORJA">
      <caption>Comparação detalhada dos três planos da FORJA Training Club.</caption>
      <thead>
        <tr>
          <th scope="col">O que está incluído</th>
          ${plans
            .map(
              (plan) =>
                `<th scope="col" class="${plan.highlight ? "is-recommended" : ""}">${escapeHTML(plan.name)}</th>`,
            )
            .join("")}
        </tr>
      </thead>
      <tbody>
        ${rows
          .map(
            (row) => `
            <tr>
              <th scope="row">${escapeHTML(row.label)}</th>
              ${row.values
                .map((value) => `<td>${cell(value)}</td>`)
                .join("")}
            </tr>`,
          )
          .join("")}
      </tbody>
    </table>`;
}

function renderPolicies() {
  const container = document.getElementById("plan-policies");
  if (!container) return;
  const base = plans[0];
  const annualTotal = base.annual * 12;
  const annualClubTotal = plans[1].annual * 12;
  const annualProTotal = plans[2].annual * 12;
  container.innerHTML = `
    <article class="transparency-card">
      <h3>Inscrição</h3>
      <dl class="terms-list">
        <div>
          <dt>Valor único</dt>
          <dd>25 € de taxa de inscrição, atualmente oferecida na campanha de adesão.</dd>
        </div>
        <div>
          <dt>O que inclui</dt>
          <dd>Avaliação inicial, plano de treino e acesso à aplicação de horário e reservas.</dd>
        </div>
        <div>
          <dt>Pagamento</dt>
          <dd>Débito direto ou cartão. A primeira mensalidade é cobrada na data de adesão.</dd>
        </div>
      </dl>
    </article>
    <article class="transparency-card">
      <h3>Mensal ou anual</h3>
      <dl class="terms-list">
        <div>
          <dt>Mensal</dt>
          <dd>Sem fidelização. Cancelas com 30 dias de aviso prévio.</dd>
        </div>
        <div>
          <dt>Anual</dt>
          <dd>12 meses de permanência. Mensalidade reduzida: Essencial ${formatPrice(base.annual)} (${formatPrice(annualTotal)}/ano); Clube ${formatPrice(plans[1].annual)} (${formatPrice(annualClubTotal)}/ano); Pro ${formatPrice(plans[2].annual)} (${formatPrice(annualProTotal)}/ano).</dd>
        </div>
        <div>
          <dt>Reajustes</dt>
          <dd>Qualquer alteração de preço é comunicada com 30 dias de antecedência.</dd>
        </div>
      </dl>
    </article>
    <article class="transparency-card">
      <h3>Cancelar ou suspender</h3>
      <dl class="terms-list">
        <div>
          <dt>Cancelamento</dt>
          <dd>${escapeHTML(base.cancellation.monthly)} No plano anual, a saída antecipada implica 30% das mensalidades restantes.</dd>
        </div>
        <div>
          <dt>Suspensão</dt>
          <dd>${escapeHTML(base.suspension)}</dd>
        </div>
        <div>
          <dt>Dados</dt>
          <dd>O tratamento de dados segue a <a href="privacidade.html">política de privacidade</a>.</dd>
        </div>
      </dl>
    </article>`;
}

function renderExtras() {
  const container = document.getElementById("extras-grid");
  if (!container) return;
  container.innerHTML = extras
    .map(
      (item) => `
      <article class="extra-card" data-reveal>
        <p class="extra-card__category">${escapeHTML(item.category)}</p>
        <h3 class="extra-card__name">${escapeHTML(item.name)}</h3>
        <p class="extra-card__price">${escapeHTML(item.price)}</p>
        <p class="extra-card__detail">${escapeHTML(item.detail)}</p>
      </article>`,
    )
    .join("");
}

function bindBilling() {
  document.querySelectorAll("[data-billing]").forEach((button) => {
    button.addEventListener("click", () => {
      state.billing = button.dataset.billing === "annual" ? "annual" : "monthly";
      updateSwitches();
      updateCards();
      renderComparison();
      updateUrl();
      trackEvent("billing_toggle", { period: state.billing });
    });
  });

  document.querySelector("[data-print-plans]")?.addEventListener("click", () => {
    trackEvent("plans_print");
    window.print();
  });
}

export function initPlans() {
  renderPlans();
  renderComparison();
  renderPolicies();
  renderExtras();
  bindBilling();
  updateSwitches();
  updateCards();
  updateUrl();
  document.documentElement.dataset.pageReady = "plans";
}
