# PLANO — astra3dany: um mundo 3D pra ensinar qualquer coisa

**Suposição (o assunto não foi especificado):** o primeiro mundo ensina **"IA no dia a dia: 3 hábitos que evitam problemas"**, em português, pra público adulto leigo (perfil INEMA). Mantém a receita do guia (três mecanismos comprovadamente legíveis em close-up: portão, gavetas, conferência) e troca a lição. Todo o texto e a definição das estações ficam em `game/src/mundo.config.js`, então trocar o assunto é editar um arquivo.

## Resultado

Um site estático (Vite + Babylon.js) com:
- um palco em miniatura com 3 pedestais (X = −3, 0, 3) e um mascote guia ("Any");
- **World Tour** ritmado (~60 s): chegar 3 s → aproximar 3 s → demonstrar 6 s → segurar 5 s por estação, card sincronizado, Pause/Retomar/Reiniciar/Sair;
- **exploração livre**: orbit, zoom, pan, reset, teclado, touch; clicar num pedestal abre a estação; rodar/repetir demo;
- **recap** final com os 3 takeaways;
- reduced-motion, layout mobile, sem IA ao vivo (animações determinísticas);
- testes `node --test` do timeline/cues; evidências de inspeção no browser em `evidence/`.

## Mapa de estações

| # | Princípio | Metáfora física | Ação visível (antes → depois) | Takeaway |
|---|---|---|---|---|
| 1 | **Confirme antes de agir** | Portão entre um pedido e uma roda de ação | Pedido 1 chega, portão fechado, desvia pra revisão. Pedido 2 passa na checagem, portão abre, roda gira. | "Peça pra IA confirmar antes de agir: enviar, pagar, apagar." |
| 2 | **Dê contexto onde a IA lê** | Três gavetas (pessoal, projeto, tarefa) + um card de instruções + dois colegas | Card entra na gaveta do projeto; os dois colegas acendem conectados. | "Guarde as instruções do projeto num lugar só. Todo mundo (e a IA) lê o mesmo." |
| 3 | **Confira a fonte** | Um registro e uma fonte, dois selos (formato / fonte) | Formato passa. Conferência: total 100 → 90; data → "desconhecida". | "Resposta bem formatada não é resposta certa. Confira contas e fontes; o que não tem fonte fica em aberto." |

Fonte da estação 3: 20 + 30 + 40 = 90, sem data.

## Arquivos

```
game/index.html               layout acessível, painéis, controles
game/src/main.js              engine, cena, máquina de estados, UI
game/src/style.css            tipografia, paleta, responsivo
game/src/mundo.config.js      DADOS: assunto, mascote, 3 estações, textos (sem Babylon)
game/src/tour.js              timeline de câmera + cues (sem Babylon, testado)
game/src/camera-controls.js   orbit/zoom/pan/reset/teclado/touch
game/src/palco.js             chão, pedestais, luzes, sombras, materiais
game/src/mascote.js           mascote procedural + andar; loader GLB opcional
game/src/estacoes/portao.js   estação 1 (build/reset/update)
game/src/estacoes/gavetas.js  estação 2
game/src/estacoes/conferencia.js estação 3
game/tests/tour.test.mjs      timing, holds, cues
evidence/revisao.md           o que foi inspecionado e medido
README.md                     rodar, editar o assunto, publicar
docs/                         material baixado + síntese
```

## Ordem de build (prompt §09)

1. Palco + mascote placeholder + 1 estação + loading/erro.
2. Estação 1 completa: demo, câmera, card, pause, replay, reset. Inspecionar no browser.
3. Mascote final (procedural, já que não há Blender nesta máquina) e andar entre estações.
4. Estações 2 e 3 com close-ups distintos.
5. World Tour + exploração livre + recap.
6. QA: desktop 1280, mobile 390, teclado, reduced-motion, pause/resume, replay, console vazio, fps.
7. `npm run build`, inspecionar o build, registrar evidências, commit local.

## Checklist de aceite (prompt §10)

- [x] Mascote reconhecível de frente e em 3/4; pés no chão; nada faltando
- [x] Labels nítidos no close; cards não cobrem a demo
- [x] Cada estação: 1 antes/depois visível; legenda bate com o estado; takeaway segura 5 s
- [x] Recap traz os 3 princípios
- [x] Tour chega ao recap sozinho; Pause congela tudo; Replay/troca/Reset sem estado velho
- [x] Orbit, zoom, pan, touch, teclado, reduced-motion funcionam
- [x] Mobile legível e rolável, sem scroll horizontal
- [x] Sem erro de runtime; frame timing registrado; build de produção inspecionado

## Fora de escopo

Blender/GLB real (sem Blender aqui), voz/música, quiz, publicação (push/deploy) — não pedidos.
