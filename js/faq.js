/* ==========================================================================
   Perguntas frequentes — pesquisa, filtro por tema e acordeão nativo
   ========================================================================== */

import { faqs, site } from "./data.js";
import { escapeHTML, icon, trackEvent } from "./ui.js";
import { faqItem } from "./components.js";

const state = {
  query: "",
  category: "all",
};

function normalize(value = "") {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function categorySlug(category) {
  return normalize(category).replace(/\s+/g, "-");
}

function categories() {
  return [...new Set(faqs.map((item) => item.category))];
}

function filteredFaqs() {
  const query = normalize(state.query);
  return faqs.filter((item) => {
    const inCategory = state.category === "all" || categorySlug(item.category) === state.category;
    if (!inCategory) return false;
    if (!query) return true;
    return normalize(`${item.question} ${item.answer} ${item.category}`).includes(query);
  });
}

function updateUrl() {
  const params = new URLSearchParams();
  if (state.query) params.set("q", state.query);
  if (state.category !== "all") params.set("categoria", state.category);
  const suffix = params.toString() ? `?${params.toString()}` : window.location.pathname;
  try {
    window.history.replaceState(null, "", suffix);
  } catch {
    /* Histórico indisponível. */
  }
}

function renderCategories() {
  const container = document.getElementById("faq-categories");
  if (!container) return;
  const all = [
    `<button class="chip" type="button" data-faq-category="all" aria-pressed="${state.category === "all"}">Todas <span aria-hidden="true">(${faqs.length})</span></button>`,
  ];
  categories().forEach((category) => {
    const count = faqs.filter((item) => item.category === category).length;
    all.push(
      `<button class="chip" type="button" data-faq-category="${categorySlug(category)}" aria-pressed="${state.category === categorySlug(category)}">${escapeHTML(category)} <span aria-hidden="true">(${count})</span></button>`,
    );
  });
  container.innerHTML = all.join("");
}

function renderResults({ track = false, focusCategory = null } = {}) {
  const list = document.getElementById("faq-list");
  const count = document.querySelector("[data-faq-count]");
  const empty = document.getElementById("faq-empty");
  if (!list) return;

  const results = filteredFaqs();
  list.innerHTML = results.map(faqItem).join("");
  if (empty) empty.hidden = results.length > 0;
  if (count) {
    const filtered = state.query || state.category !== "all";
    count.textContent = filtered
      ? `${results.length} de ${faqs.length} perguntas`
      : `${faqs.length} perguntas e respostas`;
  }
  renderCategories();
  updateUrl();
  if (focusCategory) {
    document.querySelector(`[data-faq-category="${focusCategory}"]`)?.focus({ preventScroll: true });
  }
  if (track) {
    trackEvent("faq_filter", {
      query: state.query,
      category: state.category,
      results: results.length,
    });
  }
}

function bind() {
  const search = document.getElementById("faq-search");
  search?.addEventListener("input", () => {
    state.query = search.value.trim();
    renderResults();
  });

  document.addEventListener("click", (event) => {
    const category = event.target.closest("[data-faq-category]");
    if (category) {
      state.category = category.dataset.faqCategory;
      renderResults({ track: true, focusCategory: state.category });
    }
    if (event.target.closest("[data-faq-clear]")) {
      state.query = "";
      state.category = "all";
      if (search) search.value = "";
      renderResults({ track: true });
      search?.focus();
    }
  });

  document.addEventListener("toggle", (event) => {
    const item = event.target;
    if (!(item instanceof HTMLDetailsElement) || !item.open) return;
    trackEvent("faq_open", {
      question: item.querySelector("summary")?.textContent ?? "",
    });
  }, true);
}

export function initFaq() {
  const params = new URLSearchParams(window.location.search);
  state.query = params.get("q")?.trim() ?? "";
  const requestedCategory = params.get("categoria");
  state.category = requestedCategory && categories().some((cat) => categorySlug(cat) === requestedCategory)
    ? requestedCategory
    : "all";

  const search = document.getElementById("faq-search");
  if (search) search.value = state.query;
  renderResults();
  bind();
  trackEvent("faq_view", { count: faqs.length });
  document.documentElement.dataset.pageReady = "faq";
}
