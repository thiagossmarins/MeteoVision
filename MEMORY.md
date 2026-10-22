# MEMORY

Adoção da doutrina em 2026-10-21, núcleo v1.1.0.

## O que é

sora: app de previsão do tempo em React Native para iOS e Android, repositório de portfólio.

## Estado atual

**2026-10-21** · Doutrina adotada; logo nova, README reformulado e licença MIT; projeto e repositório renomeados para `sora`.
Pendente: builds Android e iOS depois do renomeio e Jest, que já falhava; ver "Itens abertos".
Detalhe em `.memory/historico-2026-10-19-a-25.md`.

Última medição: 2026-10-21, conjunto 2,0 KB (série em `.memory/medicoes.md`).

## Regras e aprendizados vivos

- 2026-10-21 · escopo: toda a memória · Nenhum segredo, dado pessoal ou contexto de terceiros entra em `MEMORY.md` nem em `.memory/` (contrapartida da decisão de repositório público, em "Decisões vigentes").

## Itens abertos

- 🟡 MÉDIA · P1 · Build do Android e `pod install` do iOS não verificados depois do renomeio para `sora`; o ambiente da sessão não tinha rede (2026-10-21)
- 🟡 MÉDIA · P2 · Jest falha com `SyntaxError: Unexpected token 'export'` em `__tests__/App.test.tsx`; já falhava antes do renomeio (2026-10-21)
- 🟢 BAIXA · P3 · Pasta local ainda se chama `MeteoVision`; renomear para `sora` fora da sessão (2026-10-21)

## Decisões vigentes

Aqui fica o que foi decidido e já não é trabalho; não se reabre sem decisão nova e datada.

- 🔒 Repositório mantido público, por ser portfólio e existir para ser visto, com a memória publicada junto - decisão de Thiago Marins em 2026-10-21; reabrir exige decisão nova e datada
- 🔒 Nome do projeto e do repositório em minúsculas, `sora`, sem inicial maiúscula - decisão de Thiago Marins em 2026-10-21; reabrir exige decisão nova e datada

## Índice do `.memory/`

- `.memory/doutrina-memoria.md` - núcleo da doutrina e anexo do projeto
- `.memory/historico-sessoes.md` - índice do histórico, uma linha por semana
- `.memory/historico-2026-10-19-a-25.md` - detalhe da semana de 2026-10-19 a 2026-10-25
- `.memory/medicoes.md` - série de medição do conjunto sempre carregado
