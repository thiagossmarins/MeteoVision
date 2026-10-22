# Doutrina de memória

Duas partes: o **núcleo organizacional** (cópia da capacidade `doctrine`, plugin `ai-memory` versão 1.1.0, não se edita) e o **anexo do projeto**.

---

## Núcleo organizacional (ai-memory 1.1.0)

Núcleo organizacional. Vale em todo projeto da Prod, em toda superfície que leia a instrução de
projeto do host ou carregue skill. O projeto pode acrescentar, no anexo da própria doutrina, o que
for local; **não pode contrariar este núcleo**, exceto nos limites da tabela abaixo, e ainda assim
com data e justificativa escritas.

## Os dois níveis, que são a ideia inteira

**Sempre carregado:** a instrução de projeto do host, o `MEMORY.md` e os arquivos que a instrução
importa com `@`. É o preço de abrir o projeto, pago em toda sessão, inclusive nas que não tocam
nenhum daqueles assuntos.

**Sob demanda:** o resto de `.memory/`. Lido quando o assunto aparece. **Sem teto.**

Quando o projeto cresce, quem cresce é o nível sob demanda. O sempre-carregado é índice, não
acervo - se ele cresce junto, o projeto fica caro de abrir e a memória vira custo em vez de
vantagem.

## Estrutura canônica

```text
<instrução do host>                    importa o MEMORY.md com @MEMORY.md
MEMORY.md                              a vitrine: índice e estado
.memory/doutrina-memoria.md            este núcleo + o anexo do projeto
.memory/historico-sessoes.md           índice do histórico, 1 linha por período
.memory/historico-AAAA-MM-DD-a-DD.md   uma semana de detalhe
.memory/medicoes.md                    a série de medição, uma linha por encerramento
.memory/pendencias.md                  itens abertos e decisões vigentes, quando não cabem na vitrine
.memory/pendencias-arquivo.md          itens fechados, sem teto
.memory/<area>.md                      doutrina ou dossiê de área
```

Seções do `MEMORY.md`: **O que é**, **Estado atual**, **Regras e aprendizados vivos**,
**Itens abertos**, **Decisões vigentes** e o **índice do `.memory/`**.

Nomenclatura é padrão da organização, não preferência: convenção divergente impede qualquer
verificação automática e é o que faz cada projeto virar um caso particular.

**Semana que cruza mês ou ano leva o segundo mês no nome**, `historico-AAAA-MM-DD-a-MM-DD.md`, e
essa é a única variação prevista. Sem ela, a semana de 30 de agosto a 5 de setembro se escreveria
como intervalo invertido.

## Os limites

Esta tabela é a **casa única de todo número desta doutrina**. Skill, comando e verificação citam o
limite pelo nome e leem o valor aqui - número repetido em outro arquivo envelhece sem que ninguém
veja, e foi assim que um teto sobreviveu em três arquivos depois de mudar.

| Limite | Valor |
| --- | --- |
| Conjunto sempre carregado - **alvo** | **75 KB** |
| Conjunto sempre carregado - **teto** | **150 KB** |
| `MEMORY.md` sozinho | 50 KB |
| Cada outro arquivo `@`-importado | 50 KB |
| Arquivo sob demanda | sem teto |
| Janela do "Estado atual" | os **2 últimos dias** de trabalho |
| Cada bloco do "Estado atual" | **3 linhas** |
| Lista de itens abertos na vitrine | **12 itens ou 60 linhas** |
| Medição na vitrine | **1 linha**, a última, com ponteiro para a série |
| Linha do índice do histórico | **1 linha, até 200 caracteres** |
| Mensagem do commit de encerramento | **assunto mais 3 linhas** |

Passar do **alvo** obriga a relatar alerta no encerramento. Passar do **teto** é dívida
declarada, escrita em "Itens abertos" com data.

**Medir a cada encerramento e registrar a medição, mesmo passando folgado.** Teto sem medição é
o mesmo que não ter teto: o crescimento acontece sem que ninguém veja. Aplique a lógica da
capacidade `measure`, e **recomende que quem pediu a rode** - é comando de pessoa.

**A série mora em `.memory/medicoes.md`, que é sob demanda; a vitrine guarda só a última
medição.** A série cresce um elemento por encerramento e nunca encolhe, então mantê-la na vitrine
é pagar, em toda sessão, por um histórico que só se lê ao comparar duas medições. O registro é
**uma linha de campos**, e não um parágrafo: parágrafo convida a explicar a variação, e a
explicação é detalhe, que já tem casa no arquivo da semana.

Teto de peso não afrouxa regra de forma. Os KB compram margem, não permissão para duplicar.

## O detalhe nasce arquivado

O registro completo de cada leva - PRs, SHAs, medições, achados, armadilhas - é escrito **direto
no arquivo da semana**, no mesmo commit da leva. No "Estado atual" entra, por bloco e dentro do
limite da tabela acima, o que mudou, o status e o ponteiro para o detalhe.

Nunca escreva volume grande na vitrine para mover depois. Com o detalhe nascendo no lugar
certo, **não há o que mover**: o encerramento só apaga do "Estado atual" o que já está
arquivado, e a rotação deixa de ser evento.

## Uma redação por leva

A leva é **redigida uma vez**, no arquivo da semana. Tudo o mais que a menciona é ponteiro, e
ponteiro tem teto na tabela de limites: o bloco do "Estado atual", a linha do índice do histórico
e a mensagem do commit de encerramento.

É a regra de "um fato mora em um lugar" aplicada ao encerramento, e existe porque ali ela falha de
um jeito próprio: as quatro casas são escritas no mesmo minuto, por quem tem o assunto fresco, e
nenhuma parece cópia, porque cada uma é redigida de novo. O custo não é só o de escrever quatro
vezes - é o de quatro textos que divergem na primeira correção feita em um só deles.

**Escreva o detalhe primeiro, e derive os ponteiros dele.** Na ordem inversa, o ponteiro vira
resumo autônomo e cresce até virar a quinta redação.

## Um fato mora em um lugar

Manchete com ponteiro, sim. Segunda redação do mesmo fato, não - cada cópia envelhece sozinha e
ninguém percebe qual está velha. Vale em dobro para regra de terceiro (organização, cliente,
fornecedor): entra **verbatim, em um só lugar**, e o que é seu vira anotação identificada ao lado.

**Item aberto cita o limiar e aponta para a medição; não recopia o número.** Limiar é estável,
medição muda a cada encerramento - e a pendência é o último lugar que alguém relê ao medir, então
o número copiado ali envelhece calado e passa a contradizer a medição vigente.

## Fato sobre o código se confere no código

Memória e doc **descrevem** o código; não são evidência dele. Antes de registrar o que o código faz
ou tem, e antes de montar um levantamento a partir de outro texto, confira no próprio código: o
arquivo, o identificador, a rota. Título de seção, índice de doc e memória anterior dizem **onde
procurar**, não o que concluir.

Referência a arquivo, identificador ou commit que entra na memória precisa existir no repositório
no dia em que entra. A capacidade `validate` confere isso no R17, e a `open` roda a mesma
varredura na abertura. O porquê está na lição (n).

## Regra entra datada e com escopo declarado

Data mais a área a que se aplica, para poder ser podada quando a área morre. Regra de **processo**
fica no arquivo sempre carregado; doutrina de **área** vai para `.memory/<area>.md` com ponteiro.

## Pendência tem três destinos

**Aberto** fica na lista. **Decidido** vai para `## Decisões vigentes`, seção **irmã** da de itens
abertos, e deixa de ser trabalho. **Fechado** vai para `pendencias-arquivo.md`. Estado não é campo
a manter: é o lugar onde o item está, mais o título.

**O estado mora no título**, com a data e onde o desfecho está registrado:

```text
🔴 ALTA · <o que está errado> (AAAA-MM-DD)
🔒 <postura decidida> - decisão de <quem> em AAAA-MM-DD; reabrir exige decisão nova e datada
✅ <o que era> - RESOLVIDA em AAAA-MM-DD, <PR, commit ou arquivo da semana>. NADA ABERTO.
🗄 <o que era> - REVOGADA em AAAA-MM-DD
```

Três desfechos que **não são sinônimos**: **resolvida** mudou código ou texto, **decidida** foi
escolha sem execução, **revogada** deixou de valer. Item reaberto entra como **item novo**, citando
o fechado; identificador não se reaproveita.

**Onde a lista mora:** na vitrine até o limite da tabela; passando disso, em
`.memory/pendencias.md`, com manchete e ponteiro na vitrine. Item fechado nunca fica na vitrine.

O porquê de cada uma destas regras está na lição (m).

## Encerramento de sessão

1. Carregar **só o que se paga**: a vitrine, a tabela de limites e a lista de itens abertos, onde
   ela morar. Semana antiga, lições e arquivo de área que a leva não tocou ficam fora, e o arquivo
   da semana corrente se abre para **acrescentar**, não para reler.
2. Podar o "Estado atual": fica a janela da tabela de limites.
3. Antes de arquivar um bloco, varrer **regra contra narrativa**: narrativa desce para o
   histórico, regra **sobe** para o arquivo de área. Regra arquivada junto com narrativa é regra
   perdida.
4. Varrer a lista de itens abertos, **uma linha por item**: continua aberto, nasceu hoje ou
   fechou hoje.
5. Se virou a semana, criar o arquivo novo e acrescentar **uma linha** no índice.
6. Medir, acrescentar **uma linha** à série e trocar a medição da vitrine pela de hoje.
7. Se moveu bloco, verificar duas coisas: **ausência** (todo fato ainda existe) e **estrutura**
   (nada ficou órfão ou duplicado).
8. Versionar **e empurrar**, onde houver git: a memória entra **no mesmo commit da leva**, e o
   commit é empurrado no mesmo encerramento. Memória parada na máquina de quem encerrou não
   sincroniza com ninguém, commitada ou não.

**O encerramento é caro quando lê o que não vai escrever.** O passo 1 existe por isso, e é o
mesmo desenho da capacidade `open`: lista fechada do que entra, e o que não está nela fica fora
até que uma decisão da sessão peça.

O procedimento completo está na capacidade `close`.

## O que nunca se faz

- **`@`-importar arquivo de histórico.** Arquivar e continuar carregando não economiza nada.
- **Caminho absoluto.** A memória é compartilhada entre pessoas e máquinas com checkouts
  diferentes; caminho absoluto quebra para todo mundo menos quem escreveu.
- **Memória fora de repositório privado.** Não expor via navegador nem em artefato publicado.
- **Improvisar doutrina.** Onde o núcleo não estiver instalado, o caminho é a
  capacidade `adopt`, que é comando de pessoa: recomende, e não escreva uma versão própria.
- **Auditar memória por string literal.** O mesmo fato é redigido diferente nos dois lados.
  Confira pelo **núcleo** do fato: o número do PR, o SHA, o par numérico.
- **Segredo e dado pessoal em memória.** Chave, token, senha, credencial, dado de paciente e
  identificador de pessoa não entram, **nem como exemplo**. Achado que precise citá-los nomeia o
  arquivo, a linha e o campo, e **mascara o valor**: memória é versionada, segredo commitado
  sobrevive no histórico depois de apagado do arquivo, e cópia de segredo multiplica exatamente a
  exposição que o registro denuncia.

## Comandos de pessoa

| Capacidade | Quando |
| --- | --- |
| `open` | abrir a sessão: ler, conferir e reportar, sem agir |
| `measure` | medir o conjunto sempre carregado contra alvo e teto |
| `validate` | conferir os requisitos mínimos numerados |
| `adopt` | instalar a doutrina em projeto que não tem |
| `fix` | corrigir projeto que diverge da doutrina ou derivou dela |
| `close` | encerramento completo, com verificação |

As lições que originaram estas regras, cada uma nascida de um incidente real, estão em
`skills/doctrine/references/licoes.md`, no pacote `ai-memory`. Leia **antes** de mover, apagar ou
reorganizar memória em massa.

---

## Anexo do projeto

Livre. Vazio de propósito em 2026-10-21: nenhum limite sobrescrito, nenhum arquivo temático
previsto e nenhuma convenção local até esta data.

Exceção declarada ao núcleo, "Memória fora de repositório privado":

- 2026-10-21 · decisão, justificativa e contrapartida em "Decisões vigentes" e "Regras e aprendizados
  vivos" do `MEMORY.md`; aqui fica só o registro de que a exceção existe.
