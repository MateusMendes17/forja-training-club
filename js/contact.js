/* ==========================================================================
   Contactos — horário, validação do formulário e confirmação simulada
   ========================================================================== */

import { openingHours, site } from "./data.js";
import { escapeHTML, showToast, trackEvent } from "./ui.js";

let form;
let status;
let submitButton;
let busy = false;

function renderHours() {
  const container = document.querySelector("[data-contact-hours]");
  if (!container) return;
  container.innerHTML = openingHours
    .map(
      (row) => `
      <div>
        <dt>${escapeHTML(row.label)}</dt>
        <dd>${escapeHTML(row.short)}</dd>
      </div>`,
    )
    .join("");
}

function errorFor(name) {
  return form?.querySelector(`[data-contact-error="${name}"]`);
}

function clearError(name) {
  const target = errorFor(name);
  if (target) target.textContent = "";
  form?.querySelectorAll(`[name="${name}"]`).forEach((field) => {
    field.removeAttribute("aria-invalid");
  });
  if (status?.dataset.state === "error") {
    status.hidden = true;
    status.textContent = "";
  }
}

function markError(name, message) {
  const target = errorFor(name);
  if (target) target.textContent = message;
  form?.querySelectorAll(`[name="${name}"]`).forEach((field) => {
    field.setAttribute("aria-invalid", "true");
  });
}

function validate() {
  const errors = [];
  const name = form?.elements.nome;
  const email = form?.elements.email;
  const phone = form?.elements.telemovel;
  const message = form?.elements.mensagem;
  const privacy = form?.elements.privacidade;

  if (!name?.value.trim() || name.value.trim().length < 2) {
    errors.push({ name: "nome", message: "Indica o teu nome.", focus: name });
  }
  if (!email?.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
    errors.push({ name: "email", message: "Indica um email válido.", focus: email });
  }
  const digits = phone?.value.replace(/\D/g, "") ?? "";
  if (digits && digits.length < 9) {
    errors.push({
      name: "telemovel",
      message: "O telemóvel deve ter pelo menos 9 dígitos.",
      focus: phone,
    });
  }
  if (!message?.value.trim() || message.value.trim().length < 10) {
    errors.push({
      name: "mensagem",
      message: "Escreve uma mensagem com pelo menos 10 caracteres.",
      focus: message,
    });
  }
  if (!privacy?.checked) {
    errors.push({
      name: "privacidade",
      message: "Precisas de aceitar a política de privacidade para enviar.",
      focus: privacy,
    });
  }

  errors.forEach((error) => markError(error.name, error.message));
  return errors;
}

function showStatus(message, state = "error") {
  if (!status) return;
  status.hidden = false;
  status.dataset.state = state;
  status.textContent = message;
  status.focus({ preventScroll: true });
  status.scrollIntoView({ behavior: "smooth", block: "center" });
}

async function handleSubmit(event) {
  event.preventDefault();
  if (busy) return;
  const errors = validate();
  if (errors.length) {
    showStatus(
      `Há ${errors.length} ${errors.length === 1 ? "campo por corrigir" : "campos por corrigir"}. Vê as indicações junto de cada campo.`,
      "error",
    );
    trackEvent("contact_validation_error", { fields: errors.map((error) => error.name) });
    return;
  }

  busy = true;
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.setAttribute("aria-busy", "true");
    submitButton.querySelector("span").textContent = "A enviar...";
  }

  const data = new FormData(form);
  const name = String(data.get("nome") ?? "").trim().split(" ")[0];
  await new Promise((resolve) => setTimeout(resolve, 700));
  form.reset();
  form.querySelectorAll("[aria-invalid]").forEach((field) => field.removeAttribute("aria-invalid"));
  form.querySelectorAll("[data-contact-error]").forEach((error) => {
    error.textContent = "";
  });
  if (submitButton) {
    submitButton.disabled = false;
    submitButton.removeAttribute("aria-busy");
    submitButton.querySelector("span").textContent = "Enviar mensagem";
  }
  showStatus(
    `Obrigado, ${name || "e até breve"}. A tua mensagem foi registada apenas nesta demonstração — não foi enviada. Em produção, responderíamos para ${String(data.get("email") ?? "").trim() || "o teu email"} num dia útil.`,
    "success",
  );
  showToast("Mensagem simulada. Nada foi enviado.");
  trackEvent("contact_submit", { subject: String(data.get("assunto") ?? ""), simulated: true });
  busy = false;
}

function bind() {
  form?.addEventListener("submit", handleSubmit);
  form?.addEventListener("input", (event) => {
    if (event.target.name) clearError(event.target.name);
  });
  form?.addEventListener("change", (event) => {
    if (event.target.name) clearError(event.target.name);
  });
}

export function initContact() {
  form = document.getElementById("contact-form");
  status = document.querySelector("[data-contact-status]");
  submitButton = form?.querySelector("[type='submit']");
  renderHours();
  bind();
  document.documentElement.dataset.pageReady = "contact";
  trackEvent("contact_view", { channel: "page" });
}
