/* ==========================================================================
   Página interna de sistema de design — apenas demonstração de componentes
   ========================================================================== */

import { openDialog, showToast } from "./ui.js";

export function initDesign() {
  const dialog = document.getElementById("ds-dialog");
  document.querySelector("[data-open-ds-dialog]")?.addEventListener("click", () => {
    if (dialog) openDialog(dialog);
  });
  document.querySelector("[data-ds-toast]")?.addEventListener("click", () => {
    showToast("Exemplo de notificação do sistema FORJA.");
  });
  document.querySelector("[data-ds-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    showToast("Formulário de demonstração. Nada foi enviado.");
  });
  document.documentElement.dataset.pageReady = "design";
}
