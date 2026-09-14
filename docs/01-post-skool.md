# 🟡 How to Build Interactive 3D Worlds to Teach Anything with Astra

Fonte: https://www.skool.com/earlyaidopters/how-to-build-interactive-3d-worlds-to-teach-anything-with-astra?p=53121bf4
Autor: mark-kashef-7464 Kashef
Data: 2026-09-14T01:10:00.78265Z

I've been playing around with using Astra's 3D skills for applications in the educational tech space.

Below are the steps I took to accomplish this, along with tons of exclusive resources for you!

What you're looking at → a world I put together in under 90 minutes running Astra and Luna together on Max → step-by-step guides walking through Claude Architect Certification concepts, escorted by a little Claude bot you click through

All the links you need
→ community repo: [https://github.com/promptadvisers/early-ai-dopters](https://github.com/promptadvisers/early-ai-dopters)
→ living course repo: [https://github.com/promptadvisers/claude-code-living-course](https://github.com/promptadvisers/claude-code-living-course)
→ the build writeup and rubric: [https://build-a-learning-world.markkashef.chatgpt.site/](https://build-a-learning-world.markkashef.chatgpt.site/)
→ the full build prompt: [https://build-a-learning-world.markkashef.chatgpt.site/prompt/](https://build-a-learning-world.markkashef.chatgpt.site/prompt/)
→ the live published world: [https://pure-coral-qwnd.here.now/](https://pure-coral-qwnd.here.now/)

Where the time actually goes → about 40% building, 60% testing → and the hardest part, like any codebase, is nailing the plan up front so you're not reworking a corner and breaking the cohesion of the whole world

The six parts to focus on

Core assets → spend an hour perfecting your mascot \(the Codex or Claude hero of the world\) → get that right and everything else lifts → my early Claude version was a sad, stretched-out, depressing draft before iteration

Staging and lighting → go back and forth with Astra until the plan for how objects catch light is comprehensive

Camera and angles → arrive shot, move closer, then hold → think in real camera terms \(a 35mm lens shifting to 50mm\) and where to pause instead of one continuous jagged motion

Interactions → clicking a station actually does something → this is what makes it commercializable for a school, university, or as a complement to existing courses

Guide and interface → the caption on the card must stay in sync with what's animating on screen

Testing and delivery → 𝘁𝗵𝗶𝘀 𝗶𝘀 𝘁𝗵𝗲 𝗺𝗼𝘀𝘁 𝗶𝗺𝗽𝗼𝗿𝘁𝗮𝗻𝘁 𝗽𝗮𝗿𝘁 → Codex computer use plus its internal browser clicks through the whole world, optimizes latency, and tests across browsers and mobile

Two principles worth internalizing → enforce before acting \(every station passes a success gate you define, like "clicking the MCP icon fires a visible POST request to a Gmail logo"\) → and why I use /goal → 𝗶𝘁 𝗼𝘃𝗲𝗿𝗿𝗶𝗱𝗲𝘀 𝗹𝗮𝘇𝘆 𝗯𝗲𝗵𝗮𝘃𝗶𝗼𝗿 → even post-fixes, Astra will say "this could be better" and then not fix it → goal won't let it stop until your whole rubric is satisfied

Build one to five stations at a time → sign off, then expand → don't generate 40 at once

The prompting lesson in one line
→ "build an amazing 3D Claude world with three stations" gets you nothing, even on Astra Ultra
→ "approach over 3 seconds, show a readable close-up, run one 6-second demonstration, then hold the result for 5 seconds" gets you the real thing

The tech underneath
→ Blender for the assets, Babylon to render it in a browser
→ add voice and music cheaply through the OpenAI ecosystem or Gemini 3.8 Flash
→ publish free on Vercel or [Here.Now](http://Here.Now) to share it

⚠️ don't do this for fun → it burns serious tokens
→ but if you have an ed-tech use case or want a standout portfolio piece, a world like this is a killer lead magnet and proof of work to get your foot in the door

## Comentários

(nenhum carregado)
