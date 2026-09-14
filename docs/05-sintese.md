# Síntese — o que o material ensina e os números usados neste projeto

Fontes: post + vídeo (17m45s) + Field Guide + prompt completo + repo `claude-architect-mini-world`.

## A tese em uma linha

Um "mundo de aprendizagem" 3D funciona quando **o aluno vê uma ideia acontecer**: uma estação = um princípio = uma metáfora física = uma mudança visível (antes → depois). Comece com **três estações**, prove uma, depois expanda.

## As seis partes (o que se constrói de verdade)

1. **Assets** — o mascote é a âncora visual. Uma hora nele levanta tudo o resto. Silhueta primeiro, detalhe depois. Separar o que se move (raiz, pernas). Blender → GLB.
2. **Palco e luz** — objetos com profundidade e apoio visível; fill suave + uma key light; sombras de contato. Evitar sala escura fechada (mata legibilidade).
3. **Câmera** — cada estação tem visão ampla, close-up e transição calma. Pensar em lente (35 mm → 50 mm) e em **onde pausar**, não em movimento contínuo.
4. **Interação** — uma máquina de estados pequena controla o que se move e quando termina. Clicar tem que fazer algo (é isso que torna comercializável).
5. **Guia e interface** — um card responde 3 perguntas: *o que estou vendo? o que está acontecendo agora? o que devo lembrar?* A legenda **sincronizada** com a animação.
6. **Teste e entrega** — a parte mais importante. 40% do tempo é build, **60% é teste**. Inspecionar o browser real (desktop, mobile, console vazio), publicar a versão exata testada.

## Ritmo de câmera por estação (o "prompt de uma linha")

| Fase | Duração | O que faz |
|---|---|---|
| Chegar | 2–3 s | mostra a estação inteira, identifica as partes |
| Aproximar | 2–3 s | ease até o mecanismo antes de começar |
| Demonstrar | 5–6 s | roda **uma** ação; objetos importantes visíveis |
| Segurar | 5 s | resultado parado enquanto o takeaway aparece |

Referência: tour completo de 63 s no mundo Claude; estações em X = −3, 0, 3 (Y = 0 no chão); vista inicial `[0, 3.1, 9.5]` olhando `[0, 1, 0]`, FOV 50°.
Dois modos de visita: **World Tour** ritmado e **exploração livre** (orbit, zoom, pan, reset, Pause).

## Princípios de prompting e processo

- "Build an amazing 3D world with three stations" → não dá nada, nem no Astra Ultra. "Approach over 3 s, readable close-up, one 6-second demonstration, hold 5 s" → dá o real.
- Fórmula: **Outcome + Audience + References + Stations + Behavior + Constraints + Checks.**
- **Enforce before acting**: cada estação passa um *gate* de sucesso definido por você ("clicar no ícone dispara um POST visível até o logo do Gmail").
- `/goal` no Astra: impede a preguiça de "isso podia ser melhor" sem corrigir; só para quando a rubrica inteira passa.
- Construir **1 a 5 estações por vez**, aprovar, expandir. Nunca 40 de uma vez — quebra a coesão do mundo.
- Planejar bem no início é a parte mais difícil: refazer um canto quebra a consistência do resto.
- Armadilha do workshop: rebuildar o source não atualiza um preview antigo — confirmar qual build/asset o browser carregou antes de diagnosticar defeito visual.

## Stack

Blender (assets) → GLB → **Babylon.js** (render/interação no browser) → HTML/CSS/JS (cards, navegação, tour) → **Vite** (dev/build) → Vercel ou Here.Now (publicar).
Versões do projeto de referência: `@babylonjs/core 9.25.0`, `@babylonjs/loaders 9.25.0`, `vite 8.2.2`. Voz/música opcional via OpenAI ou Gemini 3.8 Flash. Sem IA ao vivo: as demonstrações são animações determinísticas.

## Checklist de aceite (do prompt §10, resumido)

- **Legível**: mascote reconhecível de frente e em 3/4; pés no chão; labels nítidos em close; cards não cobrem a demo.
- **Compreensível**: cada estação tem 1 antes/depois visível; legenda bate com o estado; takeaway fica tempo suficiente; recap final com os 3 princípios.
- **Usável**: tour completo chega ao recap sozinho; Pause congela câmera e demo; Replay/troca rápida/Reset sem estado velho; orbit/zoom/pan/touch/teclado/reduced-motion funcionam; mobile legível e rolável.
- **Entrega**: sem asset faltando nem erro de runtime; registrar dispositivo/viewport/DPR/frame timing; preview serve o build mais recente.

## O que muda de "Claude" pra "qualquer assunto"

Guia, seção 10: *Change the subject. Keep the recipe.* Escolher (1) público, (2) três princípios com metáfora física e ação visível, (3) identidade visual/mascote. A receita de navegação, câmera, cards e checklist fica igual.

## Restrições encontradas nesta máquina

- Blender **não está instalado** e a máquina é `aarch64` (DGX Spark / GB10) — Blender não tem build Linux oficial pra essa arquitetura. O mascote deste projeto é gerado **proceduralmente em Babylon.js** (documentado no README), com loader de GLB pronto pra trocar quando houver um asset Blender.
- Transcrição: Gemini (404/503) e Groq (403) falharam; usei Whisper turbo local na GPU.
