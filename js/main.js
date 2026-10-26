/* ==========================================================================
   FORJA Training Club — arranque da aplicação
   Carrega a interface partilhada e apenas o módulo da página atual.
   ========================================================================== */

import { initUI, initMotion } from "./ui.js";

const routes = {
  home: async () => {
    const { initHome } = await import("./home.js");
    initHome();
  },
  schedule: async () => {
    const { initSchedule } = await import("./schedule.js");
    initSchedule();
  },
  plans: async () => {
    const [{ initPlans }, { initQuiz }] = await Promise.all([
      import("./plans.js"),
      import("./quiz.js"),
    ]);
    initPlans();
    initQuiz();
  },
  classes: async () => {
    const { initClasses } = await import("./classes.js");
    initClasses();
  },
  aula: async () => {
    const { initClassDetail } = await import("./classes.js");
    initClassDetail();
  },
  trainers: async () => {
    const { initTrainers } = await import("./trainers.js");
    initTrainers();
  },
  facilities: async () => {
    const { initFacilities } = await import("./facilities.js");
    initFacilities();
  },
  about: async () => {
    // A página Sobre é sobretudo editorial; o movimento é inicializado abaixo.
  },
  trial: async () => {
    const { initTrial } = await import("./trial.js");
    initTrial();
  },
  contact: async () => {
    const { initContact } = await import("./contact.js");
    initContact();
  },
  faq: async () => {
    const { initFaq } = await import("./faq.js");
    initFaq();
  },
  legal: async () => {
    const { initLegal } = await import("./legal.js");
    initLegal();
  },
  design: async () => {
    const { initDesign } = await import("./design.js");
    initDesign();
  },
};

async function boot() {
  initUI();

  const page = document.body.dataset.page ?? "";
  const route = routes[page];

  if (route) {
    try {
      await route();
    } catch (error) {
      console.error(`[FORJA] Não foi possível inicializar a página "${page}".`, error);
    }
  }

  // Os módulos podem criar conteúdo novo; observamos depois do render.
  initMotion();

  // Permite que módulos peçam uma nova recolha de elementos animáveis.
  window.addEventListener("forja:refresh-motion", initMotion);
}

boot();
