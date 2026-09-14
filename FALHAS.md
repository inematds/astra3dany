# FALHAS — astra3dany

| data | o que quebrou | menor correção | prompt \| infra |
|---|---|---|---|
| 2026-09-14 | Canvas Babylon crescia em loop a cada resize (1070 px numa janela de 800): o engine escreve width/height no canvas e o grid item com min-height auto acompanhava — distorcia o enquadramento no celular | `#world{position:absolute;inset:0}` + `.viewport{min-height:0;overflow:hidden}` (tirar o canvas do fluxo). Guard: nunca deixar o canvas ditar o tamanho do container | prompt |
| 2026-09-14 | Transcrição do vídeo: Gemini `gemini-2.5-pro`/`2.0-flash` deram 404 (nomes antigos) e todos os modelos atuais deram 503; Groq Whisper deu 403 | Fallback pra `whisper` (openai-whisper turbo) local na GPU — ~1 min pra 18 min de áudio. Guard: testar a lista de modelos antes de chamar; ter fallback local sempre | infra |
