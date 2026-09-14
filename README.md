# astra3dany — um mundo 3D pra ensinar qualquer coisa

Um "mundo de aprendizagem" em miniatura, no browser: três estações, um mascote-guia, um World Tour ritmado e exploração livre.
Cada estação mostra **uma ideia acontecendo** (antes → depois) com um card que explica o que você vê, o que está acontecendo e o que lembrar.

O primeiro mundo ensina **"IA no dia a dia: três hábitos que evitam problemas"**, em português, pra adultos que começam a usar IA no trabalho:

| # | Estação | Hábito | O que acontece |
|---|---|---|---|
| 01 | O portão | Confirme antes de agir | Um pedido é barrado e vai pra revisão; o segundo passa na checagem, o portão abre e a ação roda |
| 02 | As gavetas | Dê contexto onde a IA lê | O card de instruções entra na gaveta do projeto e os dois colegas ficam conectados |
| 03 | A conferência | Confira a fonte | O formato passa; a conferência corrige o total de 100 pra 90 e deixa a data em aberto |

Segue a receita do field guide **Build a Learning World** (Mark Kashef, comunidade Early AI Adopters): seis partes, ritmo de câmera *chegar → aproximar → demonstrar → segurar*, cards sincronizados e checklist de aceite. O material de estudo completo está em [`docs/`](docs/00-INDICE.md); a síntese em [`docs/05-sintese.md`](docs/05-sintese.md); o plano em [`PLANO.md`](PLANO.md); as evidências de inspeção em [`evidence/revisao.md`](evidence/revisao.md).

## Rodar

```bash
cd game
npm ci
npm run dev        # http://127.0.0.1:43220
npm test           # timeline e cues do tour (node --test)
npm run build      # gera game/dist (base ./, serve de qualquer pasta)
npm run preview    # http://127.0.0.1:43221 — inspeciona o build de produção
```

Acrescente `?diagnostics` à URL pra ver fps, p95 e resolução de render no canto do palco.

Stack: Vite 8.2.2 + Babylon.js 9.25.0 (mesmas versões do projeto de referência). Sem backend, sem IA ao vivo: as demonstrações são animações determinísticas.

## Como usar

- **World Tour**: ~60 s. Chegada (3 s) → aproximação (3 s) → demonstração (6 s) → resultado parado (5 s) por estação, depois o recap. Pausar/Retomar, Reiniciar, 0,75×/1×, Sair (ou Esc). O card à direita (embaixo, no celular) acompanha a ação; a cena é renderizada ao lado do card, nunca por baixo dele.
- **Explorar**: clique num pedestal (ou nos botões 01/02/03). "Ver de perto e rodar" aproxima e roda a demo; "Repetir" roda de novo; "Vista ampla" volta.
- **Câmera livre**: arraste pra orbitar, role pra aproximar, shift+arraste (ou botão direito) pra deslocar, `R`/Reset pra voltar. Teclado: setas, `+`, `-`. Touch: um dedo orbita, dois dedos aproximam e deslocam.
- **Reduzir movimento**: respeita `prefers-reduced-motion` e pode ser alternado no topo; a câmera pula pra poses paradas em vez de animar.

## Trocar o assunto (ensinar outra coisa)

1. Edite **`game/src/mundo.config.js`**: título, intro, público, mascote e as três estações (nome, princípio, explicação, sequência, observações por tempo da demo, takeaway, poses de câmera). Todo o texto do site vem daí.
2. Se a mecânica de uma estação for diferente, crie um módulo em `game/src/estacoes/` com a interface `{ reset(), update(demoTime), foco, pick }` e registre em `DEMOS` no `main.js`. Os três módulos existentes (portão, gavetas, conferência) servem de molde: são metáforas físicas que já se mostraram legíveis em close-up.
3. Rode `npm test` (os testes leem o config: duração, holds de 5 s, frases por fase) e inspecione no browser: vista ampla, close-up, demo, resultado, desktop e celular.

Regra do guia: *mude o assunto, mantenha a receita*. Uma estação = um princípio = uma metáfora física = uma mudança visível.

## Mascote

Blender não está disponível nesta máquina (aarch64), então o mascote **Any** é gerado em código (`game/src/mascote.js`): corpo âmbar, olhos, antena, quatro pernas com andar simples e sombra de contato. Pra usar um asset feito no Blender, exporte um GLB pra `game/public/assets/` e aponte `mascote.glb` no config; pernas nomeadas `Perna1..4` (ou `Leg1..4`) ganham a animação de andar automaticamente.

## Estrutura

```
game/index.html               layout, painéis e controles
game/src/main.js              engine, cena, máquina de estados, tour, UI
game/src/mundo.config.js      DADOS do mundo (assunto, estações, textos, câmera)
game/src/tour.js              timeline e cues do World Tour (sem Babylon, testado)
game/src/palco.js             chão, pedestais, luzes, sombras, placas de texto
game/src/mascote.js           mascote procedural / loader GLB
game/src/camera-controls.js   orbit, pan, zoom, teclado, touch
game/src/estacoes/*.js        as três mecânicas
game/tests/tour.test.mjs      7 testes de timing e narração
evidence/                     screenshots e revisão da inspeção
docs/                         post, guia, prompt, transcrição, repo de referência, síntese
```

## Publicar

`npm run build` gera `game/dist/` estático com caminhos relativos. Serve em qualquer host estático (Vercel, GitHub Pages, Here.Now). Publique exatamente o build que foi inspecionado.

## Créditos

Receita, ritmo e checklist: [Build a Learning World](https://build-a-learning-world.markkashef.chatgpt.site/) e o repo [promptadvisers/early-ai-dopters](https://github.com/promptadvisers/early-ai-dopters), de Mark Kashef. Este projeto reimplementa a receita com assunto, textos, mascote e código próprios.
