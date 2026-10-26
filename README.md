# FORJA Training Club — site demonstrativo

Site estático, responsivo e sem dependências de framework para a FORJA Training Club, um ginásio em Braga. O conceito visual é uma oficina de treino industrial: tipografia condensada, grelha técnica, cortes retos, alternância de superfícies claras/escuras e azul reservado a ações, foco e números.

## Publicação

- **Produção:** [forja-training-club.vercel.app](https://forja-training-club.vercel.app)
- **Repositório público:** [github.com/MateusMendes17/forja-training-club](https://github.com/MateusMendes17/forja-training-club)
- A Vercel está ligada ao repositório e ao branch `main`; cada novo push para `main` pode gerar um deployment de produção.
- `404.html` é servida pela Vercel com o estado HTTP 404. Usa `<base href="/">` para que estilos, scripts e links resolvam a partir da raiz em qualquer endereço inválido. Deve ser mantida essa condição ao publicar em subdiretórios.
- O URL acima é também o domínio canónico usado no HTML, Open Graph, JSON-LD, `sitemap.xml` e `robots.txt`.

## Requisitos

- Um browser moderno com suporte a ES modules, `dialog`, `details` e `IntersectionObserver`.
- Um servidor HTTP local. Abrir os ficheiros com duplo clique não permite carregar os módulos JavaScript.
- Python 3 é a forma mais simples de arrancar o servidor. Não há build, npm install nem backend.

## Arrancar localmente

No PowerShell, a partir da raiz do projeto:

```powershell
python -m http.server 8000
```

Depois abre `http://127.0.0.1:8000/`.

Também pode ser usado `npx serve .` ou qualquer servidor estático equivalente. A porta é indiferente; mantém o servidor a correr a partir da raiz, para que `css/`, `js/` e `images/` resolvam.

## Estrutura

```text
.
├── index.html              Página inicial
├── 404.html                Página de erro servida em endereços inexistentes (noindex)
├── horario.html            Horário semanal e diário, filtros, ICS, impressão
├── planos.html             Planos, comparação, extras e questionário
├── aulas.html              Catálogo pesquisável de nove aulas
├── aula.html               Detalhe dinâmico de aula via ?id=...
├── treinadores.html        Equipa, cinco perfis em diálogo
├── instalacoes.html        Seis zonas, regras e lightbox
├── sobre.html              História, manifesto e comunidade
├── experimenta.html        Formulário de experiência em três passos
├── contactos.html          Contactos, horário, formulário e mapa esquemático
├── faq.html                Perguntas frequentes pesquisáveis
├── privacidade.html        Política de privacidade modelo
├── cookies.html            Política de cookies modelo
├── termos.html             Termos e condições modelo
├── design-system.html      Inventário visual interno (noindex)
├── css/
│   ├── style.css           Tokens, layout, componentes e media queries
│   └── print.css           Impressão do horário, planos, FAQ e documentos
├── js/
│   ├── data.js             Conteúdo central e utilitários
│   ├── ui.js               Chrome partilhado, cookies, movimento, diálogos e eventos
│   ├── components.js       Markup reutilizável de cartões e FAQ
│   ├── main.js             Arranque e encaminhamento por data-page
│   ├── home.js, schedule.js, plans.js, quiz.js, classes.js, trainers.js,
│   ├── facilities.js, trial.js, contact.js, faq.js, design.js, head.js
├── images/                 Imagens locais WebP, OG e favicon
├── sitemap.xml
└── robots.txt
```

O HTML expõe `body[data-page]`; `js/main.js` importa apenas o módulo dessa página. O cabeçalho, o menu mobile, o rodapé, a barra inferior, o banner de cookies, o WhatsApp flutuante, o botão de topo e as notificações são injetados por `js/ui.js` em elementos `.site-header` e `.site-footer`.

## Onde editar conteúdo

- **Conteúdo estruturado principal:** `js/data.js`. Aí estão a identidade, contactos, horário de funcionamento, nove aulas, 45 sessões semanais, três planos, cinco treinadores, seis zonas, regras, 12 FAQs e o questionário de planos.
- **Textos editoriais estáticos:** `sobre.html` (história, manifesto, comunidade), páginas legais, hero sections das páginas e alguns textos de apoio. Estes textos não são gerados pelo modelo de dados.
- **Componentes gerados:** `js/classes.js`, `js/trainers.js`, `js/facilities.js`, `js/faq.js`, `js/trial.js` e `js/contact.js` contêm o markup específico das páginas. Os cartões reutilizáveis de home/aulas/planos/treinadores estão em `js/components.js`.
- **Design:** tokens no topo de `css/style.css` (cores, fontes, espaçamentos, header, foco). A página `design-system.html` documenta os componentes e serve para controlo visual.
- **Imagens:** `images/`. As imagens atuais são ilustrativas e provêm de bancos de imagens; devem ser substituídas por fotografia própria com direitos confirmados e texto alternativo adequado.

### Dados que devem ser substituídos

- O domínio público da demonstração é `https://forja-training-club.vercel.app`. Se for configurado um domínio próprio, substituir esse URL nas referências canónicas e de Open Graph das páginas, em `js/classes.js`, `js/data.js`, `js/schedule.js`, `js/trial.js`, `sitemap.xml`, `robots.txt` e no JSON-LD. O CSS não contém URLs de domínio.
- Nome da entidade, NIPC, sede, email de privacidade, encarregado de proteção de dados e demais campos entre `[ ]` nas páginas legais.
- Telefone `253 456 789`, WhatsApp `916 789 012`, email `ola@forja.pt`, Instagram e morada. Os dados centrais estão em `js/data.js`, mas existem cópias em texto nos formulários/página de contactos que devem ser atualizadas em conjunto.
- Certificações e biografias dos treinadores. As certificações contêm deliberadamente `[NOME DA ENTIDADE]` e `[ENTIDADE A CONFIRMAR]`.
- Preços, inscrição, campanhas, condições de fidelização e cancelamento dos planos.
- Horário de aulas e disponibilidade. As sessões em `schedule` são uma grelha semanal recorrente, não reservas reais.
- Nomes, idades, testemunhos, números e eventos da história/comunidade, se não forem confirmados.

## Impressão e exportações

- `css/print.css` remove navegação, barras, ações e imagens decorativas. O horário imprime a vista atual: na vista de semana imprime os sete dias; na vista de dia imprime apenas o dia selecionado, já com os filtros ativos. As respostas de FAQ impressas ficam abertas. As páginas legais e de planos têm regras próprias.
- O horário gera um ficheiro `.ics` local no browser, sem servidor.
- O formulário de experiência gera um `.ics` de demonstração após a confirmação simulada.
- Nenhum ficheiro `.ics` cria uma reserva. É apenas um evento de calendário local.

## Simulações e pontos de integração

Estas áreas funcionam localmente e devem ser ligadas a serviços reais antes de produção:

1. **Disponibilidade e reservas.** `js/data.js` define 45 sessões recorrentes; `spots` e `demoSpots` são simulados. Não há autenticação, lista de espera, cancelamento, pagamento ou emails. O formulário de experiência (`js/trial.js`) valida tudo no browser e mostra uma confirmação local.
2. **Formulário de contacto.** `js/contact.js` valida e mostra uma confirmação simulada. Não há pedido HTTP. Para produção, criar endpoint server-side com validação, limitação de tentativas, antispam, confirmação de email e política de retenção. Não guardar informação de saúde sem base e segurança adequadas.
3. **Newsletter.** O formulário do rodapé em `js/ui.js` mostra uma confirmação local; não subscreve ninguém. Ligar a um fornecedor com double opt-in e registo de consentimento.
4. **Mapa.** `contactos.html` usa um mapa esquemático em SVG; não há iframe de terceiros. Se for usado Google Maps/OpenStreetMap incorporado, atualizar a política de cookies/privacidade e, se necessário, o consentimento.
5. **Análise.** `trackEvent()` em `js/ui.js` só emite o evento interno `forja:analytics` depois de a escolha de cookies ser `analytics`. Não existe fornecedor ligado. O ponto de integração está comentado na função. Qualquer fornecedor deve ser carregado apenas após consentimento e documentado em `cookies.html`.
6. **Pagamentos e adesão.** Não existem pagamentos, faturação ou contrato online. O questionário de planos apenas recomenda um plano com preços locais. Integrar software de sócios/pagamentos e rever as condições contratuais.
7. **Mapa de contactos e horário de abertura.** O estado “Aberto/Fechado” do cabeçalho é calculado localmente com o horário de `js/data.js`. Feriados e alterações excecionais devem ser configurados na fonte de verdade.
8. **Fonte externa.** O CSS importa Anton e DM Sans do Google Fonts. Para privacidade e desempenho, auto-alojar os ficheiros de fonte e remover os `preconnect` do HTML. O pedido atual pode comunicar o IP ao fornecedor; está mencionado na política de cookies.

## Acessibilidade e comportamento

- Skip link no início de todas as páginas, foco visível azul, landmarks semânticos e navegação por teclado.
- Diálogos nativos com gestão de foco; lightbox com setas esquerda/direita; acordeão FAQ com `details`/`summary`.
- Formulários com etiquetas, instruções, erros associados, resumo de erros, `aria-invalid` e anúncios `aria-live`.
- Imagens com `alt`, `width` e `height`; imagens abaixo da dobra com `loading="lazy"`.
- Movimento reduzido: o marquee e as revelações são neutralizados; a navegação não depende de animação.
- Estados e conteúdo não dependem apenas de cor; alvos de toque e contrastes foram escolhidos para WCAG AA.
- O site usa `prefers-reduced-motion`, `IntersectionObserver` e listeners passivos onde aplicável.

## Testes manuais recomendados

1. Em desktop, tablet e mobile (320, 390, 768, 1024 e 1440 px), abrir todas as páginas com a consola limpa e verificar que não há scroll horizontal da página. Os scrolls internos do horário e da tabela de planos são intencionais.
2. Em `horario.html`, testar pesquisa, filtros combinados, vista semana/dia, URL refletido, modal, ficheiro ICS e impressão. Confirmar o estado vazio.
3. Em `planos.html`, alternar mensal/anual, confirmar o URL `?periodo=anual`, comparar planos e concluir o questionário.
4. Em `aulas.html`, filtrar por objetivo, nível e treinador; abrir uma aula; testar um `id` inválido em `aula.html?id=nao-existe`.
5. Em `treinadores.html`, abrir perfis por clique e por hash (`#diogo`, `#marta`); fechar com Escape e confirmar o regresso de foco.
6. Em `instalacoes.html`, abrir a lightbox, navegar com setas, fechar e confirmar o foco. Testar links `#musculacao`.
7. Em `experimenta.html`, tentar avançar sem aula, preencher os três passos, confirmar sem consentimento, depois com consentimento. Testar `?sessao=session-m1&data=...` e confirmar a coerência entre sessão e dia. Testar o `.ics`.
8. Em `contactos.html`, testar validação, confirmação simulada, links de email/telefone/WhatsApp e o mapa esquemático.
9. Em `faq.html`, pesquisar, filtrar por tema, limpar e usar o acordeão apenas com teclado.
10. Em todas as páginas, verificar o banner de cookies, a escolha de análise, o reset em `cookies.html`, o menu mobile e os links legais.
11. Abrir um caminho inexistente, por exemplo `/pagina-inexistente`, e confirmar o estado HTTP 404, a página personalizada, os estilos, os atalhos e a ausência de overflow em desktop e mobile. Em produção, a Vercel serve `404.html`.

**Nota:** `404.html` e `design-system.html` são intencionalmente `noindex` e não estão no sitemap. A versão PT/EN não foi implementada; o site está integralmente em pt-PT.

## Conteúdo legal

`privacidade.html`, `cookies.html` e `termos.html` são **modelos editoriais**. Não são aconselhamento jurídico, não constituem contratos finais e contêm campos entre parênteses retos. Antes de publicar:

- confirmar entidade, NIPC, sede, DPO e contactos de privacidade;
- validar bases legais, prazos de conservação, subcontratantes e transferências internacionais;
- descrever os cookies e serviços efetivamente usados, incluindo o alojamento das fontes;
- validar condições de adesão, pagamentos, cancelamento, seguro e resolução de litígios;
- obter revisão por jurista e testar os fluxos reais de consentimento e exercício de direitos.

Nesta demonstração, os formulários não enviam dados, a análise não tem fornecedor e o mapa é esquemático. Se estes elementos mudarem, os documentos legais têm de mudar com eles.

## Créditos

As fotografias são ilustrativas, provenientes de Unsplash, e estão guardadas localmente em WebP. Os créditos genéricos aparecem no interface; antes de produção, substituir por fotografia própria ou manter os créditos exigidos pelas licenças aplicáveis.
