# v3.24: a rodada não trava mais (sobre a v3.23)

A rodada da W47 terminou a análise completa, mas não publicou o painel nem enviou o Slack. Causas e correções:

| Causa | Correção |
|---|---|
| O contrato dizia "html abaixo de 165 KB (maior já aceito ~167 KB)" e a rotina seguiu isso com um html de 259 KB | Contrato corrigido: teto do montador de 240 KB; o número antigo não vale |
| O prompt exigia conferir o html publicado byte a byte e só liberava o Slack depois disso | Publicação sempre tentada, sem conferência prévia (o Arturito guarda a versão anterior e a página só esconde blocos inválidos); Slack independente do painel |
| O html cresceu com ~690 exemplos e 259 KB cabia mal numa única chamada | Montador compacta sozinho (junta exemplos repetidos, 5 por lista), encolhe o histórico, avisa os maiores blocos; `--compacto` e `--semanas-historico 0` como plano B |
| O histórico não persistia: cada rodada empurra para uma branch `claude/*` e nada é mesclado | `restaurar_historico.py` junta as semanas de todas as branches e deriva a semana do html de branches antigas |
| A rotina não achou a busca do Drive (`in parents` não funciona) | Prompt manda buscar `mimeType = 'image/webp'` com paginação e filtrar pelo `parentId` |
| `--completo` exigia 5 exemplos de Reclame Aqui, mas o validador aceitava no máximo 3 (a rotina corrigiu só na própria branch) | Validador do repositório corrigido (até 6) |
| Dado parcial (22/11 não consolidado) e outras falhas podiam parar a rodada | Nova REGRA DE ENTREGA: publicar e enviar o Slack sempre, marcando a semana como parcial |

Para finalizar a W47 use `retomar-w47.txt`.

---

# v3.23: histórico de 4 semanas nos destaques (sobre a v3.22)

- **Painel:** seletor de semanas nos Destaques (atual + 3 anteriores) com os destaques, exemplos e movimentos arquivados de cada semana. Dados em um bloco comprimido do html (`data-px-hist`, ~11 KB por semana); o JS cresce ~3 KB e o CSS ~1 KB. **Cole o novo JS e o novo CSS no 156** (o html continua sendo publicado pela rotina; não cole o `4-html-inicial.html`).
- **Rotina:** `painel-156/historico/` (uma semana por arquivo; semente W45), `arquivar_semana.py`, `extrair_historico.py` e `montar_html_painel.py --historico`. O prompt v3.23 descreve o fluxo: restaurar, arquivar a semana validada, montar e versionar.
- **Correção junto:** a aba "Destaques" de cada produto passou a listar também os destaques em que o produto aparece em `ps` (antes só `p`).
- **Quando completa:** a W45 é a semente e a W46 entra na primeira rodada (recuperada do html publicado). Com a rodada seguinte já são 3 semanas e, na próxima, as 4 completas.

---

# v3.22: análise completa em toda execução (sobre a v3.21)

A rodada de teste da W46 foi uma "execução reduzida" decidida pela própria rotina: o painel foi publicado com vozes, lojas, redes e Reclame Aqui "indisponíveis", sem séries, sem notas de jornada, sem subprodutos de Seguros e com imagens padrão. O prompt permitia isso (`img` e `jornada` opcionais, bloco inválido omitido pelo montador). O que mudou:

- **Prompt v3.22:** seção "COMPLETUDE OBRIGATÓRIA" (20 blocos, fontes, frases literais, imagens do Drive listadas por inteiro), proibição de execução reduzida em qualquer modo (único, teste ou DM), Slack sempre por último e uma única vez, conferência do html publicado (20 blocos e mesmo tamanho).
- **Validador `validar_ia.py --completo`:** erro se faltar bloco, imagem (destaques e 12 produtos), série, 5 exemplos, notas de jornada, temas ou os 3 subprodutos de Seguros. `base_pequena: true` só para volume realmente pequeno.
- **Montador:** completo e estrito por padrão (não gera html incompleto); `--parcial` só para pré-visualização; teto subiu para 220 KB (html completo passa de 190 KB).
- **Publicação:** se após 3 ciclos de correção ainda houver erro, a rotina não publica (a semana anterior permanece) e avisa.

Veja `painel-156/contrato-ia-v2.md` (seção "Completude obrigatória") e `painel-156/exemplo-ia/LEIA-ME.md`.

---

# v3.21: um report por canal no Slack, sem RAF (sobre a v3.20)

## O que mudou no Slack
- **Um report por canal.** 11 canais, 11 mensagens principais por semana (antes eram até 21, com vários no mesmo canal). `#cx_fraud`, `#investments-e-cx`, `#melhoria-continua-verticais`, `#pixcc-home-raf-cx`, `#squad_loan_seguimento` e `#subacquirer-cx` passam a ter um só report cada.
- **Uma resposta por produto na thread.** Cada resposta traz o resumo do produto, os destaques da semana e as menções (NPS Relacional, lojas, redes e Reclame Aqui), só as que existirem, e o link do report do produto.
- **Executivo e Geral:** mensagem principal com **só o link do painel 156**; a thread tem 3 respostas (Resumo geral, Destaques da semana, Menções por produto), sem links e sem valores de contatos.
- **RAF removido:** sem report, seção ou menção. O canal `#pixcc-home-raf-cx` só mantém o nome e recebe Pix e Pix CC.
- **Validação antes do envio:** `repo/painel-156/validar_slack.py` barra o que foge dessas regras (14 casos testados). O formato está na seção 6 de `contrato-report-v1.md`; exemplos reais da W45 em `exemplo-slack-w45/`.

## Para publicar
1. Suba `repo/painel-156/` (novos: `validar_slack.py`, `exemplo-slack-w45/`; alterados: `registro-painel.json`, `contrato-report-v1.md`) e `prompt-rotina-unica.txt`.
2. **Alinhe o `SKILL.md` e o `canais.json` do repositório.** Não consegui lê-los (o GitHub pede autorização). O prompt v3.21 diz que a Fase 4C substitui o template do Slack e a lista de canais no que conflitar, mas o ideal é remover de lá o template de 3 respostas por report, o Report Executivo separado e qualquer entrada de RAF.
3. Rode antes com `MODO=TESTE` (as 11 mensagens vão ao `#the-voice-cx` com o prefixo `[TESTE → #canal]`).

## Checklist para a rotina funcionar (v3.21)
1. Colar o `prompt-rotina-unica.txt` na rotina "Report Produto A" e subir `repo/painel-156/` no repositório.
2. Alinhar o `SKILL.md` e o `canais.json` (template de 3 respostas por report, Report Executivo separado e entradas de RAF).
3. Ter o conector do **Google Drive** na rotina (opcional) e a pasta de imagens com acesso "Qualquer pessoa com o link: Leitor".
4. O painel 485 precisa das mesmas **8 queries**, do mesmo JS e do mesmo CSS do 156 antes do teste.
5. Rodar `MODO=TESTE` e conferir: html aceito pelo Arturito (~178 KB), 11 mensagens no `#the-voice-cx`, validadores sem erro.

## Dúvidas em aberto
- "Report de RAF": no pacote o RAF já não era uma saída (saiu em 19/10); mantive os reports de Pix e de Pix CC. Se a ideia era tirar também o canal `#pixcc-home-raf-cx`, é remover o canal do registro (dois produtos).
- O link do painel nos canais executivo e geral é o do painel 156 (Experiência do Produto). Os canais de produto mantêm o link "Experiência RecargaPay" (painel 141) na principal, como antes.

# v3.20: painel 156 novo + automação da IA

## O que mudou na Rotina
- **Painel:** JS, CSS e as 8 queries ficam fixos no Arturito (publicados à mão, veja `publicar-painel-156/`). A Rotina só reescreve `html` e `rationale_md`.
- **Fase 4A.2 (nova):** depois dos 21 reports, a Rotina escreve os 20 blocos de IA do painel numa pasta `ia/` (contrato em `repo/painel-156/contrato-ia-v2.md`, exemplo da W45 em `exemplo-ia/`).
- **Fase 4B:** `montar_html_painel.py` valida os blocos e monta o html (shell + blocos). Bloco inválido é omitido e o painel mostra "indisponível" só nessa parte; o resto sobe. O html fica abaixo de 185 KB (hoje ~178 KB).
- **Mantido:** os 21 reports e as mensagens do Slack, com os mesmos links (`&r={chave}/rep`, que o novo JS abre no produto certo).
- `montar_html_reports.py` e `html-esqueleto.html` não são mais usados no painel.

## Para publicar
1. Suba `repo/painel-156/` (contrato, shell, JS, CSS, queries, validador, montador, exemplo-ia, rationale) e `prompt-rotina-unica.txt`.
2. Publique antes o painel novo no 485 e no 156 (`publicar-painel-156/LEIA-ME.md`). Sem isso a Rotina atualiza um html que o JS antigo não entende.
3. Edite a rotina "Report Produto A" com o novo prompt e rode uma vez com `MODO=TESTE`, `PAINEL_ID=485`. O 485 precisa ter o mesmo JS, CSS e as 8 queries do 156.
4. Depois rode `MODO=UNICO`. O snapshot do html inicial some sozinho na primeira atualização semanal (a Rotina não o inclui).

## Atenção
- A Rotina precisa passar ~178 KB de html na chamada do Arturito (teto de 185 KB). Se falhar, reduza exemplos e `det` (é o que mais pesa).
- A semana da IA e a dos indicadores podem diferir por pouco tempo na segunda (9:30 a 10:11); o aviso do topo mostra as duas.
- Não rodei a Rotina inteira aqui (sem o repositório completo nem acesso ao Slack). Testei o painel (4 cenários, 147 aberturas, rotas `r=`), as queries contra os números atuais, o validador e o montador.
