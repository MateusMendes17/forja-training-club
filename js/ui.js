/* ==========================================================================
   FORJA Training Club — interface partilhada
   Cabeçalho, rodapé, navegação mobile, cookies, movimento e utilidades.
   ========================================================================== */

import { site, openingHours, getOpenStatus } from "./data.js";

const STORAGE_CONSENT = "forja-cookie-consent";
const STORAGE_NEWSLETTER = "forja-newsletter";

const navItems = [
  { label: "Horário", href: "horario.html", page: "schedule" },
  { label: "Aulas", href: "aulas.html", page: "classes", also: ["aula"] },
  { label: "Planos", href: "planos.html", page: "plans" },
  { label: "Treinadores", href: "treinadores.html", page: "trainers" },
  { label: "Instalações", href: "instalacoes.html", page: "facilities" },
  { label: "Sobre", href: "sobre.html", page: "about" },
  { label: "Contactos", href: "contactos.html", page: "contact" },
];

export const icon = (name, className = "") =>
  `<svg class="icon ${className}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><use href="#i-${name}"></use></svg>`;

export const escapeHTML = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const svgSprite = `
<svg class="svg-sprite" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <symbol id="i-arrow-right" viewBox="0 0 24 24"><path d="M3 12h17M14 5l7 7-7 7"/></symbol>
  <symbol id="i-arrow-up-right" viewBox="0 0 24 24"><path d="M6 18 18 6M8 6h10v10"/></symbol>
  <symbol id="i-arrow-left" viewBox="0 0 24 24"><path d="M21 12H4m7-7-7 7 7 7"/></symbol>
  <symbol id="i-arrow-up" viewBox="0 0 24 24"><path d="M12 21V4m-7 7 7-7 7 7"/></symbol>
  <symbol id="i-chevron-left" viewBox="0 0 24 24"><path d="m15 5-7 7 7 7"/></symbol>
  <symbol id="i-chevron-right" viewBox="0 0 24 24"><path d="m9 5 7 7-7 7"/></symbol>
  <symbol id="i-chevron-down" viewBox="0 0 24 24"><path d="m5 9 7 7 7-7"/></symbol>
  <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.5 2"/></symbol>
  <symbol id="i-pin" viewBox="0 0 24 24"><path d="M20 10c0 5.2-8 11-8 11S4 15.2 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></symbol>
  <symbol id="i-phone" viewBox="0 0 24 24"><path d="M7.2 3.5 4.4 5.3c-.9.6-1.3 1.7-1 2.8 2 7.4 5.9 11.3 13.5 13.4 1.1.3 2.2-.1 2.8-1l1.8-2.8-5-3-1.9 2c-2.8-1.2-4.8-3.2-6-6l2-1.9-3.4-5.3Z"/></symbol>
  <symbol id="i-mail" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="1"/><path d="m4 6.5 8 6 8-6"/></symbol>
  <symbol id="i-instagram" viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17" rx="4"/><circle cx="12" cy="12" r="4"/><path d="M17.7 6.4h.01"/></symbol>
  <symbol id="i-whatsapp" viewBox="0 0 24 24"><path d="M20.4 11.7a8.3 8.3 0 0 1-12.3 7.3L4 20l1.1-3.9a8.3 8.3 0 1 1 15.3-4.4Z"/><path d="M9 8.1c.4-.1.7 0 .9.4l.7 1.4c.1.2.1.5-.1.7l-.6.7c.6 1.1 1.5 2 2.7 2.6l.7-.7c.2-.2.5-.2.7-.1l1.5.7c.3.2.5.5.4.9-.1 1.2-1.1 2-2.3 1.8-3.7-.5-6.6-3.4-7.1-7-.2-1.2.6-2.2 1.8-2.3Z"/></symbol>
  <symbol id="i-check" viewBox="0 0 24 24"><path d="m4 12.5 5 5L20 6.5"/></symbol>
  <symbol id="i-close" viewBox="0 0 24 24"><path d="m5 5 14 14M19 5 5 19"/></symbol>
  <symbol id="i-menu" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"/></symbol>
  <symbol id="i-calendar" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="1"/><path d="M3 10h18M8 3v4m8-4v4"/></symbol>
  <symbol id="i-download" viewBox="0 0 24 24"><path d="M12 3v12m-5-5 5 5 5-5M4 20h16"/></symbol>
  <symbol id="i-print" viewBox="0 0 24 24"><path d="M7 9V3h10v6M7 18H4V9h16v9h-3M7 14h10v7H7z"/></symbol>
  <symbol id="i-users" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M3.5 20v-2a5.5 5.5 0 0 1 11 0v2M16 5.1a3.5 3.5 0 0 1 0 6.8M17 14.1a5.5 5.5 0 0 1 4 5.3v.6"/></symbol>
  <symbol id="i-spark" viewBox="0 0 24 24"><path d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Z"/><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z"/></symbol>
  <symbol id="i-lock" viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="11" rx="1"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></symbol>
  <symbol id="i-info" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10h.01"/></symbol>
  <symbol id="i-search" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></symbol>
  <symbol id="i-ticket" viewBox="0 0 24 24"><path d="M3 7h18v4a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4V7Z"/><path d="M14 7v10"/></symbol>
  <symbol id="i-grid" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></symbol>
  <symbol id="i-list" viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></symbol>
  <symbol id="i-sliders" viewBox="0 0 24 24"><path d="M4 6h9m4 0h3M4 12h3m4 0h9M4 18h9m4 0h3"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="15" cy="18" r="2"/></symbol>
</svg>`;

function brandMarkup(extraClass = "") {
  return `
    <a class="brand ${extraClass}" href="index.html">
      <span class="brand__mark" aria-hidden="true">
        <svg viewBox="0 0 40 40" focusable="false">
          <rect x="1" y="1" width="38" height="38" fill="none" stroke="currentColor" stroke-width="1.5"/>
          <path d="M11 30V10h18M11 20h13" fill="none" stroke="currentColor" stroke-width="3"/>
          <rect x="27" y="7" width="6" height="6" fill="currentColor"/>
        </svg>
      </span>
      <span class="brand__name">FORJA<small>Training Club</small></span>
    </a>`;
}

function statusMarkup() {
  return `
    <div class="open-status" data-open-status>
      <span class="open-status__dot" aria-hidden="true"></span>
      <span class="open-status__label" data-status-label>Aberto agora</span>
      <span class="open-status__detail" data-status-detail>Fecha às 22h30</span>
    </div>`;
}

function navMarkup() {
  return navItems
    .map(
      (item) => `<a href="${item.href}" data-nav="${item.page}">${item.label}</a>`,
    )
    .join("");
}

function headerMarkup() {
  return `
    <div class="container header__inner">
      ${brandMarkup()}
      <nav class="primary-nav" aria-label="Navegação principal">
        ${navMarkup()}
      </nav>
      <div class="header__actions">
        ${statusMarkup()}
        <a class="btn btn--solid btn--sm header__cta" href="experimenta.html" data-track="cta_trial" data-track-location="header">
          <span>Aula grátis</span>${icon("arrow-up-right")}
        </a>
        <button class="menu-toggle" type="button" data-menu-open aria-controls="mobile-menu" aria-expanded="false">
          <span class="sr-only">Abrir menu</span>${icon("menu")}
        </button>
      </div>
    </div>`;
}

function mobileMenuMarkup() {
  const links = navItems
    .map(
      (item, index) => `
      <a class="mobile-menu__link" href="${item.href}" data-nav="${item.page}">
        <span class="mobile-menu__label">${item.label}</span>
        <span class="mobile-menu__index">${String(index + 1).padStart(2, "0")}</span>
      </a>`,
    )
    .join("");
  return `
  <aside class="mobile-menu" id="mobile-menu" aria-label="Menu principal" hidden>
    <div class="mobile-menu__top container">
      ${brandMarkup("brand--menu")}
      <button class="menu-close" type="button" data-menu-close>
        <span class="sr-only">Fechar menu</span>${icon("close")}
      </button>
    </div>
    <div class="mobile-menu__body container">
      <nav class="mobile-menu__nav" aria-label="Navegação mobile">${links}</nav>
      <div class="mobile-menu__aside">
        ${statusMarkup()}
        <a class="btn btn--solid btn--wide" href="experimenta.html" data-track="cta_trial" data-track-location="mobile-menu">
          <span>Marcar aula grátis</span>${icon("arrow-up-right")}
        </a>
        <div class="mobile-menu__contact">
          <a href="tel:${site.phoneHref}">${site.phone}</a>
          <a href="mailto:${site.email}">${site.email}</a>
          <p>${site.address.street}<br>${site.address.postalCode} ${site.address.city}</p>
        </div>
      </div>
    </div>
  </aside>`;
}

function footerMarkup() {
  return `
  <div class="container">
    <div class="footer__top">
      <div class="footer__brand">
        ${brandMarkup("brand--footer")}
        <p class="footer__slogan">${site.slogan}</p>
        <address class="footer__address">${site.address.street}<br>${site.address.postalCode} ${site.address.city}</address>
        <div class="footer__socials">
          <a href="${site.instagramUrl}" target="_blank" rel="noopener noreferrer" aria-label="Instagram da FORJA (abre numa nova janela)">${icon("instagram")}</a>
          <a href="${site.whatsappUrl}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp da FORJA (abre numa nova janela)">${icon("whatsapp")}</a>
          <a href="mailto:${site.email}" aria-label="Enviar email para a FORJA">${icon("mail")}</a>
        </div>
      </div>
      <div class="footer__col">
        <h2 class="footer__heading">Explorar</h2>
        <ul class="footer__links">
          <li><a href="horario.html">Horário</a></li>
          <li><a href="aulas.html">Aulas</a></li>
          <li><a href="planos.html">Planos e preços</a></li>
          <li><a href="treinadores.html">Treinadores</a></li>
          <li><a href="instalacoes.html">Instalações</a></li>
          <li><a href="sobre.html">Sobre a FORJA</a></li>
          <li><a href="faq.html">Perguntas frequentes</a></li>
        </ul>
      </div>
      <div class="footer__col">
        <h2 class="footer__heading">Contactos</h2>
        <ul class="footer__contact-list">
          <li><a href="tel:${site.phoneHref}">${icon("phone")}${site.phone}</a></li>
          <li><a href="${site.whatsappUrl}" target="_blank" rel="noopener noreferrer">${icon("whatsapp")}${site.whatsapp} <span class="footer__small">(WhatsApp)</span></a></li>
          <li><a href="mailto:${site.email}">${icon("mail")}${site.email}</a></li>
        </ul>
        <h2 class="footer__heading footer__heading--hours">Horário</h2>
        <ul class="footer__hours">
          ${openingHours
            .map(
              (item) =>
                `<li><span>${item.label}</span><span>${item.short}</span></li>`,
            )
            .join("")}
        </ul>
      </div>
      <div class="footer__newsletter">
        <h2 class="footer__heading">Uma nota por mês.</h2>
        <p>Novidades, aulas novas e notas úteis sobre treino. Zero spam.</p>
        <form class="newsletter-form" data-newsletter-form novalidate>
          <label class="sr-only" for="newsletter-email">O teu email</label>
          <div class="newsletter-form__row">
            <input id="newsletter-email" name="email" type="email" autocomplete="email" placeholder="o.teu@email.pt" required>
            <button class="btn btn--solid btn--icon" type="submit" aria-label="Subscrever newsletter">${icon("arrow-right")}</button>
          </div>
          <label class="newsletter-form__consent">
            <input type="checkbox" name="consent" required>
            <span>Aceito receber a newsletter da FORJA. Posso cancelar quando quiser.</span>
          </label>
          <p class="form-status" data-form-status role="status" aria-live="polite"></p>
        </form>
        <p class="footer__tiny">Inscrição simulada nesta demonstração. <a href="privacidade.html">Privacidade</a>.</p>
      </div>
    </div>
    <div class="footer__legal-row">
      <p>© 2026 FORJA Training Club. Todos os direitos reservados.</p>
      <div class="footer__legal-links">
        <a href="privacidade.html">Privacidade</a>
        <a href="cookies.html">Cookies</a>
        <a href="termos.html">Termos e condições</a>
        <a href="https://www.livroreclamacoes.pt/inicio" target="_blank" rel="noopener noreferrer">Livro de Reclamações</a>
        <a href="https://www.consumidor.gov.pt/" target="_blank" rel="noopener noreferrer">Resolução de litígios</a>
      </div>
    </div>
    <p class="footer__entity">[DENOMINAÇÃO SOCIAL] · NIF [NIF] · [N.º ALVARÁ/LICENÇA, se aplicável] · Sede: ${site.address.full}</p>
    <div class="footer__wordmark" aria-hidden="true">FORJA<span>®</span></div>
  </div>`;
}

function overlaysMarkup() {
  return `
  <nav class="floating-actions" aria-label="Atalhos flutuantes">
    <a class="floating-btn floating-btn--whatsapp" href="${site.whatsappUrl}" target="_blank" rel="noopener noreferrer" aria-label="Falar com a FORJA no WhatsApp (abre numa nova janela)">
      ${icon("whatsapp")}
    </a>
    <button class="floating-btn floating-btn--top" type="button" data-back-to-top aria-label="Voltar ao topo">
      ${icon("arrow-up")}
    </button>
  </nav>
  <nav class="mobile-bar" aria-label="Ações rápidas">
    <a href="tel:${site.phoneHref}" data-track="mobile_call">
      ${icon("phone")}<span>Ligar</span>
    </a>
    <a href="horario.html" data-track="mobile_schedule">
      ${icon("calendar")}<span>Horário</span>
    </a>
    <a class="mobile-bar__cta" href="experimenta.html" data-track="cta_trial" data-track-location="mobile-bar">
      ${icon("ticket")}<span>Aula grátis</span>
    </a>
  </nav>
  <aside class="cookie-banner" id="cookie-banner" aria-labelledby="cookie-title" hidden>
    <div class="cookie-banner__icon" aria-hidden="true">${icon("info")}</div>
    <div class="cookie-banner__copy">
      <h2 id="cookie-title">Cookies, sem mistério.</h2>
      <p>Só usamos o essencial para o site funcionar. Com o teu consentimento, medimos visitas para o melhorar. <a href="cookies.html">Saber mais</a>.</p>
    </div>
    <div class="cookie-banner__actions">
      <button class="btn btn--sweep btn--sm" type="button" data-cookie-choice="essential">Só essenciais</button>
      <button class="btn btn--solid btn--sm" type="button" data-cookie-choice="analytics">Aceitar análise</button>
    </div>
  </aside>
  <div class="toast" data-toast role="status" aria-live="polite" hidden></div>`;
}

/* --------------------------------------------------------------------------
   Estado de abertura
   -------------------------------------------------------------------------- */
function updateOpenStatus() {
  const status = getOpenStatus(new Date());
  document.querySelectorAll("[data-open-status]").forEach((block) => {
    block.classList.toggle("is-open", status.open);
    block.classList.toggle("is-closed", !status.open);
    const label = block.querySelector("[data-status-label]");
    const detail = block.querySelector("[data-status-detail]");
    if (label) label.textContent = status.label;
    if (detail) detail.textContent = status.detail;
    block.setAttribute("title", `${status.label} · ${status.detail}`);
    block.setAttribute(
      "aria-label",
      `Estado do ginásio: ${status.label}. ${status.detail}.`,
    );
  });
}

/* --------------------------------------------------------------------------
   Menu mobile + gestão de foco
   -------------------------------------------------------------------------- */
let lastFocusedElement = null;

function focusableIn(element) {
  return Array.from(
    element.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((node) => node.offsetWidth > 0 || node.offsetHeight > 0);
}

function trapFocus(event, element) {
  if (event.key !== "Tab") return;
  const focusable = focusableIn(element);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function initMobileMenu() {
  const menu = document.getElementById("mobile-menu");
  const openButton = document.querySelector("[data-menu-open]");
  const closeButton = document.querySelector("[data-menu-close]");
  if (!menu || !openButton || !closeButton) return;

  const open = () => {
    lastFocusedElement = document.activeElement;
    menu.hidden = false;
    requestAnimationFrame(() => menu.classList.add("is-open"));
    document.body.classList.add("menu-open");
    openButton.setAttribute("aria-expanded", "true");
    document.documentElement.style.setProperty("--scroll-lock", "hidden");
    closeButton.focus({ preventScroll: true });
  };

  const close = () => {
    menu.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    document.documentElement.style.removeProperty("--scroll-lock");
    openButton.setAttribute("aria-expanded", "false");
    window.setTimeout(() => {
      menu.hidden = true;
    }, 220);
    if (lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus({ preventScroll: true });
    }
  };

  openButton.addEventListener("click", open);
  closeButton.addEventListener("click", close);
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("is-open");
      document.body.classList.remove("menu-open");
      document.documentElement.style.removeProperty("--scroll-lock");
      openButton.setAttribute("aria-expanded", "false");
    });
  });
  document.addEventListener("keydown", (event) => {
    if (menu.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    }
    trapFocus(event, menu);
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1180 && !menu.hidden) close();
  });
}

/* --------------------------------------------------------------------------
   Diálogos nativos e feedback
   -------------------------------------------------------------------------- */
export function openDialog(dialog) {
  if (!(dialog instanceof HTMLDialogElement) || dialog.open) return;
  lastFocusedElement = document.activeElement;
  document.body.classList.add("dialog-open");
  dialog.showModal();
  const target = dialog.querySelector("[data-autofocus]") ?? dialog.querySelector("button, a[href]");
  target?.focus({ preventScroll: true });
}

export function closeDialog(dialog) {
  if (!(dialog instanceof HTMLDialogElement) || !dialog.open) return;
  dialog.close();
}

export function showToast(message, type = "success") {
  const toast = document.querySelector("[data-toast]");
  if (!toast) return;
  toast.textContent = message;
  toast.dataset.type = type;
  toast.hidden = false;
  requestAnimationFrame(() => toast.classList.add("is-visible"));
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => {
    toast.classList.remove("is-visible");
    window.setTimeout(() => {
      toast.hidden = true;
    }, 220);
  }, 5000);
}

function initDialogs() {
  document.addEventListener("click", (event) => {
    const closeTrigger = event.target.closest("[data-dialog-close]");
    if (closeTrigger) {
      const dialog = closeTrigger.closest("dialog");
      if (dialog) closeDialog(dialog);
    }
    if (event.target instanceof HTMLDialogElement) {
      const rect = event.target.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      if (!inside) closeDialog(event.target);
    }
  });
  document.addEventListener("close", (event) => {
    if (event.target instanceof HTMLDialogElement) {
      const anyOpen = [...document.querySelectorAll("dialog[open]")].length > 0;
      if (!anyOpen) document.body.classList.remove("dialog-open");
    }
  });
}

/* --------------------------------------------------------------------------
   Cookies + analytics preparado (só após consentimento)
   -------------------------------------------------------------------------- */
function readConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_CONSENT);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function hasAnalyticsConsent() {
  return readConsent()?.choice === "analytics";
}

/**
 * Ponto único de eventos de conversão.
 * Para ligar a Plausible: window.plausible(name, { props }).
 * Para GA4: window.gtag("event", name, props).
 * O envio só deve acontecer com consentimento de análise.
 */
export function trackEvent(name, properties = {}) {
  if (!hasAnalyticsConsent()) return;
  window.dispatchEvent(
    new CustomEvent("forja:analytics", { detail: { name, properties } }),
  );
  // ANALYTICS: liga aqui o fornecedor escolhido depois do consentimento.
}

function saveConsent(choice) {
  const value = { choice, date: new Date().toISOString(), version: 1 };
  try {
    localStorage.setItem(STORAGE_CONSENT, JSON.stringify(value));
  } catch {
    /* Armazenamento indisponível: o banner volta na próxima visita. */
  }
  document.documentElement.dataset.consent = choice;
}

function initCookies() {
  const banner = document.getElementById("cookie-banner");
  if (!banner) return;

  const showBanner = () => {
    banner.hidden = false;
    requestAnimationFrame(() => banner.classList.add("is-visible"));
  };

  banner.querySelectorAll("[data-cookie-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      const choice = button.dataset.cookieChoice;
      saveConsent(choice);
      banner.classList.remove("is-visible");
      window.setTimeout(() => {
        banner.hidden = true;
        showToast(
          choice === "analytics"
            ? "Preferências guardadas. Obrigado pela confiança."
            : "Preferências guardadas. Mantemos apenas o essencial.",
        );
      }, 220);
    });
  });

  document.querySelectorAll("[data-cookie-reset]").forEach((button) => {
    button.addEventListener("click", () => {
      try {
        localStorage.removeItem(STORAGE_CONSENT);
      } catch {
        /* sem armazenamento disponível */
      }
      document.documentElement.removeAttribute("data-consent");
      banner.classList.remove("is-visible");
      showBanner();
    });
  });

  const stored = readConsent();
  if (stored) {
    document.documentElement.dataset.consent = stored.choice;
    return;
  }

  window.setTimeout(showBanner, 800);
}

/* --------------------------------------------------------------------------
   Newsletter (simulada, com validação)
   -------------------------------------------------------------------------- */
function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value);
}

function initNewsletter() {
  document.querySelectorAll("[data-newsletter-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const status = form.querySelector("[data-form-status]");
      const email = form.querySelector('input[type="email"]');
      const consent = form.querySelector('input[name="consent"]');
      const label = "Inscrição simulada";
      if (!email || !email.value.trim() || !validEmail(email.value.trim())) {
        if (status) {
          status.textContent = "Escreve um email válido, por favor.";
          status.dataset.state = "error";
        }
        email?.focus();
        return;
      }
      if (consent && !consent.checked) {
        if (status) {
          status.textContent = "Para receber a newsletter, confirma a caixa de consentimento.";
          status.dataset.state = "error";
        }
        consent.focus();
        return;
      }
      if (status) {
        status.textContent = "Está feito. Esta inscrição é uma simulação — nenhum email será enviado.";
        status.dataset.state = "success";
      }
      try {
        sessionStorage.setItem(STORAGE_NEWSLETTER, email.value.trim());
      } catch {
        /* sessão indisponível */
      }
      trackEvent("newsletter_submit", { source: "footer" });
      form.reset();
      showToast(`${label}: newsletter registada nesta demonstração.`);
    });
  });
}

/* --------------------------------------------------------------------------
   Movimento: reveals, contadores, marquee e botão topo
   -------------------------------------------------------------------------- */
let motionObserver = null;
let counterObserver = null;
const observedElements = new WeakSet();
const countedElements = new WeakSet();
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function setCounter(element) {
  if (countedElements.has(element)) return;
  countedElements.add(element);
  const target = Number(element.dataset.counter);
  const suffix = element.dataset.suffix ?? "";
  const prefix = element.dataset.prefix ?? "";
  const decimals = Number(element.dataset.decimals ?? "0");
  if (!Number.isFinite(target)) return;
  if (reduceMotion.matches) {
    element.textContent = `${prefix}${new Intl.NumberFormat("pt-PT", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(target)}${suffix}`;
    return;
  }
  const start = performance.now();
  const duration = 1400;
  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    element.textContent = `${prefix}${new Intl.NumberFormat("pt-PT", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(decimals ? value : Math.round(value))}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

export function initMotion() {
  const revealElements = document.querySelectorAll("[data-reveal]");
  const counterElements = document.querySelectorAll("[data-counter]");

  if (!("IntersectionObserver" in window) || reduceMotion.matches) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    counterElements.forEach(setCounter);
    return;
  }

  if (!motionObserver) {
    motionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" },
    );
  }

  if (!counterObserver) {
    counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setCounter(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.45 },
    );
  }

  revealElements.forEach((element) => {
    if (observedElements.has(element)) return;
    observedElements.add(element);
    motionObserver.observe(element);
  });

  counterElements.forEach((element) => {
    if (countedElements.has(element)) return;
    counterObserver.observe(element);
  });
}

function initScrolling() {
  const topButton = document.querySelector("[data-back-to-top]");
  const whatsappButton = document.querySelector(".floating-btn--whatsapp");

  if (topButton || whatsappButton) {
    const update = () => {
      const scrollY = window.scrollY;
      topButton?.classList.toggle("is-visible", scrollY > 700);
      whatsappButton?.classList.toggle("is-visible", scrollY > 220);
    };
    window.addEventListener("scroll", update, { passive: true });
    update();

    topButton?.addEventListener("click", () => {
      const behavior = reduceMotion.matches ? "auto" : "smooth";
      window.scrollTo({ top: 0, behavior });
    });
  }

  reduceMotion.addEventListener?.("change", () => {
    if (reduceMotion.matches) {
      document
        .querySelectorAll("[data-reveal]")
        .forEach((element) => element.classList.add("is-visible"));
    }
  });
}

function setActiveNav() {
  const file = window.location.pathname.split("/").pop() || "index.html";
  const current = navItems.find(
    (item) =>
      item.href === file ||
      (item.page === "classes" && file === "aula.html"),
  );
  document.querySelectorAll("[data-nav]").forEach((link) => {
    const active = Boolean(current && link.dataset.nav === current.page);
    link.classList.toggle("is-active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

function initDialogDefaults() {
  document.querySelectorAll("dialog").forEach((dialog) => {
    if (dialog.dataset.autoWired === "true") return;
    dialog.dataset.autoWired = "true";
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) closeDialog(dialog);
    });
  });
}

function delegateTracking() {
  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-track]");
    if (!target) return;
    trackEvent(target.dataset.track, {
      location: target.dataset.trackLocation ?? "page",
      label: target.textContent.trim().replace(/\s+/g, " ").slice(0, 80),
    });
  });
}

/* --------------------------------------------------------------------------
   Início
   -------------------------------------------------------------------------- */
export function initUI() {
  document.documentElement.classList.add("js");

  const header = document.querySelector(".site-header");
  if (header) header.innerHTML = headerMarkup();

  const footer = document.querySelector(".site-footer");
  if (footer) footer.innerHTML = footerMarkup();

  // O primeiro elemento focável do documento deve ser o atalho de conteúdo.
  document.body.insertAdjacentHTML(
    "afterbegin",
    `<a class="skip-link" href="#main">Saltar para o conteúdo</a>${svgSprite}`,
  );
  document.body.insertAdjacentHTML("beforeend", mobileMenuMarkup());
  document.body.insertAdjacentHTML("beforeend", overlaysMarkup());

  setActiveNav();
  updateOpenStatus();
  window.setInterval(updateOpenStatus, 60_000);
  initMobileMenu();
  initCookies();
  initNewsletter();
  initScrolling();
  initDialogs();
  initDialogDefaults();
  delegateTracking();

  document.querySelectorAll("a[href^='http']").forEach((link) => {
    if (!link.hasAttribute("rel")) link.setAttribute("rel", "noopener noreferrer");
  });

  // Atualiza o estado dos diálogos criados depois pelos módulos.
  const dynamicDialogObserver = new MutationObserver(() => initDialogDefaults());
  dynamicDialogObserver.observe(document.body, { childList: true, subtree: true });
}

export { openingHours };
