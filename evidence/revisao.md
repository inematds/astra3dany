# Revisão de inspeção — 2026-09-14

Como foi testado: Chromium headless (agent-browser, WebGL por software) contra o servidor Vite de dev e depois contra `npm run preview` do build de produção. Desktop a 1280 × 800 CSS px; celular a 390 × 844. DPR 1. Os frames de tempo do tour foram capturados por *seek* (`state.tourT`) e também com o tour rodando de verdade.

## O que foi verificado

| Item do checklist (prompt §10) | Resultado | Evidência |
|---|---|---|
| Mascote reconhecível de frente e em 3/4, pés no chão, nada faltando | OK. Corpo âmbar, olhos, antena, 4 pernas com pés; sombra de contato ancora no chão | `01-inicio.png`, `recap.png` |
| Labels nítidos em close-up; nada cortado | OK depois da correção de auto-ajuste da fonte nas placas (antes: "INSTRUÇÕES" e "desconhecida" cortados) | `est2-sheet.jpg`, `est3-sheet.jpg` |
| Card nunca cobre a demonstração | OK. Desktop: cena renderizada nos 66% da esquerda (viewport Babylon), card à direita. Celular: canvas nos 45% de cima, card fixo embaixo | `tour-sheet.jpg`, `mobile-sheet.jpg` |
| Cada estação tem um antes/depois visível | OK. Portão: pedido barrado → revisão, segundo pedido passa e a roda gira. Gavetas: card entra na gaveta do projeto, colegas acendem e conectam. Conferência: total 100 → 90, data → desconhecida, selos cinza → verde | `est1..3-sheet.jpg` (wide / close / meio da demo / resultado) |
| Legenda bate com o estado da demo | OK. 7 testes em `game/tests/tour.test.mjs` cobrem as frases por fase e os tempos ("falhou" antes de "passou", "90" na correção) | `npm test` → 7 pass |
| Takeaway segura 5 s; tour chega ao recap sozinho | OK. Testado: hold de 5 s em cada estação (teste) e tour real chegando em `modo: recap` com as 3 estações marcadas | `recap.png` |
| Pause congela tudo; Retomar continua; Reiniciar zera | OK. Pausado: `tourT` 12.90 → 12.90 após 1,5 s. Retomado: 13.99. Reiniciar: 0.53 | `tour-pausado.png` |
| Esc sai do tour; clique no pedestal abre a estação; teclado orbita | OK. Esc → `modo: inicio`. Pointer no pedestal 02 → `modo: estacao, ativa: 1`. ArrowLeft mudou a posição da câmera | log da sessão |
| Reduced motion | OK. Com `reduzido = true` a câmera segura a mesma pose entre 7,5 s e 8,5 s (trecho de movimento) | log da sessão + teste |
| Mobile legível e rolável, sem scroll horizontal | OK. `scrollWidth === clientWidth === 390` nas três telas | `mobile-sheet.jpg` |
| Sem erro de runtime | OK. Console só com avisos do WebGL por software do headless (SwiftShader / ReadPixels), nenhum `[error]` | console lido após o tour completo |
| Build de produção inspecionado | OK. `npm run build` → `game/dist` (7,7 MB, chunk principal 5,8 MB por causa do Babylon); preview a 43221 carrega, tour roda, legendas corretas. Sem caminhos pessoais no output | `preview-tour-9s.png` |
| Frame timing | Registrado, mas **não representativo**: 25–34 fps, p95 33–48 ms no Chromium headless com WebGL por software (SwiftShader). Numa GPU real espera-se bem mais; medir com `?diagnostics` no dispositivo alvo | diag no canto das capturas |

## Defeitos encontrados e corrigidos durante a inspeção

1. `#loading` com `display:grid` vencia o atributo `hidden` → overlay ficava por cima do mundo. Fix: `[hidden]{display:none!important}`.
2. Texto das placas 3D cortado quando longo. Fix: a placa mede o texto e encolhe a fonte até caber.
3. Barra do portão aberta cobria o letreiro AÇÃO. Fix: barra sobe menos, letreiro mais alto.
4. Card do tour cobria parte da demo no desktop. Fix: viewport Babylon reservado ao lado do card.
5. Ao fazer *seek* pro hold, os valores da conferência ficavam velhos. Fix: na fase takeaway a demo é levada ao estado final.
6. **Loop de resize do canvas**: o Babylon escreve `width/height` no canvas a cada resize; como o canvas participava do layout do grid (min-height auto), o grid crescia a cada ciclo (canvas de 1070 px numa janela de 800). Isso distorcia o enquadramento no celular e fazia o close-up da conferência parecer "uma placa branca". Fix: canvas `position:absolute; inset:0` e `.viewport{min-height:0; overflow:hidden}`.
7. Antena do mascote entrava no quadro dos close-ups. Fix: mascote oculto fora das fases de chegada (mesma decisão do projeto de referência).

## Limites desta revisão

- Não foi testado em dispositivo físico nem em Safari/Firefox; o headless não tem GPU.
- Touch (pinça / dois dedos) está implementado mas só foi exercitado por código, não por gestos reais.
- O mascote é procedural (sem Blender nesta máquina aarch64); não é um asset Blender rigado.
