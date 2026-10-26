/* ==========================================================================
   Aulas — listagem com filtros e página de detalhe por modalidade
   ========================================================================== */

import {
  classes,
  dayNamesShort,
  formatDateLong,
  goalLabels,
  getNextSessionDate,
  getTrainer,
  levels,
  schedule,
  toISODate,
} from "./data.js";
import { escapeHTML, icon, trackEvent } from "./ui.js";
import { classCard, levelLabel } from "./components.js";

const listState = {
  query: "",
  goal: "",
  level: "",
};

function normalize(value = "") {
  return value
    .toString()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

function refreshMotion() {
  window.dispatchEvent(new Event("forja:refresh-motion"));
}

function updateListUrl() {
  const params = new URLSearchParams();
  if (listState.query) params.set("q", listState.query);
  if (listState.goal) params.set("objetivo", listState.goal);
  if (listState.level) params.set("nivel", listState.level);
  const query = params.toString();
  window.history.replaceState(null, "", `aulas.html${query ? `?${query}` : ""}`);
}

function filteredClasses() {
  return classes.filter((item) => {
    if (listState.goal && !item.goals.includes(listState.goal)) return false;
    if (
      listState.level &&
      !item.levels.includes(listState.level) &&
      !item.levels.includes("Todos os níveis")
    ) {
      return false;
    }
    if (listState.query) {
      const trainerNames = item.trainers
        .map((id) => getTrainer(id)?.name ?? "")
        .join(" ");
      const haystack = normalize(
        [
          item.name,
          item.tagline,
          item.summary,
          ...item.goals.map((goal) => goalLabels[goal] ?? goal),
          trainerNames,
        ]
          .filter(Boolean)
          .join(" "),
      );
      if (!haystack.includes(normalize(listState.query))) return false;
    }
    return true;
  });
}

function intensityMarkup(value) {
  return `
    <span class="intensity" role="img" aria-label="Intensidade ${value} de 5">
      ${[1, 2, 3, 4, 5]
        .map((step) => `<span class="intensity__bar${step <= value ? " is-on" : ""}"></span>`)
        .join("")}
    </span>`;
}

function renderList() {
  const grid = document.getElementById("classes-grid");
  const count = document.querySelector("[data-classes-count]");
  const reset = document.querySelector("[data-classes-reset]");
  const chips = [...document.querySelectorAll("[data-goal-filter]")];
  const levelSelect = document.querySelector("[name='levels']");
  const search = document.querySelector("[name='class-search']");
  if (!grid) return;

  const matches = filteredClasses();
  if (count) {
    count.textContent = `${matches.length} de ${classes.length} aulas${listState.goal ? ` · ${goalLabels[listState.goal]}` : ""}`;
  }
  if (reset) {
    reset.disabled = !listState.query && !listState.goal && !listState.level;
  }
  chips.forEach((chip) => {
    chip.setAttribute("aria-pressed", String(chip.dataset.goalFilter === (listState.goal || "all")));
  });
  if (levelSelect && levelSelect.value !== listState.level) {
    levelSelect.value = listState.level;
  }
  if (search && search.value !== listState.query) {
    search.value = listState.query;
  }

  if (!matches.length) {
    grid.innerHTML = `
      <div class="class-empty">
        <h2>Sem aula para esta combinação.</h2>
        <p>Tenta outro objetivo, nível ou palavra. Ou limpa tudo e vê as nove modalidades.</p>
        <button class="btn btn--sweep" type="button" data-classes-reset>Limpar filtros ${icon("close")}</button>
      </div>`;
    updateListUrl();
    return;
  }

  grid.innerHTML = matches.map(classCard).join("");
  updateListUrl();
  refreshMotion();
}

function resetList() {
  listState.query = "";
  listState.goal = "";
  listState.level = "";
  const search = document.querySelector("[name='class-search']");
  if (search) search.value = "";
  const level = document.querySelector("[name='levels']");
  if (level) level.value = "";
  renderList();
  trackEvent("classes_filter", { reset: true });
}

function bindList() {
  const search = document.querySelector("[name='class-search']");
  const level = document.querySelector("[name='levels']");
  let timer;

  const params = new URLSearchParams(window.location.search);
  listState.query = params.get("q") ?? "";
  listState.goal = params.get("objetivo") ?? "";
  listState.level = params.get("nivel") ?? "";
  if (!Object.hasOwn(goalLabels, listState.goal)) listState.goal = "";
  if (!levels.includes(listState.level)) listState.level = "";

  search?.addEventListener("input", () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      listState.query = search.value.trim();
      renderList();
    }, 130);
  });

  level?.addEventListener("change", () => {
    listState.level = level.value;
    renderList();
    trackEvent("classes_filter", { type: "level", value: listState.level });
  });

  document.querySelectorAll("[data-goal-filter]").forEach((chip) => {
    chip.addEventListener("click", () => {
      listState.goal = chip.dataset.goalFilter === "all" ? "" : chip.dataset.goalFilter;
      renderList();
      trackEvent("classes_filter", { type: "goal", value: listState.goal });
    });
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-classes-reset]")) {
      resetList();
    }
  });

  window.addEventListener("popstate", () => {
    const next = new URLSearchParams(window.location.search);
    listState.query = next.get("q") ?? "";
    listState.goal = next.get("objetivo") ?? "";
    listState.level = next.get("nivel") ?? "";
    renderList();
  });
}

export function initClasses() {
  bindList();
  renderList();
  document.documentElement.dataset.pageReady = "classes";
}

/* --------------------------------------------------------------------------
   Detalhe de uma aula
   -------------------------------------------------------------------------- */
function upcomingSessions(classId, count = 4) {
  const now = new Date();
  return schedule
    .filter((session) => session.classId === classId)
    .map((session) => ({ session, date: getNextSessionDate(session, now) }))
    .filter(({ date }) => date instanceof Date)
    .sort((a, b) => a.date - b.date || a.session.start.localeCompare(b.session.start))
    .slice(0, count);
}

function trainerListMarkup(item) {
  return item.trainers
    .map((trainerId) => {
      const trainer = getTrainer(trainerId);
      if (!trainer) return "";
      return `
        <a class="class-trainer" href="treinadores.html#${encodeURIComponent(trainer.id)}">
          <img src="${escapeHTML(trainer.image)}" alt="" width="48" height="48" loading="lazy">
          ${escapeHTML(trainer.name)}
        </a>`;
    })
    .join("");
}

function nextSessionsMarkup(item) {
  const slots = upcomingSessions(item.id);
  if (!slots.length) {
    return `<p class="muted">Sem sessões agendadas para esta modalidade. Consulta o <a href="horario.html" style="text-decoration:underline;">horário completo</a>.</p>`;
  }
  return `
    <div class="next-sessions">
      ${slots
        .map(({ session, date }) => {
          const day = dayNamesShort[date.getDay()];
          const dayNumber = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          return `
            <a class="next-session" href="experimenta.html?sessao=${encodeURIComponent(session.id)}&data=${toISODate(date)}">
              <span class="next-session__date">${escapeHTML(day)}<br>${dayNumber}/${month}</span>
              <span class="next-session__main">
                <strong>${escapeHTML(session.start)} · ${session.duration} min</strong>
                <span>${escapeHTML(session.trainerName)}</span>
              </span>
              ${icon("arrow-right")}
            </a>`;
        })
        .join("")}
    </div>`;
}

function setMeta(item) {
  document.title = `${item.name} — Aula | FORJA Training Club Braga`;
  const description = `${item.summary} ${item.duration} minutos. ${levelLabel(item)}. Consulta horários e marca uma aula experimental na FORJA, em Braga.`;
  document.querySelector('meta[name="description"]')?.setAttribute("content", description);
  document.querySelector('meta[property="og:title"]')?.setAttribute("content", `${item.name} — FORJA Training Club`);
  document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
  const canonical = `https://forja.pt/aula.html?id=${encodeURIComponent(item.id)}`;
  document.querySelector('link[rel="canonical"]')?.setAttribute("href", canonical);
  document.querySelector('meta[property="og:url"]')?.setAttribute("content", canonical);
}

function renderNotFound() {
  const root = document.getElementById("class-detail");
  if (!root) return;
  document.title = "Aula fora de rota | FORJA Training Club";
  document.querySelector('meta[name="robots"]')?.setAttribute("content", "noindex, follow");
  root.innerHTML = `
    <section class="section section--light">
      <div class="container container--narrow">
        <p class="eyebrow">Aula fora de rota</p>
        <h1 class="display-lg" style="margin-top: 1rem;">Não encontrámos esta aula.</h1>
        <p class="lead" style="margin-top: 1rem;">O endereço pode estar incompleto ou a modalidade pode ter mudado de nome. O horário continua a ter nove pontos de partida.</p>
        <div style="display:flex; flex-wrap:wrap; gap:.6rem; margin-top:1.6rem;">
          <a class="btn btn--solid" href="aulas.html">Ver as nove aulas ${icon("arrow-right")}</a>
          <a class="btn btn--sweep" href="horario.html">Consultar horário ${icon("calendar")}</a>
        </div>
      </div>
    </section>`;
}

function relatedClasses(item) {
  return classes
    .filter((candidate) => candidate.id !== item.id)
    .map((candidate) => ({
      candidate,
      score: candidate.goals.filter((goal) => item.goals.includes(goal)).length,
    }))
    .sort((a, b) => b.score - a.score || Number(a.candidate.number) - Number(b.candidate.number))
    .slice(0, 3)
    .map(({ candidate }) => candidate);
}

function renderDetail(item) {
  const root = document.getElementById("class-detail");
  if (!root) return;
  setMeta(item);
  const trainer = getTrainer(item.trainers[0]);
  const related = relatedClasses(item);

  root.innerHTML = `
    <section class="detail-hero" aria-labelledby="class-title">
      <div class="container">
        <nav class="breadcrumbs" aria-label="Localização">
          <a href="index.html">Início</a>
          ${icon("chevron-right")}
          <a href="aulas.html">Aulas</a>
          ${icon("chevron-right")}
          <span class="breadcrumbs__current" aria-current="page">${escapeHTML(item.name)}</span>
        </nav>
        <div class="detail-hero__grid">
          <div class="detail-hero__content">
            <p class="eyebrow">Aula ${escapeHTML(item.number)} · ${item.duration} minutos</p>
            <h1 class="display-xl detail-hero__title" id="class-title">${escapeHTML(item.name)}</h1>
            <p class="detail-hero__summary">${escapeHTML(item.summary)}</p>
            <div class="tag-row detail-hero__tags">
              ${item.levels.map((level) => `<span class="tag">${escapeHTML(level)}</span>`).join("")}
              ${item.goals
                .slice(0, 2)
                .map((goal) => `<span class="tag tag--accent">${escapeHTML(goalLabels[goal])}</span>`)
                .join("")}
            </div>
            <div class="detail-hero__actions">
              <a class="btn btn--solid" href="experimenta.html?aula=${encodeURIComponent(item.id)}" data-track="cta_trial" data-track-location="class_detail">
                <span>Experimentar ${escapeHTML(item.name.split(" ")[0].toLowerCase())}</span>
                ${icon("arrow-up-right")}
              </a>
              <a class="btn btn--sweep" href="horario.html?modalidade=${encodeURIComponent(item.id)}&vista=semana">
                <span>Ver horário</span>
                ${icon("calendar")}
              </a>
            </div>
          </div>
          <figure class="detail-hero__media">
            <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.imageAlt)}" width="1200" height="900">
            <figcaption class="detail-card">
              <span>Intensidade</span>
              <strong>${intensityMarkup(item.intensity)} ${item.intensity}/5</strong>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>

    <div class="detail-facts container" role="group" aria-label="Resumo da aula">
      <div class="detail-fact">
        <span>Duração</span>
        <strong>${item.duration} min</strong>
      </div>
      <div class="detail-fact">
        <span>Intensidade</span>
        <strong>${item.intensity} de 5</strong>
      </div>
      <div class="detail-fact">
        <span>Nível</span>
        <strong>${escapeHTML(levelLabel(item))}</strong>
      </div>
      <div class="detail-fact">
        <span>Treinador</span>
        <strong>${escapeHTML(trainer?.name ?? "Equipa FORJA")}</strong>
      </div>
    </div>

    <section class="section section--light" aria-labelledby="class-about">
      <div class="container">
        <div class="class-body">
          <article class="class-body__content">
            <h2 id="class-about">Sobre esta aula</h2>
            ${item.description.map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`).join("")}

            <h2>O que esperar</h2>
            <ul>
              ${item.whatToExpect.map((bullet) => `<li>${escapeHTML(bullet)}</li>`).join("")}
            </ul>

            <div class="for-who-grid">
              <div class="for-who-card">
                <h3>${icon("check")} Para quem é</h3>
                <ul>${item.forWho.map((line) => `<li>${escapeHTML(line)}</li>`).join("")}</ul>
              </div>
              <div class="for-who-card for-who-card--not">
                <h3>${icon("info")} Para quem pode não ser</h3>
                <ul>${item.notFor.map((line) => `<li>${escapeHTML(line)}</li>`).join("")}</ul>
              </div>
            </div>

            <h2>O que trazer</h2>
            <ul>
              ${item.bring.map((thing) => `<li>${escapeHTML(thing)}</li>`).join("")}
            </ul>
            <p class="demo-note">Imagem ilustrativa. Na primeira visita há material de empréstimo disponível.</p>
          </article>

          <aside class="class-aside" aria-label="Próximas sessões">
            <div class="class-aside__head">
              <h2>Próximas sessões</h2>
              <p>Reserva diretamente uma experiência nesta aula.</p>
            </div>
            <div class="class-aside__body">
              ${nextSessionsMarkup(item)}
              <a class="btn btn--solid btn--wide" href="experimenta.html?aula=${encodeURIComponent(item.id)}" style="margin-top: 1rem;" data-track="cta_trial" data-track-location="class_aside">
                <span>Marcar experiência</span>
                ${icon("arrow-up-right")}
              </a>
              <p class="muted" style="margin-top: .8rem; font-size: .67rem; line-height: 1.5;">Sem taxa e sem compromisso. A equipa confirma o horário contigo.</p>
              <div class="class-trainers" role="group" aria-label="Treinadores da aula">
                ${trainerListMarkup(item)}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <section class="section section--dark" aria-labelledby="related-title">
      <div class="container">
        <div class="section-head">
          <div class="section-head__main">
            <p class="section-index"><strong>+</strong> / Também na FORJA</p>
            <h2 class="display-lg section-head__title" id="related-title">Outras formas de puxar por ti.</h2>
          </div>
          <div class="section-head__side">
            <p>Se esta não for a tua praia, há mais oito. Podes experimentar uma aula diferente sem mudar de plano.</p>
            <a class="link-arrow" href="aulas.html">Ver todas as aulas ${icon("arrow-right")}</a>
          </div>
        </div>
        <div class="class-grid">
          ${related.map(classCard).join("")}
        </div>
      </div>
    </section>

    <section class="section section--light cta-final" aria-labelledby="class-cta-title">
      <div class="container">
        <div class="cta-final__grid">
          <h2 class="display-xxl cta-final__title" id="class-cta-title">Traz o corpo. <span class="text-outline">Nós trazemos o plano.</span></h2>
          <div class="cta-final__side">
            <p>A primeira aula é gratuita. Aparece com roupa confortável e água. O resto é connosco.</p>
            <a class="btn btn--solid btn--wide" href="experimenta.html" data-track="cta_trial" data-track-location="class_final">
              <span>Marcar aula grátis</span>
              ${icon("arrow-up-right")}
            </a>
          </div>
        </div>
      </div>
    </section>`;

  trackEvent("class_detail_view", { class: item.id });
}

export function initClassDetail() {
  const root = document.getElementById("class-detail");
  if (!root) return;
  const id = new URLSearchParams(window.location.search).get("id");
  const item = classes.find((candidate) => candidate.id === id);
  if (!item) {
    renderNotFound();
    document.documentElement.dataset.pageReady = "class-not-found";
    return;
  }
  renderDetail(item);
  document.documentElement.dataset.pageReady = "class-detail";
}
