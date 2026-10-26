/* ==========================================================================
   FORJA Training Club — fonte única de conteúdo
   Edita aqui aulas, horário, planos, treinadores, instalações e FAQ.
   Os preços, vagas e horários são fictícios e servem de demonstração.
   ========================================================================== */

export const site = {
  name: "FORJA Training Club",
  shortName: "FORJA",
  slogan: "O treino não é magia. É ofício.",
  founded: 2017,
  area: 1200,
  description:
    "Ginásio em Braga com treino acompanhado, aulas de grupo e uma comunidade que puxa por ti — sem julgamentos.",
  address: {
    street: "Avenida da Liberdade, 410",
    postalCode: "4710-251",
    city: "Braga",
    country: "Portugal",
    full: "Avenida da Liberdade, 410, 4710-251 Braga",
  },
  phone: "253 456 789",
  phoneHref: "+351253456789",
  whatsapp: "916 789 012",
  whatsappHref: "https://wa.me/351916789012",
  whatsappUrl:
    "https://wa.me/351916789012?text=Ol%C3%A1%2C%20gostaria%20de%20marcar%20uma%20aula%20experimental%20na%20FORJA.",
  email: "ola@forja.pt",
  instagram: "@forja.braga",
  instagramUrl: "https://instagram.com/forja.braga",
  url: "https://forja-training-club.vercel.app",
  mapEmbed:
    "https://www.google.com/maps?q=Avenida+da+Liberdade+410,+4710-251+Braga,+Portugal&output=embed",
};

export const openingHours = [
  {
    days: [1, 2, 3, 4, 5],
    label: "Segunda a sexta",
    open: "06:30",
    close: "22:30",
    short: "06h30–22h30",
  },
  {
    days: [6],
    label: "Sábado",
    open: "08:00",
    close: "19:00",
    short: "08h00–19h00",
  },
  {
    days: [0],
    label: "Domingo e feriados",
    open: "09:00",
    close: "14:00",
    short: "09h00–14h00",
  },
];

/* Feriados nacionais e de Braga, versão simplificada para demonstração.
   Confirma e atualiza anualmente. */
export const holidays = {
  "2026-01-01": "Ano Novo",
  "2026-04-03": "Sexta-feira Santa",
  "2026-04-05": "Domingo de Páscoa",
  "2026-04-25": "Dia da Liberdade",
  "2026-05-01": "Dia do Trabalhador",
  "2026-06-04": "Corpo de Deus",
  "2026-06-10": "Dia de Portugal",
  "2026-06-24": "São João — feriado municipal de Braga",
  "2026-08-15": "Assunção de Nossa Senhora",
  "2026-10-05": "Implantação da República",
  "2026-11-01": "Todos os Santos",
  "2026-12-01": "Restauração da Independência",
  "2026-12-08": "Imaculada Conceição",
  "2026-12-25": "Natal",
  "2027-01-01": "Ano Novo",
  "2027-03-26": "Sexta-feira Santa",
  "2027-03-28": "Domingo de Páscoa",
  "2027-04-25": "Dia da Liberdade",
  "2027-05-01": "Dia do Trabalhador",
  "2027-05-27": "Corpo de Deus",
  "2027-06-10": "Dia de Portugal",
  "2027-06-24": "São João — feriado municipal de Braga",
  "2027-08-15": "Assunção de Nossa Senhora",
  "2027-10-05": "Implantação da República",
  "2027-11-01": "Todos os Santos",
  "2027-12-01": "Restauração da Independência",
  "2027-12-08": "Imaculada Conceição",
  "2027-12-25": "Natal",
};

export const dayNames = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

export const dayNamesShort = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export const dayOrder = [1, 2, 3, 4, 5, 6, 0];

export const goalLabels = {
  forca: "Força",
  resistencia: "Resistência",
  mobilidade: "Mobilidade",
  relaxamento: "Relaxamento",
  iniciantes: "Iniciantes",
  geral: "Condição geral",
};

export const periodLabels = {
  manha: "Manhã",
  almoco: "Almoço",
  tarde: "Tarde",
  noite: "Noite",
};

export const levels = ["Iniciante", "Intermédio", "Avançado", "Todos os níveis"];

/* --------------------------------------------------------------------------
   AULAS
   -------------------------------------------------------------------------- */
export const classes = [
  {
    id: "funcional",
    number: "01",
    name: "Treino Funcional",
    tagline: "Padrões reais. Força útil.",
    summary:
      "Agachar, empurrar, puxar e carregar: um treino completo com movimentos que usas dentro e fora do ginásio.",
    description: [
      "O Treino Funcional combina movimentos de força com padrões do dia a dia — agachar, levantar, empurrar, puxar e transportar. Trabalhamos técnica, coordenação e condição física numa sessão em circuito, sempre com progressões para cada nível.",
      "As cargas e as variações são ajustadas ao teu ponto de partida. O objetivo não é fazer tudo no primeiro dia; é construir uma base sólida e repetível.",
    ],
    intensity: 3,
    levels: ["Iniciante", "Intermédio", "Avançado"],
    goals: ["forca", "resistencia", "iniciantes"],
    image: "images/class-functional.webp",
    imageAlt: "Pessoa a fazer flexões apoiada em halteres, numa ilustração de treino funcional.",
    imageCredit: "Fotografia ilustrativa Unsplash",
    duration: 50,
    forWho: [
      "Quem quer treinar o corpo todo numa sessão.",
      "Quem está cansado de treinar músculos isolados sem contexto.",
      "Quem procura um formato com acompanhamento e progressão.",
    ],
    notFor: [
      "Quem procura apenas treino de força máxima com barra — nesse caso, a aula de Força para Iniciantes ou o acompanhamento individual podem ser mais adequados.",
      "Quem tem uma lesão ativa e ainda não fez avaliação. Fala com a equipa antes de entrar.",
    ],
    whatToExpect: [
      "Ativação e mobilidade articular.",
      "Blocos de força e condição física com variações por nível.",
      "Trabalho em circuito, com pausas controladas.",
      "Retorno à calma e indicações para recuperar.",
    ],
    bring: ["Roupa desportiva", "Ténis com apoio", "Garrafa de água", "Toalha"],
    rooms: ["Zona funcional"],
    trainers: ["diogo", "bruno"],
  },
  {
    id: "hiit",
    number: "02",
    name: "HIIT",
    tagline: "Intensidade em intervalos.",
    summary:
      "Esforços curtos e pausas planeadas para elevar a frequência cardíaca, com escala para o teu nível.",
    description: [
      "HIIT significa treino intervalado de alta intensidade. Na FORJA, alternamos períodos de esforço com períodos de recuperação, respeitando a tua condição física e a técnica.",
      "Trabalhamos com o teu esforço relativo, não com máximos absolutos. O objetivo é chegar ao fim com boa qualidade de movimento e uma intensidade que consigas repetir no futuro.",
    ],
    intensity: 4,
    levels: ["Intermédio", "Avançado"],
    goals: ["resistencia", "forca"],
    image: "images/class-hiit.webp",
    imageAlt: "Mulher a treinar com cordas de batalha numa nave escura, ilustração de HIIT.",
    imageCredit: "Fotografia ilustrativa Unsplash",
    duration: 40,
    forWho: [
      "Quem tem já alguma base de exercício e quer um treino intenso.",
      "Quem gosta de sessões curtas e estruturadas.",
      "Quem quer melhorar a capacidade cardiovascular, com supervisão.",
    ],
    notFor: [
      "Quem está a iniciar-se e ainda não fez avaliação inicial.",
      "Quem tem uma condição cardíaca, respiratória ou musculoesquelética não avaliada. Confirma com o teu médico antes.",
    ],
    whatToExpect: [
      "Aquecimento articular e cardiovascular.",
      "Intervalos de esforço e recuperação adaptados por nível.",
      "Movimentos funcionais, sem saltos obrigatórios.",
      "Abrandamento e alongamento final.",
    ],
    bring: ["Roupa desportiva", "Ténis com apoio", "Garrafa de água", "Toalha"],
    rooms: ["Estúdio 1"],
    trainers: ["bruno"],
  },
  {
    id: "cross",
    number: "03",
    name: "Cross Training",
    tagline: "Força, variedade e motor.",
    summary:
      "Barra, halteres, kettlebells e peso corporal num treino variado que constrói força e capacidade de trabalho.",
    description: [
      "O Cross Training junta força e condicionamento físico em sessões variadas. Cada aula tem um aquecimento comum e um bloco de trabalho com progressões e cargas diferentes para cada nível.",
      "A técnica vem primeiro. Se um movimento ainda não estiver confortável, apresentamos uma alternativa segura e eficaz.",
    ],
    intensity: 4,
    levels: ["Intermédio", "Avançado"],
    goals: ["forca", "resistencia"],
    image: "images/class-cross.webp",
    imageAlt: "Grupo em aula de cross training com barras e discos.",
    imageCredit: "Fotografia ilustrativa Unsplash",
    duration: 60,
    forWho: [
      "Quem gosta de variedade e de trabalhar com diferentes materiais.",
      "Quem quer desenvolver força e condição física em simultâneo.",
      "Quem já conhece padrões básicos de agachamento, levantamento e puxada.",
    ],
    notFor: [
      "Quem procura o primeiro contacto com treino de força — a aula Força para Iniciantes é mais adequada.",
      "Quem tiver uma lesão não avaliada, sobretudo em ombros, costas ou joelhos.",
    ],
    whatToExpect: [
      "Aquecimento específico e preparação técnica.",
      "Bloco principal com variações e escalas de carga.",
      "Trabalho de condicionamento no final.",
      "Descarregamento e notas para a próxima sessão.",
    ],
    bring: ["Roupa desportiva", "Ténis estável", "Garrafa de água", "Toalha"],
    rooms: ["Zona funcional"],
    trainers: ["bruno"],
  },
  {
    id: "spinning",
    number: "04",
    name: "Spinning",
    tagline: "Pedala. Respira. Repete.",
    summary:
      "Aula de bicicleta estática com música, ritmo e subidas progressivas. Tu controlas a resistência.",
    description: [
      "O Spinning é uma aula cardiovascular em bicicleta estática, guiada pela música e pelo ritmo do grupo. Alternamos cadência, subidas e recuperação, sempre com a tua resistência sob controlo.",
      "A sala é escura, o som é alto e o foco é teu. Se preferes uma intensidade mais baixa, mantém-te no plano que funciona para ti.",
    ],
    intensity: 3,
    levels: ["Iniciante", "Intermédio", "Avançado"],
    goals: ["resistencia", "iniciantes"],
    image: "images/class-spinning.webp",
    imageAlt: "Bicicletas estáticas de spinning alinhadas num estúdio de treino.",
    imageCredit: "Fotografia ilustrativa Unsplash",
    duration: 45,
    forWho: [
      "Quem procura cardio com impacto reduzido nos joelhos.",
      "Quem se motiva com música e energia de grupo.",
      "Quem quer uma aula com intensidade ajustável.",
    ],
    notFor: [
      "Quem se sente desconfortável com som alto e luz baixa.",
      "Quem tem uma condição cardiovascular não avaliada — confirma com o teu médico.",
    ],
    whatToExpect: [
      "Ajuste da bicicleta antes de começar.",
      "Aquecimento progressivo e blocos de cadência.",
      "Subidas e recuperações controladas.",
      "Alongamento final e limpeza do equipamento.",
    ],
    bring: ["Roupa desportiva", "Ténis para pedalar", "Garrafa de água grande", "Toalha"],
    rooms: ["Estúdio 2"],
    trainers: ["catarina"],
  },
  {
    id: "yoga",
    number: "05",
    name: "Yoga",
    tagline: "Presença antes de pressa.",
    summary:
      "Respiração, posturas e mobilidade para desacelerar, melhorar a consciência corporal e recuperar.",
    description: [
      "As aulas de Yoga combinam respiração, posturas de força e alongamentos. São sessões de ritmo pausado, com instruções claras e alternativas para cada postura.",
      "Não precisas de ser flexível nem de ter experiência. Precisas de roupa confortável e de um espaço onde te sintas à vontade.",
    ],
    intensity: 2,
    levels: ["Iniciante", "Intermédio", "Avançado"],
    goals: ["mobilidade", "relaxamento", "iniciantes"],
    image: "images/class-yoga.webp",
    imageAlt: "Silhueta de uma pessoa numa postura de yoga ao pôr do sol.",
    imageCredit: "Fotografia ilustrativa Unsplash",
    duration: 60,
    forWho: [
      "Quem procura recuperação ativa e menos intensidade.",
      "Quem passa muitas horas sentado e quer ganhar mobilidade.",
      "Quem quer complementar treino de força com trabalho de respiração.",
    ],
    notFor: [
      "Quem procura uma aula essencialmente cardiovascular.",
      "Quem tem uma lesão recente sem indicação clínica para determinados movimentos.",
    ],
    whatToExpect: [
      "Exercícios de respiração e aterramento.",
      "Posturas em pé, sentado e no chão, com apoio de blocos.",
      "Transições lentas e opções adaptadas.",
      "Relaxamento final.",
    ],
    bring: ["Roupa confortável", "Meias antiderrapantes (opcional)", "Garrafa de água"],
    rooms: ["Estúdio 3"],
    trainers: ["marta"],
  },
  {
    id: "pilates",
    number: "06",
    name: "Pilates",
    tagline: "Controlo no centro.",
    summary:
      "Movimento controlado, respiração e estabilidade para melhorar postura e confiança nos padrões básicos.",
    description: [
      "O Pilates trabalha controlo motor, estabilidade e consciência corporal em sequências de baixo impacto. É uma aula exigente à sua maneira: lenta, precisa e atenta.",
      "Usamos pequenos equipamentos e o próprio peso do corpo. Todas as posições têm variações para tornar a prática mais confortável ou mais desafiante.",
    ],
    intensity: 2,
    levels: ["Iniciante", "Intermédio"],
    goals: ["mobilidade", "relaxamento", "iniciantes"],
    image: "images/class-pilates.webp",
    imageAlt: "Grupo a fazer exercícios de pilates em tapetes num estúdio.",
    imageCredit: "Fotografia ilustrativa Unsplash",
    duration: 50,
    forWho: [
      "Quem quer melhorar estabilidade e postura.",
      "Quem procura uma opção de baixo impacto.",
      "Quem quer aprender a controlar o movimento antes de aumentar carga.",
    ],
    notFor: [
      "Quem procura treino de força com cargas elevadas.",
      "Quem tem dor aguda ou lesão recente sem acompanhamento clínico.",
    ],
    whatToExpect: [
      "Aquecimento respiratório e ativação do centro.",
      "Sequências de controlo e estabilidade.",
      "Trabalho de mobilidade e postura.",
      "Alongamento e regresso à calma.",
    ],
    bring: ["Roupa confortável", "Meias (opcional)", "Garrafa de água"],
    rooms: ["Estúdio 3"],
    trainers: ["marta"],
  },
  {
    id: "mobilidade",
    number: "07",
    name: "Mobilidade e Recuperação",
    tagline: "O treino também descansa.",
    summary:
      "Mobilidade articular, alongamento e respiração para recuperar melhor e mover-te com mais liberdade.",
    description: [
      "Uma aula dedicada ao que fica entre treinos: amplitude de movimento, tecido muscular e sistema nervoso. Trabalhamos com calma e intenção, sem forçar amplitudes.",
      "É um complemento útil para quem treina força, passa muitas horas sentado ou simplesmente quer sentir o corpo menos rígido.",
    ],
    intensity: 1,
    levels: ["Todos os níveis"],
    goals: ["mobilidade", "relaxamento", "iniciantes"],
    image: "images/class-mobility.webp",
    imageAlt: "Pessoa numa posição de alongamento em tapete, em preto e branco.",
    imageCredit: "Fotografia ilustrativa Unsplash",
    duration: 40,
    forWho: [
      "Quem quer recuperar entre sessões de treino.",
      "Quem sente rigidez no dia a dia.",
      "Quem procura começar a mexer-se com um ritmo calmo.",
    ],
    notFor: [
      "Quem procura um treino cardiovascular ou de força.",
      "Quem tem dor aguda; nesse caso, procura primeiro avaliação clínica.",
    ],
    whatToExpect: [
      "Respiração e mobilidade articular guiada.",
      "Alongamentos com apoio e tempo de permanência.",
      "Trabalho de tecidos e controlo motor.",
      "Técnicas simples para repetir em casa.",
    ],
    bring: ["Roupa confortável", "Toalha", "Garrafa de água"],
    rooms: ["Estúdio 3"],
    trainers: ["marta", "tomas"],
  },
  {
    id: "boxe",
    number: "08",
    name: "Boxe Fitness",
    tagline: "Mãos ativas. Cabeça fria.",
    summary:
      "Técnica de boxe adaptada ao fitness: coordenação, ritmo e condição física. Sem contacto obrigatório.",
    description: [
      "No Boxe Fitness trabalhamos guarda, deslocamentos, combinações e trabalho de saco. Não há sparring obrigatório nem contacto entre participantes.",
      "As sessões desenvolvem coordenação, ritmo, mobilidade de ombros e condição física. O foco está na técnica e na prática consistente, não na competição.",
    ],
    intensity: 3,
    levels: ["Iniciante", "Intermédio", "Avançado"],
    goals: ["resistencia", "forca", "iniciantes"],
    image: "images/class-boxing.webp",
    imageAlt: "Par de luvas de boxe pretas em close-up.",
    imageCredit: "Fotografia ilustrativa Unsplash",
    duration: 50,
    forWho: [
      "Quem quer aprender técnicas básicas de boxe.",
      "Quem gosta de treino de coordenação e ritmo.",
      "Quem procura condicionamento com menos monotonia.",
    ],
    notFor: [
      "Quem procura competição ou sparring — não é o foco desta aula.",
      "Quem tem uma lesão de ombro, punho ou mão não avaliada.",
    ],
    whatToExpect: [
      "Aquecimento, mobilidade de ombros e guarda.",
      "Técnica de jab, direto, ganchos e deslocamentos.",
      "Combinações no saco ou com parceiro de sombra.",
      "Condicionamento final e alongamento.",
    ],
    bring: ["Roupa desportiva", "Ténis estável", "Garrafa de água", "Luvas se tiveres (temos material de empréstimo)"],
    rooms: ["Zona funcional"],
    trainers: ["bruno"],
  },
  {
    id: "forca",
    number: "09",
    name: "Força para Iniciantes",
    tagline: "Aprende a base. Constrói em cima.",
    summary:
      "Uma introdução prática aos movimentos de força com barra, halteres e máquinas — com técnica em primeiro lugar.",
    description: [
      "Esta aula foi criada para quem quer começar a treinar força sem se sentir perdido na sala. Aprendemos a agachar, levantar, empurrar e puxar com progressões simples e supervisão próxima.",
      "O grupo é pequeno e o ritmo é de aprendizagem. Não há pressa para colocar mais peso: primeiro dominamos a técnica e depois aumentamos de forma gradual.",
    ],
    intensity: 2,
    levels: ["Iniciante"],
    goals: ["forca", "iniciantes"],
    image: "images/class-strength.webp",
    imageAlt: "Mulher a preparar um agachamento com barra na sala de musculação.",
    imageCredit: "Fotografia ilustrativa Unsplash",
    duration: 60,
    forWho: [
      "Quem nunca treinou força ou quer recomeçar.",
      "Quem quer sentir-se confiante na sala de musculação.",
      "Quem prefere aprender com instruções próximas e ritmo pausado.",
    ],
    notFor: [
      "Quem procura treino avançado de powerlifting.",
      "Quem tem uma lesão ativa sem avaliação clínica.",
    ],
    whatToExpect: [
      "Introdução aos padrões fundamentais de força.",
      "Demonstração e prática com feedback individual.",
      "Séries curtas com foco em técnica.",
      "Plano de continuidade para a sala de musculação.",
    ],
    bring: ["Roupa desportiva", "Ténis estável", "Garrafa de água", "Toalha"],
    rooms: ["Sala de força"],
    trainers: ["catarina", "diogo"],
  },
];

/* --------------------------------------------------------------------------
   TREINADORES
   Certificações com placeholders intencionais: preencher antes de publicar.
   -------------------------------------------------------------------------- */
export const trainers = [
  {
    id: "diogo",
    name: "Diogo Fernandes",
    role: "Diretor técnico",
    specialties: ["Força", "Condição física", "Treino individual"],
    certifications: [
      "Certificação [NOME DA ENTIDADE] — Treino de força",
      "Formação contínua [ENTIDADE A CONFIRMAR]",
    ],
    languages: ["Português", "Inglês"],
    bio: "Diogo é um dos fundadores da FORJA. Acompanha treino de força e condição física, com especial atenção à técnica e à progressão realista. Acredita que um bom treino deve caber na vida de quem o faz — e não o contrário.",
    image: "images/trainer-diogo.webp",
    imageAlt: "Retrato ilustrativo de Diogo Fernandes, diretor técnico da FORJA.",
  },
  {
    id: "marta",
    name: "Marta Cerqueira",
    role: "Yoga, Pilates e Mobilidade",
    specialties: ["Yoga", "Pilates", "Mobilidade"],
    certifications: [
      "Certificação [NOME DA ENTIDADE] — Yoga",
      "Certificação [NOME DA ENTIDADE] — Pilates",
    ],
    languages: ["Português", "Inglês"],
    bio: "Marta também fundou a FORJA e conduz as práticas de Yoga, Pilates e Mobilidade. Ensina com instruções claras e alternativas para cada corpo, criando espaço para quem chega pela primeira vez e para quem já pratica há anos.",
    image: "images/trainer-marta.webp",
    imageAlt: "Retrato ilustrativo de Marta Cerqueira, treinadora de yoga e pilates.",
  },
  {
    id: "bruno",
    name: "Bruno Lopes",
    role: "HIIT, Cross Training e Boxe Fitness",
    specialties: ["HIIT", "Cross Training", "Boxe Fitness"],
    certifications: [
      "Certificação [NOME DA ENTIDADE] — Condição física",
      "Formação contínua [ENTIDADE A CONFIRMAR]",
    ],
    languages: ["Português", "Inglês", "Espanhol"],
    bio: "Bruno conduz as aulas mais intensas do clube com o mesmo princípio: ninguém fica para trás. Explica o objetivo de cada bloco, mostra as opções mais simples e desafia quem já tem mais experiência sem perder o grupo de vista.",
    image: "images/trainer-bruno.webp",
    imageAlt: "Retrato ilustrativo de Bruno Lopes, treinador de HIIT e cross training.",
  },
  {
    id: "catarina",
    name: "Catarina Sá",
    role: "Spinning e treino de iniciantes",
    specialties: ["Spinning", "Força para iniciantes", "Acompanhamento"],
    certifications: [
      "Certificação [NOME DA ENTIDADE] — Spinning",
      "Certificação [NOME DA ENTIDADE] — Treino de força",
    ],
    languages: ["Português", "Inglês"],
    bio: "Catarina acompanha quem está a dar os primeiros passos e quem volta ao treino depois de uma pausa. Nas pedaladas e na sala de força, o seu foco é simples: um ritmo que consigas manter e instruções que façam sentido na primeira vez.",
    image: "images/trainer-catarina.webp",
    imageAlt: "Retrato ilustrativo de Catarina Sá, treinadora de spinning.",
  },
  {
    id: "tomas",
    name: "Tomás Ribeiro",
    role: "Treino personalizado e reabilitação funcional",
    specialties: ["Treino personalizado", "Movimento", "Pós-lesão"],
    certifications: [
      "Certificação [NOME DA ENTIDADE] — Treino personalizado",
      "Formação complementar [ENTIDADE A CONFIRMAR]",
    ],
    languages: ["Português", "Inglês"],
    bio: "Tomás trabalha treino individual e progressões de movimento para quem quer regressar à atividade. O seu trabalho é feito em articulação com profissionais de saúde e não substitui avaliação, diagnóstico ou tratamento clínico.",
    image: "images/trainer-tomas.webp",
    imageAlt: "Retrato ilustrativo de Tomás Ribeiro, treinador personalizado.",
  },
];

/* --------------------------------------------------------------------------
   HORÁRIO — 45 sessões semanais.
   spots = lugares livres ilustrativos. Não representam disponibilidade real.
   -------------------------------------------------------------------------- */
const rawSchedule = [
  // Segunda
  [1, "06:45", "funcional", 50, "diogo", "Zona funcional", "Todos os níveis", 6, "m1"],
  [1, "08:00", "forca", 60, "catarina", "Sala de força", "Iniciante", 7, "m2"],
  [1, "12:30", "hiit", 30, "bruno", "Estúdio 1", "Intermédio", 4, "m3"],
  [1, "17:00", "pilates", 50, "marta", "Estúdio 3", "Todos os níveis", 9, "m4"],
  [1, "18:00", "cross", 60, "bruno", "Zona funcional", "Intermédio", 3, "m5"],
  [1, "19:00", "spinning", 45, "catarina", "Estúdio 2", "Todos os níveis", 5, "m6"],
  [1, "20:00", "yoga", 60, "marta", "Estúdio 3", "Todos os níveis", 8, "m7"],
  [1, "21:00", "mobilidade", 40, "marta", "Estúdio 3", "Todos os níveis", 10, "m8"],
  // Terça
  [2, "06:45", "spinning", 45, "catarina", "Estúdio 2", "Todos os níveis", 8, "t1"],
  [2, "08:00", "pilates", 50, "marta", "Estúdio 3", "Todos os níveis", 10, "t2"],
  [2, "12:15", "forca", 60, "diogo", "Sala de força", "Todos os níveis", 6, "t3"],
  [2, "17:45", "boxe", 50, "bruno", "Zona funcional", "Todos os níveis", 5, "t4"],
  [2, "18:45", "hiit", 40, "bruno", "Estúdio 1", "Intermédio", 2, "t5"],
  [2, "19:30", "forca", 60, "catarina", "Sala de força", "Iniciante", 7, "t6"],
  [2, "20:30", "yoga", 60, "marta", "Estúdio 3", "Todos os níveis", 9, "t7"],
  // Quarta
  [3, "06:45", "funcional", 50, "diogo", "Zona funcional", "Todos os níveis", 7, "w1"],
  [3, "09:00", "mobilidade", 40, "marta", "Estúdio 3", "Todos os níveis", 12, "w2"],
  [3, "12:30", "yoga", 45, "marta", "Estúdio 3", "Todos os níveis", 10, "w3"],
  [3, "18:00", "cross", 60, "bruno", "Zona funcional", "Todos os níveis", 4, "w4"],
  [3, "18:30", "spinning", 45, "catarina", "Estúdio 2", "Todos os níveis", 6, "w5"],
  [3, "19:30", "forca", 60, "diogo", "Sala de força", "Intermédio", 5, "w6"],
  [3, "20:30", "pilates", 50, "marta", "Estúdio 3", "Todos os níveis", 11, "w7"],
  // Quinta
  [4, "07:00", "hiit", 40, "bruno", "Estúdio 1", "Intermédio", 5, "q1"],
  [4, "09:30", "pilates", 50, "marta", "Estúdio 3", "Todos os níveis", 9, "q2"],
  [4, "12:30", "boxe", 50, "bruno", "Zona funcional", "Todos os níveis", 8, "q3"],
  [4, "17:30", "spinning", 45, "catarina", "Estúdio 2", "Todos os níveis", 7, "q4"],
  [4, "18:15", "funcional", 50, "diogo", "Zona funcional", "Todos os níveis", 6, "q5"],
  [4, "19:15", "forca", 60, "catarina", "Sala de força", "Iniciante", 8, "q6"],
  [4, "20:15", "mobilidade", 40, "marta", "Estúdio 3", "Todos os níveis", 12, "q7"],
  // Sexta
  [5, "06:45", "forca", 60, "diogo", "Sala de força", "Todos os níveis", 7, "f1"],
  [5, "08:00", "funcional", 50, "diogo", "Zona funcional", "Iniciante", 10, "f2"],
  [5, "12:30", "hiit", 30, "bruno", "Estúdio 1", "Todos os níveis", 6, "f3"],
  [5, "17:30", "boxe", 50, "bruno", "Zona funcional", "Todos os níveis", 4, "f4"],
  [5, "18:30", "spinning", 45, "catarina", "Estúdio 2", "Todos os níveis", 5, "f5"],
  [5, "19:30", "yoga", 60, "marta", "Estúdio 3", "Todos os níveis", 9, "f6"],
  [5, "20:30", "pilates", 50, "marta", "Estúdio 3", "Todos os níveis", 8, "f7"],
  // Sábado
  [6, "09:00", "cross", 60, "bruno", "Zona funcional", "Todos os níveis", 8, "s1"],
  [6, "10:00", "funcional", 50, "diogo", "Zona funcional", "Todos os níveis", 6, "s2"],
  [6, "11:15", "spinning", 45, "catarina", "Estúdio 2", "Todos os níveis", 7, "s3"],
  [6, "12:15", "yoga", 60, "marta", "Estúdio 3", "Todos os níveis", 8, "s4"],
  [6, "13:30", "mobilidade", 40, "marta", "Estúdio 3", "Todos os níveis", 10, "s5"],
  // Domingo
  [0, "09:30", "mobilidade", 40, "marta", "Estúdio 3", "Todos os níveis", 12, "d1"],
  [0, "10:30", "yoga", 60, "marta", "Estúdio 3", "Todos os níveis", 10, "d2"],
  [0, "11:30", "funcional", 50, "diogo", "Zona funcional", "Todos os níveis", 7, "d3"],
  [0, "12:30", "pilates", 50, "marta", "Estúdio 3", "Todos os níveis", 9, "d4"],
];

export const schedule = rawSchedule.map(
  ([day, start, classId, duration, trainerId, room, level, spots, suffix]) => {
    const classItem = classes.find((item) => item.id === classId);
    return {
      id: `session-${suffix}`,
      day,
      start,
      classId,
      name: classItem.name,
      duration,
      trainerId,
      trainerName: trainers.find((item) => item.id === trainerId)?.name ?? "",
      room,
      level,
      spots,
      capacity: Math.max(12, spots + 4),
      demoSpots: true,
    };
  },
);

/* --------------------------------------------------------------------------
   PLANOS
   Preços fictícios, com IVA incluído. Condições sem letras pequenas.
   -------------------------------------------------------------------------- */
export const plans = [
  {
    id: "essencial",
    name: "Essencial",
    tagline: "A base para construíres consistência.",
    description:
      "Para quem quer treinar com autonomia na sala e ter um plano que acompanha a tua evolução.",
    monthly: 29.9,
    annual: 24.9,
    highlight: false,
    badge: "Sala + cardio",
    includes: [
      "Acesso à sala de musculação e cardio",
      "Avaliação física inicial incluída",
      "Plano de treino individual",
      "Horário online e apoio da equipa",
      "Balneários e vestiários",
    ],
    notIncluded: ["Aulas de grupo ilimitadas", "Zona de recuperação"],
    enrollment: "25 € — atualmente oferecida na campanha de adesão",
    commitment: {
      monthly: "Sem fidelização.",
      annual: "12 meses de permanência.",
    },
    cancellation: {
      monthly: "Cancelamento a qualquer momento, com 30 dias de aviso prévio.",
      annual:
        "Cancelamento no fim dos 12 meses com 30 dias de aviso. Antes do fim, aplica-se 30% do valor das mensalidades restantes.",
    },
    suspension:
      "Suspensão até 30 dias por ano, com pedido por escrito e motivo justificado.",
  },
  {
    id: "clube",
    name: "Clube",
    tagline: "Sala, aulas e gente à tua volta.",
    description:
      "O plano mais escolhido por quem quer variar o treino e fazer parte da rotina do clube.",
    monthly: 39.9,
    annual: 33.9,
    highlight: true,
    badge: "Mais completo",
    includes: [
      "Tudo o que inclui o Essencial",
      "Aulas de grupo ilimitadas",
      "Acesso à sala em todo o horário",
      "Avaliação física inicial incluída",
      "Plano de treino individual",
      "Prioridade na marcação de aulas",
    ],
    notIncluded: ["Zona de recuperação incluída", "Sessões de treino acompanhado"],
    enrollment: "25 € — atualmente oferecida na campanha de adesão",
    commitment: {
      monthly: "Sem fidelização.",
      annual: "12 meses de permanência.",
    },
    cancellation: {
      monthly: "Cancelamento a qualquer momento, com 30 dias de aviso prévio.",
      annual:
        "Cancelamento no fim dos 12 meses com 30 dias de aviso. Antes do fim, aplica-se 30% do valor das mensalidades restantes.",
    },
    suspension:
      "Suspensão até 30 dias por ano, com pedido por escrito e motivo justificado.",
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "Acompanhamento e recuperação no mesmo plano.",
    description:
      "Para quem procura uma orientação mais próxima, tempo de recuperação e treino com acompanhamento regular.",
    monthly: 54.9,
    annual: 46.9,
    highlight: false,
    badge: "Acompanhamento",
    includes: [
      "Tudo o que inclui o Clube",
      "2 sessões de treino acompanhado por mês",
      "Acesso à zona de recuperação: sauna e massagem de recuperação",
      "1 convite mensal para um amigo",
      "Avaliação física de progresso trimestral",
      "Plano de treino revisto mensalmente",
    ],
    notIncluded: [],
    enrollment: "25 € — atualmente oferecida na campanha de adesão",
    commitment: {
      monthly: "Sem fidelização.",
      annual: "12 meses de permanência.",
    },
    cancellation: {
      monthly: "Cancelamento a qualquer momento, com 30 dias de aviso prévio.",
      annual:
        "Cancelamento no fim dos 12 meses com 30 dias de aviso. Antes do fim, aplica-se 30% do valor das mensalidades restantes.",
    },
    suspension:
      "Suspensão até 30 dias por ano, com pedido por escrito e motivo justificado.",
  },
];

export const comparisonRows = [
  { label: "Sala de musculação e cardio", values: [true, true, true] },
  { label: "Aulas de grupo ilimitadas", values: [false, true, true] },
  { label: "Avaliação física inicial", values: [true, true, true] },
  { label: "Plano de treino individual", values: [true, true, true] },
  { label: "Horário e reservas online", values: [true, true, true] },
  { label: "Balneários e vestiários", values: [true, true, true] },
  { label: "Zona de recuperação", values: [false, false, true] },
  { label: "Treino acompanhado por mês", values: [false, false, "2 sessões"] },
  { label: "Convidado mensal", values: [false, false, "1 por mês"] },
  { label: "Revisão trimestral", values: [false, false, true] },
];

export const extras = [
  {
    id: "personal-1",
    category: "Treino personalizado",
    name: "Sessão individual",
    price: "45 €",
    detail: "60 min, com plano de sessão e feedback da equipa técnica.",
  },
  {
    id: "personal-5",
    category: "Treino personalizado",
    name: "Pack de 5 sessões",
    price: "200 €",
    detail: "40 €/sessão. Validade de 3 meses. Inclui revisão do plano.",
  },
  {
    id: "personal-10",
    category: "Treino personalizado",
    name: "Pack de 10 sessões",
    price: "360 €",
    detail: "36 €/sessão. Validade de 6 meses. Inclui avaliação de progresso.",
  },
  {
    id: "estudante",
    category: "Estudantes",
    name: "Desconto estudante",
    price: "-15%",
    detail:
      "Nos planos Essencial e Clube. Mediante comprovativo de matrícula válido. Não acumulável.",
  },
  {
    id: "casal",
    category: "Casal",
    name: "Plano casal",
    price: "-10%",
    detail:
      "No segundo membro, nos planos Clube ou Pro. Ambos com adesão ativa e mesma morada.",
  },
  {
    id: "convidado",
    category: "Convidado",
    name: "Visita de um dia",
    price: "10 €",
    detail:
      "Acesso à sala e aulas do dia, sujeito a marcação. Valor descontado se aderires num prazo de 7 dias.",
  },
];

/* --------------------------------------------------------------------------
   QUIZ — Encontra o teu plano
   -------------------------------------------------------------------------- */
export const quizQuestions = [
  {
    id: "objetivo",
    number: "01",
    title: "O que te trouxe até aqui?",
    helper: "Não há resposta certa. Escolhe o que está mais próximo de ti.",
    options: [
      { value: "forca", label: "Ganhar força e confiança", hint: "Treino com cargas e padrões básicos" },
      { value: "resistencia", label: "Melhorar a condição física", hint: "Cardio, fôlego e energia no dia a dia" },
      { value: "mobilidade", label: "Mover-me com mais liberdade", hint: "Mobilidade, postura e recuperação" },
      { value: "iniciantes", label: "Começar do zero", hint: "Quero aprender com acompanhamento" },
    ],
  },
  {
    id: "frequencia",
    number: "02",
    title: "Quantas vezes por semana queres treinar?",
    helper: "Podes ajustar a frequência em qualquer altura.",
    options: [
      { value: "1-2", label: "1 a 2 vezes", hint: "Uma rotina que caiba na semana" },
      { value: "3-4", label: "3 a 4 vezes", hint: "Consistência com espaço para recuperar" },
      { value: "5+", label: "5 ou mais", hint: "Treino muito presente na rotina" },
    ],
  },
  {
    id: "preferencia",
    number: "03",
    title: "Onde te imaginas a treinar?",
    helper: "Podes combinar os dois em qualquer plano Clube ou Pro.",
    options: [
      { value: "sala", label: "Na sala de musculação", hint: "Treino com o meu plano, ao meu ritmo" },
      { value: "aulas", label: "Em aulas de grupo", hint: "Sessões guiadas e energia de equipa" },
      { value: "ambos", label: "Um pouco de ambos", hint: "Variar entre sala e aulas" },
    ],
  },
  {
    id: "horario",
    number: "04",
    title: "Quando é mais fácil treinares?",
    helper: "Usamos isto para sugerir aulas que encaixam no teu dia.",
    options: [
      { value: "manha", label: "De manhã", hint: "Antes do trabalho ou do estudo" },
      { value: "almoco", label: "Na hora de almoço", hint: "Sessões curtas entre compromissos" },
      { value: "tarde", label: "À tarde", hint: "Meio da tarde e fim de tarde" },
      { value: "noite", label: "À noite", hint: "Depois do trabalho" },
    ],
  },
];

/* --------------------------------------------------------------------------
   INSTALAÇÕES
   -------------------------------------------------------------------------- */
export const facilities = [
  {
    id: "musculacao",
    number: "01",
    name: "Sala de musculação",
    area: 320,
    summary: "Máquinas, pesos livres e espaço para treinar com plano.",
    description:
      "Uma sala ampla, com zonas distintas para máquinas, pesos livres e trabalho de força. A equipa está disponível para ajudar a ajustar cargas, encontrar material e tirar dúvidas sobre o teu plano.",
    equipment: [
      "Halteres de 1 a 50 kg",
      "Barras, discos e racks",
      "Máquinas de força e cabos",
      "Bancos ajustáveis e plataformas",
    ],
    image: "images/facility-musculacao.webp",
    imageAlt: "Corredor de halteres e equipamento numa sala de musculação.",
    imageCredit: "Fotografia ilustrativa Unsplash",
  },
  {
    id: "funcional",
    number: "02",
    name: "Zona funcional",
    area: 260,
    summary: "O chão para saltar, puxar, carregar e improvisar.",
    description:
      "Uma área aberta para treino funcional, cross training e boxe fitness. O material está organizado por estações para que as aulas e o treino autónomo possam decorrer em segurança.",
    equipment: [
      "Kettlebells e wall balls",
      "Cordas de batalha e cordas de salto",
      "Sacos de pancada e luvas de empréstimo",
      "Espaço de pista e pneus de treino",
    ],
    image: "images/facility-funcional.webp",
    imageAlt: "Grupo a treinar numa zona funcional ampla e industrial.",
    imageCredit: "Fotografia ilustrativa Unsplash",
  },
  {
    id: "estudio",
    number: "03",
    name: "Estúdio de aulas",
    area: 210,
    summary: "Yoga, pilates e mobilidade com luz e som controlados.",
    description:
      "O estúdio principal tem capacidade para aulas de grupo intimistas, com tapetes, blocos, bolas e faixas. A iluminação é regulável e a acústica foi pensada para que ouças o treinador sem esforço.",
    equipment: [
      "Tapetes e blocos",
      "Bolas e faixas elásticas",
      "Steps e barras de apoio",
      "Sistema de som e luz regulável",
    ],
    image: "images/facility-estudio.webp",
    imageAlt: "Aula de grupo em estúdio, com posturas de alongamento em tapetes.",
    imageCredit: "Fotografia ilustrativa Unsplash",
  },
  {
    id: "cardio",
    number: "04",
    name: "Zona de cardio",
    area: 180,
    summary: "Para aquecer, treinar fôlego ou simplesmente andar.",
    description:
      "Treadmills, bikes, remo e elípticas alinhados numa zona própria. Podes integrar o cardio no teu plano ou usá-lo como aquecimento antes da sala de musculação.",
    equipment: [
      "Treadmills",
      "Bicicletas verticais",
      "Remos e elípticas",
      "Máquinas de escadas",
    ],
    image: "images/facility-cardio.webp",
    imageAlt: "Máquinas de cardio alinhadas junto a janelas amplas.",
    imageCredit: "Fotografia ilustrativa Unsplash",
  },
  {
    id: "balnearios",
    number: "05",
    name: "Balneários",
    area: 130,
    summary: "Vestiários, duches e cacifos para treinar e seguir.",
    description:
      "Balneários com duches individuais, cacifos de uso diário e espaço para mudar de roupa. Pede um cadeado na receção ou traz o teu. O espaço é partilhado: deixamos tudo como gostaríamos de encontrar.",
    equipment: [
      "Duches individuais",
      "Cacifos de uso diário",
      "Bancos e espelhos",
      "Secadores de cabelo",
    ],
    image: "images/facility-balnearios.webp",
    imageAlt: "Casa de banho com lavatório, espelho e duche, imagem ilustrativa.",
    imageCredit: "Fotografia ilustrativa Unsplash",
  },
  {
    id: "recuperacao",
    number: "06",
    name: "Zona de recuperação",
    area: 100,
    summary: "Sauna e massagem de recuperação, com marcação.",
    description:
      "Um espaço mais tranquilo para desacelerar depois do treino. A sauna está incluída no plano Pro; a massagem de recuperação é marcada à parte e pode ser adquirida por sessão. Não substitui acompanhamento médico.",
    equipment: [
      "Sauna",
      "Mesa de massagem de recuperação",
      "Área de descanso",
      "Duche adjacente",
    ],
    image: "images/facility-recuperacao.webp",
    imageAlt: "Mãos a aplicar pedras quentes numa massagem de recuperação.",
    imageCredit: "Fotografia ilustrativa Unsplash",
  },
];

export const facilityRules = [
  {
    title: "Toalha sempre",
    text: "Traz uma toalha limpa e usa-a nos bancos e máquinas. É o mínimo de higiene para todos.",
  },
  {
    title: "Devolve ao lugar",
    text: "Halteres, discos e acessórios voltam ao suporte depois do uso. Facilita a próxima pessoa e mantém o chão seguro.",
  },
  {
    title: "Partilha o equipamento",
    text: "Se alguém está à espera, permite a partilha entre séries. O treino de todos fica melhor.",
  },
  {
    title: "Respeita o foco",
    text: "Fala baixo nos balneários e mantém chamadas em viva-voz fora das salas de treino.",
  },
  {
    title: "Avisa a equipa",
    text: "Equipamento danificado ou uma dúvida sobre técnica? Diz-nos. Não improvises com material partido.",
  },
  {
    title: "Sem julgamentos",
    text: "Cada pessoa está num ponto diferente do percurso. O respeito pelo espaço e pelo ritmo do outro não é negociável.",
  },
];

/* --------------------------------------------------------------------------
   FAQ
   -------------------------------------------------------------------------- */
export const faqs = [
  {
    id: "experiencia",
    category: "Primeiros passos",
    question: "Preciso de experiência para começar?",
    answer:
      "Não. A maioria das pessoas que entra na FORJA pela primeira vez não tem experiência recente de ginásio. A aula experimental inclui uma apresentação do espaço e, se escolheres visita e avaliação, uma conversa inicial para perceber o teu ponto de partida. Todas as aulas têm opções para iniciantes.",
  },
  {
    id: "experimental",
    category: "Primeiros passos",
    question: "Como funciona a aula experimental gratuita?",
    answer:
      "Escolhes uma aula do horário ou uma visita com avaliação inicial. Chegas 15 minutos antes, conheces a equipa e o espaço, e participas no formato escolhido, com adaptações se necessário. A experiência é gratuita e não obriga a aderir. Não é uma avaliação clínica.",
  },
  {
    id: "fidelizacao",
    category: "Planos",
    question: "Há fidelização?",
    answer:
      "O plano mensal não tem fidelização. O plano anual tem 12 meses de permanência e uma mensalidade mais baixa. Todas as condições, incluindo cancelamento e suspensão, estão visíveis na página Planos antes de aderires.",
  },
  {
    id: "cancelamento",
    category: "Planos",
    question: "Como posso cancelar o meu plano?",
    answer:
      "Envia um pedido por escrito para ola@forja.pt ou entrega-o na receção. No plano mensal, o cancelamento produz efeitos 30 dias após o pedido. No plano anual, podes terminar no fim dos 12 meses; antes disso aplicam-se as condições de cancelamento antecipado indicadas na página Planos.",
  },
  {
    id: "suspensao",
    category: "Planos",
    question: "Posso suspender o plano?",
    answer:
      "Sim, até 30 dias por ano, com pedido por escrito e motivo justificado, como doença, viagem prolongada ou motivo profissional. A suspensão não apaga a fidelização contratual. Fala com a receção para enquadrar o teu caso.",
  },
  {
    id: "equipamento",
    category: "Aulas",
    question: "Que equipamento devo levar?",
    answer:
      "Roupa desportiva confortável, ténis com apoio, garrafa de água e toalha. Para yoga e pilates, temos tapetes e material de apoio; podes trazer o teu tapete se preferires. Para boxe, temos luvas de empréstimo enquanto houver disponibilidade.",
  },
  {
    id: "estacionamento",
    category: "Acesso",
    question: "Há estacionamento?",
    answer:
      "Sim, existe estacionamento nas imediações da Avenida da Liberdade. A informação sobre parque público e acessos de autocarro está na página Contactos e deve ser confirmada antes da visita, porque pode mudar.",
  },
  {
    id: "lesao",
    category: "Saúde e treino",
    question: "Posso treinar com uma lesão?",
    answer:
      "Depende da situação. Se estás a recuperar de uma lesão, fala primeiro com o teu médico ou fisioterapeuta. A equipa da FORJA pode adaptar o treino em articulação com esses profissionais, mas não substitui diagnóstico, tratamento ou avaliação clínica. A informação de saúde no formulário é opcional e confidencial.",
  },
  {
    id: "estudantes",
    category: "Planos",
    question: "Há descontos para estudantes?",
    answer:
      "Sim, há 15% de desconto nos planos Essencial e Clube, mediante comprovativo de matrícula válido. O desconto não é acumulável com outras campanhas. Apresenta o comprovativo na receção ou envia-o para ola@forja.pt.",
  },
  {
    id: "reservas",
    category: "Aulas",
    question: "Como funcionam as reservas das aulas?",
    answer:
      "Neste site de demonstração, podes explorar o horário e simular uma marcação. Numa versão em produção, cada aula teria confirmação própria e política de cancelamento. Até 24 horas antes, fala com a equipa por telefone ou WhatsApp para alterar uma marcação.",
  },
  {
    id: "visita",
    category: "Primeiros passos",
    question: "Posso visitar antes de decidir?",
    answer:
      "Sim. Escolhe a opção Visita e avaliação sem aula em Experimenta, ou passa pela receção durante o horário de funcionamento. A visita inclui uma conversa sobre os teus objetivos e uma apresentação das instalações.",
  },
  {
    id: "inclusao",
    category: "Comunidade",
    question: "Que ambiente encontro na FORJA?",
    answer:
      "Um ginásio de adultos com idades e percursos diferentes. Não há códigos de roupa, culto de corpo ou competição interna. Há pessoas a levantar pela primeira vez, pessoas com rotinas há anos e uma equipa que está presente em vez de apenas vigiar.",
  },
];

/* --------------------------------------------------------------------------
   HISTÓRIA E EVENTOS
   -------------------------------------------------------------------------- */
export const timeline = [
  {
    year: "2017",
    title: "A porta abre",
    text: "Diogo Fernandes e Marta Cerqueira abrem a FORJA na Avenida da Liberdade, com uma ideia simples: treino acompanhado, sem julgamentos.",
  },
  {
    year: "2019",
    title: "A comunidade cresce",
    text: "As primeiras turmas fixas de funcional e yoga esgotam. A equipa cresce para acompanhar quem quer treinar com mais consistência.",
  },
  {
    year: "2022",
    title: "1 200 m² de casa",
    text: "O clube ganha o estúdio de aulas e a zona de recuperação. A mesma equipa, mais espaço e mais horários.",
  },
  {
    year: "2024",
    title: "Fora de portas",
    text: "Começa o treino mensal ao ar livre no Parque da Ponte e o Desafio Trimestral FORJA, focado em consistência e técnica.",
  },
  {
    year: "2026",
    title: "Continuar a construir",
    text: "Novos horários, mais oferta de aulas e o mesmo compromisso: cada pessoa com um ponto de partida, não com um padrão exterior.",
  },
];

export const values = [
  {
    number: "01",
    title: "Inclusão na prática",
    text: "Todos os níveis, corpos e pontos de partida. Ajustamos o exercício, não a pessoa.",
  },
  {
    number: "02",
    title: "Progressão sem pressa",
    text: "Construímos técnica e consistência antes de aumentar carga. O progresso é comparado contigo, não com o vizinho.",
  },
  {
    number: "03",
    title: "Comunidade sem palco",
    text: "Ninguém tem de provar nada. O ambiente é de apoio, não de competição.",
  },
  {
    number: "04",
    title: "Segurança em primeiro",
    text: "Avaliação inicial, instruções claras e adaptação. Casos clínicos são encaminhados para profissionais de saúde.",
  },
];

/* --------------------------------------------------------------------------
   UTILITÁRIOS DE DATA E ABERTURA
   -------------------------------------------------------------------------- */
const pad = (value) => String(value).padStart(2, "0");

export function toISODate(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function fromISODate(iso) {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(year, month - 1, day, 12, 0, 0, 0);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function addDays(date, amount) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + amount);
  copy.setHours(12, 0, 0, 0);
  return copy;
}

export function startOfWeek(date = new Date()) {
  const copy = new Date(date);
  const weekday = copy.getDay();
  const diff = weekday === 0 ? -6 : 1 - weekday;
  copy.setDate(copy.getDate() + diff);
  copy.setHours(12, 0, 0, 0);
  return copy;
}

export function formatDateLong(date) {
  return new Intl.DateTimeFormat("pt-PT", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(date);
}

export function formatDateShort(date) {
  return new Intl.DateTimeFormat("pt-PT", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  })
    .format(date)
    .replace(/\./g, "")
    .replace(/^./, (letter) => letter.toUpperCase());
}

export function formatDateNumeric(date) {
  return new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function minutesFromTime(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function endTime(start, duration) {
  const total = minutesFromTime(start) + Number(duration);
  return `${pad(Math.floor(total / 60) % 24)}:${pad(total % 60)}`;
}

export function getHoursForDate(date) {
  const iso = toISODate(date);
  if (holidays[iso]) return { ...openingHours[2], holiday: holidays[iso] };
  const day = date.getDay();
  return openingHours.find((item) => item.days.includes(day)) ?? openingHours[2];
}

function formatClock(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins === 0 ? `${hours}h` : `${hours}h${pad(mins)}`;
}

/**
 * Calcula se o clube está aberto agora e quando abre/fecha a seguir.
 * Horários e feriados são os definidos acima. Hora local do dispositivo.
 */
export function getOpenStatus(now = new Date()) {
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const todayHours = getHoursForDate(now);
  const todayOpen = minutesFromTime(todayHours.open);
  const todayClose = minutesFromTime(todayHours.close);

  if (nowMinutes >= todayOpen && nowMinutes < todayClose) {
    return {
      open: true,
      label: "Aberto agora",
      detail: `Fecha às ${formatClock(todayClose)}`,
      daysAhead: 0,
    };
  }

  for (let offset = 0; offset < 8; offset += 1) {
    const candidate = addDays(now, offset);
    const candidateHours = getHoursForDate(candidate);
    const candidateOpen = minutesFromTime(candidateHours.open);
    const candidateClose = minutesFromTime(candidateHours.close);
    if (offset === 0 && nowMinutes >= candidateClose) continue;
    if (offset === 0 && nowMinutes >= candidateOpen && nowMinutes < candidateClose) {
      continue;
    }
    if (offset > 0 || nowMinutes < candidateOpen) {
      const when =
        offset === 0
          ? "hoje"
          : offset === 1
            ? "amanhã"
            : dayNames[candidate.getDay()].toLowerCase();
      return {
        open: false,
        label: "Fechado",
        detail: `Abre ${when} às ${formatClock(candidateOpen)}`,
        daysAhead: offset,
      };
    }
  }

  return {
    open: false,
    label: "Fechado",
    detail: "Consulta o horário",
    daysAhead: 0,
  };
}

export function getClass(id) {
  return classes.find((item) => item.id === id) ?? null;
}

export function getTrainer(id) {
  return trainers.find((item) => item.id === id) ?? null;
}

export function getSession(id) {
  return schedule.find((item) => item.id === id) ?? null;
}

export function getSessionsForClass(classId, limit = Infinity) {
  return schedule
    .filter((session) => session.classId === classId)
    .slice(0, limit);
}

export function getSessionsForTrainer(trainerId) {
  return schedule.filter((session) => session.trainerId === trainerId);
}

export function getPeriod(start) {
  const minutes = minutesFromTime(start);
  if (minutes < 12 * 60) return "manha";
  if (minutes < 14 * 60) return "almoco";
  if (minutes < 18 * 60) return "tarde";
  return "noite";
}

/**
 * Devolve a próxima data em que a sessão recorrente acontece.
 * Ignora a hora de início no próprio dia quando includeToday = false.
 */
export function getNextSessionDate(session, from = new Date(), includeToday = false) {
  const base = new Date(from);
  base.setHours(0, 0, 0, 0);
  for (let offset = 0; offset < 21; offset += 1) {
    const candidate = addDays(base, offset);
    if (candidate.getDay() !== session.day) continue;
    if (offset === 0 && !includeToday) {
      const [hours, minutes] = session.start.split(":").map(Number);
      const start = new Date(candidate);
      start.setHours(hours, minutes, 0, 0);
      if (start <= from) continue;
    }
    return candidate;
  }
  return null;
}

export function getUpcomingSessionsForClass(classId, limit = 3, from = new Date()) {
  const sessions = schedule.filter((item) => item.classId === classId);
  const upcoming = [];
  for (const session of sessions) {
    const date = getNextSessionDate(session, from);
    if (date) upcoming.push({ session, date });
  }
  return upcoming
    .sort((a, b) => {
      const aValue = a.date.getTime() + minutesFromTime(a.session.start) * 60000;
      const bValue = b.date.getTime() + minutesFromTime(b.session.start) * 60000;
      return aValue - bValue;
    })
    .slice(0, limit);
}

export function getTodaySessions(from = new Date()) {
  const today = from.getDay();
  const nowMinutes = from.getHours() * 60 + from.getMinutes();
  return schedule
    .filter((session) => session.day === today)
    .filter((session) => minutesFromTime(session.start) >= nowMinutes)
    .sort((a, b) => minutesFromTime(a.start) - minutesFromTime(b.start));
}

export function formatPrice(value) {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(value);
}

export const scheduleCount = schedule.length;
export const trainerCount = trainers.length;
export const yearsActive = new Date().getFullYear() - site.founded;

export const classById = Object.fromEntries(classes.map((item) => [item.id, item]));
export const trainerById = Object.fromEntries(trainers.map((item) => [item.id, item]));
