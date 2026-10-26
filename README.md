# VoC Report Automation — Setup Guide

Pipeline semanal de VoC RecargaPay em **uma única Claude Code Routine**: analisa a semana, monta os
reports, atualiza o painel Arturito 156 e envia aos canais reais. Sem rascunho e sem janela de revisão.

**Responsável:** Artur Nunes (artur.nunes@recargapay.com)
**Última atualização:** 26/10/2026 (SKILL.md 3.18 — Rotina única; Routine A e Routine B unificadas)

---

## Arquitetura — uma Rotina

```
Segunda 09:30 BRT ──► Rotina única (MODO=UNICO)
                        Fases 0–3   dados frescos, uma vez só (21 sets: Geral, Executivo e 19 produtos)
                        Fase 3.5    autoverificação (datas, totais, eventos com fonte, alertas, validador)
                        Fase 4A     JSON de cada report (inclui Seguros)
                        Fase 4B     ATUALIZA O PAINEL ARTURITO 156 (html + rationale_md)
                        Fase 4C     Slack nos canais reais: mensagem principal + 3 respostas na thread
```

**O que mudou em relação às duas Routines:** saem o rascunho em `#the-voice-cx`, a janela de
comentários até 12h, a leitura de comentários e a segunda execução (a coleta e a revalidação
rodavam duas vezes). O conteúdo enviado continua o mesmo: o mesmo painel com os 21 reports e as
mesmas mensagens nos canais.

**Slack (por set):** **mensagem principal** (título na primeira linha, manchete sobre o produto,
linha fina e links com hiperlink no nome: `Report de {produto}` e `Experiência RecargaPay`) e, na
**thread**, 3 respostas curtas — Resultados · Alertas e Destaques · Menções e UX do produto — que só
indicam o que há no Report do painel 156. O Seguros sai em `#seguro_pix-cartão_cx`. Em
`#lideres-cx-e-cxm`, além disso, o **Report Executivo completo** em 3 respostas na mesma thread (pode
ser desligado em `canais.json › rotina_unica › executivo_report_completo`). Se o painel não puder ser
atualizado, a mensagem sai só com o link do painel 156 geral.

---

## Arquivos do repositório

| Arquivo | Função | Frequência de edição |
|---|---|---|
| `SKILL.md` | Lógica principal — fases, filtros, templates e MODO (UNICO ou TESTE) | Raramente (mudança estrutural) |
| `canais.json` | Mapeamento canal → verticais → tags → aberturas obrigatórias | Ao mudar canais ou verticais |
| `orientacoes-editoriais.md` | Instruções de análise por canal + `contexto_pontual` | `contexto_pontual` semanal; demais raramente |
| `skill-databricks-mcp.md` | Tabelas, campos e queries padrão do Databricks | Ao adicionar tabelas ou métricas |
| `skill-zendesk-cx.md` | Protocolo consolidado de queries Zendesk e métricas CX oficiais (`agg_overview`) | Ao mudar filtros ou métricas oficiais |
| `README.md` | Este guia de setup | Ao mudar o processo |
| `mapeamento-produtos-painel141.json` | Produtos e temas (regex) do painel 141 → menções em NPS Relacional, lojas e redes | Ao mudar o painel 141 |
| `painel-156/contrato-report-v1.md` | Contrato de dados do report de squad no painel 156, limites e procedimento semanal | Ao mudar o contrato |
| `painel-156/registro-painel.json` | Chave de cada set no painel 156 (e links) | Ao mudar squads ou sub-produtos do painel |
| `painel-156/montar_html_reports.py`, `painel-156/validar_report.py` | Validam os reports e montam o campo `html` | Raramente |
| `painel-156/html-esqueleto.html`, `painel-156/rationale-painel-156.md` | Esqueleto do campo `html` e documento `rationale_md` enviados ao painel | Quando o painel mudar |

---

## Pré-requisitos por membro do time

### Plano Claude
Requer plano **Pro, Max, Team ou Enterprise** com Claude Code habilitado. Como a Rotina é **uma execução semanal**, o consumo de quota é mínimo e cabe com folga no plano Pro.
Acesso em: `claude.ai/code/routines`

### MCPs necessários (conectar em Settings > Connectors)

| MCP | Finalidade | Obrigatório |
|---|---|---|
| `[TEST] MCP Gateway AWS AgentCore` | Queries Zendesk — motivos, causas raiz, análise qualitativa | ✅ Sim |
| `Slack` | Leitura de canais de contexto e envio dos reports | ✅ Sim |
| `MCP Data - RecargaPay` | NPS, CSAT, Retenção de Bot, funil, perfil de clientes via Databricks | ✅ Sim |

**Nota:** a integração com a API IndeCX (chamada HTTP direta, fora do protocolo MCP)
foi removida em Jul/2026 após identificarmos que essa dependência de rede externa
causava bloqueio de egress (HTTP 403) no ambiente de execução das Routines.

---


---

## Setup — passo a passo

### 1. Conectar os MCPs
Em `claude.ai` → Settings → Connectors:
- `[TEST] MCP Gateway AWS AgentCore` → `https://agentcore.recargapay.com/mcp`
- Slack MCP — confirmar autenticação com conta RecargaPay
- `MCP Data - RecargaPay` → `https://mcp-data.recargapay.com/mcp`


### 2. Criar (ou editar) a Rotina

Em `claude.ai/code/routines`, **edite a rotina "Report Produto A"** (não crie uma nova — assim o
repositório e os conectores já estão certos):
- **Nome:** `Report VoC` (ou o que preferir)
- **Instruções:** o prompt abaixo (cópia em `prompt-rotina-unica.txt`; o prompt vive na Rotina, não no GitHub)
- **Repositório:** `VoC-Product-Reports` (o mesmo)
- **Gatilho:** toda segunda-feira às **9:30 BRT** (o mesmo da Routine A)
- **Conectores:** os 5 atuais (MCP Data - RecargaPay, AWS AgentCore MCP Gateway, MCP-Proxy-RecargaPay, Slack e o gateway de teste)
- **Depois:** **desative ou apague a Routine B.** Se as duas ficarem ativas, os canais recebem mensagem duplicada.

O prompt gera os 21 sets, usa `MODO=UNICO` e `PAINEL_ID=156`; `MODO=TESTE` usa o painel 485 e o
`CANAL_TESTE`.

```text
Você é um analista especializado em Voice of Customer (VoC) da RecargaPay executando a Rotina única
de reports VoC (análise, painel 156 e Slack) com Claude Sonnet 5.

MODO=UNICO
PAINEL_ID=156

VALIDAÇÃO INICIAL (antes da Fase 0)
Confirme que as tools dos 3 MCPs abaixo estão de fato registradas nesta sessão (busque por nome exato
de cada uma; no caso do Zendesk, localize a tool pelo sufixo `zendesk___zendesk`, porque o prefixo do
servidor varia por ambiente).

**Databricks e Slack são obrigatórios e bloqueantes.** Se qualquer um dos dois não retornar tools
utilizáveis, encerre a execução sem dados parciais ou inventados, registre exatamente o que falhou e
notifique. Isso é crítico: esta Rotina atualiza o painel 156 e publica nos canais reais das squads.
A ferramenta `arturito_update_dashboard` do MCP Data - RecargaPay NÃO é bloqueante: se faltar ou falhar,
siga o formato de falha do painel descrito em EXECUÇÃO.

**Zendesk NUNCA é motivo para abortar a execução — é complemento, não obrigatório.** Se o
AWS-AgentCore-MCP-Gateway (tool `zendesk___zendesk`) não estiver disponível, tentar o fallback
`MCP-Proxy-RecargaPay` (tool `zendesk`), se existir nesta sessão. Se nenhum dos dois estiver disponível,
seguir direto para o "MODO DEGRADADO — SOMENTE DATABRICKS" do SKILL.md, sem nova tentativa e sem
encerrar a execução. A maior parte do pipeline roda 100% em Databricks (NPS, CSAT, volume, retenção de
bot, Central de Ajuda, rankings de motivo/causa raiz); o Zendesk ao vivo só aprofunda a leitura
qualitativa, que tem substituto direto em `fat_tickets_transcription_summary` (respeitando o gate de
cobertura do SKILL.md). Sem esta regra, as squads simplesmente não recebem report naquela semana.

Execute o pipeline completo de reports VoC conforme as instruções do SKILL.md deste repositório,
respeitando o MODO=UNICO definido na seção "MODO DE EXECUÇÃO" do SKILL.md.

CONFIGURAÇÃO
- Período: semana anterior completa em BRT (segunda 00:00 a domingo 23:59)
- Calcule as datas corretas a partir da data de hoje
- Modelo: claude-sonnet-5

ARQUIVOS DE REFERÊNCIA — repositório (ler na Fase 0)
- SKILL.md → lógica principal, fases de execução, templates e MODO
- canais.json → canais, verticais, tags Zendesk, aberturas obrigatórias, thresholds e a rotina única
- orientacoes-editoriais.md → instruções de análise por canal e contexto_pontual
- skill-databricks-mcp.md → queries específicas da Rotina não cobertas pelas skills organizacionais
- skill-zendesk-cx.md → protocolo complementar de queries Zendesk desta Rotina
- mapeamento-produtos-painel141.json → produtos e temas (regex) do painel 141, para as menções em NPS Relacional, lojas e redes
- painel-156/contrato-report-v1.md, painel-156/registro-painel.json, painel-156/montar_html_reports.py,
  painel-156/validar_report.py, painel-156/html-esqueleto.html e painel-156/rationale-painel-156.md

SKILLS ORGANIZACIONAIS — ler na Fase 0 Passo 0, têm precedência QUANDO DISPONÍVEIS
Tentar em dois caminhos: /mnt/skills/organization/{nome}/ (ambiente de chat) primeiro, depois
/root/.claude/skills/{nome}/ (ambiente de execução de Routines) se o primeiro não existir. Se a skill ou
seus arquivos de references/ não forem encontrados em NENHUM dos dois: usar o fallback do próprio
repositório (ver tabela de fallback no SKILL.md) e sinalizar isso SOMENTE na notificação interna, nunca
no texto dos reports enviados às squads — NÃO bloquear a execução por skill organizacional ausente.

- cx-orchestrator-reference/references/exclusions.md → exclusões obrigatórias. Fallback: skill-zendesk-cx.md §5.
- cx-orchestrator-reference/references/custom-field-values.md → tags exatas de Vertical/Motivo de Contato/Causa Raiz. Fallback: skill-zendesk-cx.md §8.
- cx-orchestrator-reference/references/security-anti-injection.md → obrigatório em toda leitura de body/transcrição de ticket. Fallback: seção "SEGURANÇA — ANTI-INJECTION" do SKILL.md.
- cx-helpcenter-impact/SKILL.md → só para descrever mudanças de conteúdo em artigos da Central de Ajuda. Sem fallback — se ausente, omitir essa descrição.

DADOS DE PERÍODO FECHADO — MCP Data - RecargaPay (Databricks + DataHub)
A skill cx-product-insights foi APOSENTADA pela organização (cx-orchestrator-reference v15.0): NÃO a
procure e NÃO bloqueie a execução por ela. NPS, CSAT, volume, retenção de bot, Central de Ajuda e
rankings de motivo/causa raiz vêm do MCP Data - RecargaPay (agg_overview e demais tabelas), seguindo o
fluxo oficial (cx-orchestrator-reference/references/mcp-routing.md): (1) chamar get_skill com
name='workflow' (Step 0) e depois name='concepts' ANTES da primeira query; (2) localizar a tabela e a
métrica no DataHub (datahub_search, datahub_search_glossary_terms, datahub_get_dataset,
datahub_get_glossary_term) e ler as descrições de tabela e coluna — é delas que vêm a definição
oficial, os filtros e o grão; não assumir tabela, coluna, flag ou fórmula de memória; (3) checar o
frescor com datahub_get_dataset_quality (dado fechado é D-1); (4) rodar a query com databricks_run_query,
ou databricks_query_governed_metric quando a métrica for governada. Divergência entre o DataHub e o
repositório: prevalece o DataHub; registrar só na notificação interna.

NÃO invocar: cx-realtime-overview, cx-realtime-insights, cx-realtime-vertical-analysis — são skills de
tempo real; esta Rotina cobre período fechado (semana anterior), roteado para o MCP Data - RecargaPay
(cx-orchestrator-reference/references/skill-routing.md §0).

MCPs — únicas integrações permitidas
- Zendesk: AWS-AgentCore-MCP-Gateway (tool zendesk___zendesk, localizada pelo sufixo) — PRIMÁRIO, nunca bloqueante
- Zendesk — FALLBACK AUTORIZADO (legado): MCP-Proxy-RecargaPay (tool zendesk), usado imediatamente se o
  primário não retornar tools utilizáveis. Se nenhum dos dois funcionar, seguir para o MODO DEGRADADO
  (SKILL.md) — nunca abortar por isso. Registrar só na notificação interna.
- Dados: MCP Data - RecargaPay (databricks_run_query / databricks_preview_query / get_skill / datahub_*) — CRÍTICO, bloqueante
- Painel: MCP Data - RecargaPay (arturito_update_dashboard) — escrita SOMENTE no dashboard PAINEL_ID,
  SOMENTE nos campos html e rationale_md; nunca js, css ou queries; nunca outro dashboard
- Contexto e envio: Slack MCP — CRÍTICO, bloqueante
⛔ Não realizar chamadas HTTP diretas a domínios externos.

FILTROS CRÍTICOS — sempre usar a versão corrigida
Ao consultar `dim_zendesk_tickets_summary` ou `agg_overview` no Databricks, usar sempre
`friendly_service_channel <> 'derivacao'` (nunca `key_channel NOT LIKE '%deriva%'`). Lista completa de
exclusões em cx-orchestrator-reference/references/exclusions.md ou, se ausente, em skill-zendesk-cx.md §5.

EXECUÇÃO
Execute, em uma única passada e sem interrupção, as Fases 0 a 3 (dados frescos, uma vez só). Na Fase 1,
leia os últimos 14 dias de todos os canais de destino e de #the-voice-cx (só como fonte de eventos e
incidentes; ignore posts antigos com [RASCUNHO →]) e monte a tabela única de eventos e incidentes de
todas as squads, usando-a na correlação cruzada de cada report. Faça a Fase 3.5 (autoverificação) e,
na Fase 4A, monte o JSON final de cada um dos 21 reports (Geral, Executivo e 19 produtos, incluindo
Seguros). Não há rascunho nem comentários do time: nada é postado antes da publicação.
Na Fase 4B, monte e valide o campo html com painel-156/montar_html_reports.py e atualize o dashboard
PAINEL_ID com arturito_update_dashboard, enviando SOMENTE html e rationale_md (copiados integralmente
dos arquivos, sem alterar). Se a atualização falhar duas vezes, ou se a ferramenta não estiver
disponível, NÃO aborte: registre a falha só na notificação interna e siga.
Só depois do painel, na Fase 4C, envie ao canal real de cada squad, conforme canais.json, a MENSAGEM
PRINCIPAL e, na thread dela (thread_ts = ts devolvido), TRÊS respostas curtas, seguindo o TEMPLATE
SLACK DA ROTINA do SKILL.md. Principal: na PRIMEIRA linha o título ":bar_chart: Report VoC — {produto} ·
Semana {NN} · {DD/MM}–{DD/MM/AAAA}"; logo depois a manchete (um destaque do produto ligado a evento,
incidente ou novo resultado, relacionando com a semana anterior quando houver dado), a linha fina, os
links (hiperlink no nome: "Report de {produto}" e "Experiência RecargaPay") e o aviso de que na thread
há resultados, alertas, destaques, menções e UX. Thread, nesta ordem: (1) Resultados; (2) Alertas e
Destaques; (3) Menções e UX do produto. Cada resposta é objetiva (só nomes e números), apenas indica o
que há disponível no Report do painel 156 e termina com o link "Ver no Report"; o detalhe, o impacto
observado, os temas e os trechos ficam no Report. Em #lideres-cx-e-cxm, depois dessas 3 respostas,
poste na mesma thread o Report Executivo completo em 3 respostas (resultado, satisfação e volume;
eventos e pontos de atenção; alertas), conforme o SKILL.md. Nunca poste o conteúdo da thread como
mensagem solta no canal. Seguros vai ao canal #seguro_pix-cartão_cx (ID C0BDW931ZA9). Formatação:
negrito com **dois asteriscos**; um asterisco só vira itálico. Na URL dos links escreva o & simples
(nunca &amp;). Com o painel atualizado e o report publicado, use o link do report da squad e o do painel
141; se o painel falhou ou o report ficou ausente, SOMENTE o link do painel 156 geral. Nunca mencione o
processo, a validação, falhas de ferramenta ou skill ausente no texto enviado. Se um MCP falhar após a
validação inicial, omita as seções afetadas e continue.

MODO TESTE (só quando o prompt disser MODO=TESTE): use PAINEL_ID=485 (nunca o 156) e envie tudo para o
CANAL_TESTE indicado (padrão #the-voice-cx, ID C060F2QUJCD), com o prefixo [TESTE → #canal-real] no
título e sem <!here>.
```

### 3. Testar antes da primeira execução real

Com **Run now**, troque no topo do prompt `MODO=UNICO`/`PAINEL_ID=156` por:
```
MODO=TESTE
PAINEL_ID=485
CANAL_TESTE=#the-voice-cx
```
Isso valida a montagem do HTML, a chamada `arturito_update_dashboard` (permissão do dono, ~150 KB,
marcador final) e todas as mensagens, **sem** publicar nos canais reais e sem tocar no painel 156.
Depois do teste, volte o topo para `MODO=UNICO` e `PAINEL_ID=156` e faça **uma** execução real.

**Checklist da primeira execução real:**
- [ ] Painel 156 mostra a nova "Semana NN" em cada aba **Report da squad**
- [ ] Os links `...id=156&r=<chave>/rep` abrem direto no Report (conferir 3: um simples, um com sub-produto, um dos executivos) e o link do 141 abre; a URL usa `&` simples
- [ ] Cada set sai como **mensagem principal** (título na primeira linha, manchete, links) e **3 respostas curtas na thread**; `#seguro_pix-cartão_cx` recebeu o de Seguros
- [ ] `#lideres-cx-e-cxm` recebeu também o Report Executivo completo (respostas 4 a 6)
- [ ] Negrito aparece como negrito; nenhuma mensagem inteira em itálico
- [ ] Números do Slack iguais aos do report no painel
- [ ] Nenhuma frase sobre processo, validação ou falha de ferramenta nos textos

---

## Ciclo de manutenção semanal

**Todo domingo (antes das 22h):**
- Verificar se há `contexto_pontual` a preencher em algum canal do `orientacoes-editoriais.md`
- Limpar os campos `contexto_pontual` que ficaram da semana anterior

**Toda segunda, depois das 9h30 (após a Rotina rodar):**
- Abrir o painel 156 e conferir que os reports da semana estão nas abas das squads
- Confirmar que as mensagens principais (com a thread) chegaram nos canais reais corretos, com os links
- Tratar alertas 🔴 que exigem ação
- Verificar se alguma seção foi omitida (possível falha de MCP). **Como não há mais revisão antes do envio, vale ler o Report Executivo logo após a publicação.**

**A cada sprint ou quando necessário:**
- Atualizar tags Zendesk em `canais.json` se uma vertical mudar de nome
- Adicionar queries em `skill-databricks-mcp.md` se uma nova tabela for usada
- Validar a tag do Pix CC (marcada como CONFIRMAR no `canais.json`) e a tag Zendesk de Seguros
- Se uma squad ou sub-produto mudar no painel 156 (lista `SQUADS` do JS), atualizar `painel-156/registro-painel.json`
- Se o id do painel 156 mudar, atualizar `canais.json › painel` e a constante `PANEL_URL` do JS do painel

---

## Limites e considerações

| Aspecto | Detalhe |
|---|---|
| Execuções | **1 por semana** (antes eram 2) |
| Duração estimada | 30–60 min (a execução monta ~21 reports, atualiza o painel e envia as mensagens) |
| Modelo | Claude Sonnet 5 (`claude-sonnet-5`) |
| Custo estimado | ~$1,50–3 por execução — **cerca de metade do custo semanal anterior** (a coleta e a revalidação rodavam duas vezes) |
| Recomendação de plano | **Pro** é suficiente |

---

## Perguntas frequentes

**Os reports aparecem com meu nome no Slack?**
Sim — as mensagens usam a identidade da conta que autenticou o Slack MCP na Rotina.

**O que as squads recebem no Slack?**
Uma mensagem principal por set (título, manchete e links) e, na thread, 3 respostas curtas que indicam o
que há no Report do painel. O detalhe fica no painel 156.

**Como corrigir algo antes de sair, já que não há mais rascunho?**
Rode com `MODO=TESTE` (painel 485 e `#the-voice-cx`) para revisar antes. Em produção, a Rotina faz uma
autoverificação (Fase 3.5) e omite o que não conseguir confirmar. Se algo sair errado, corrija o painel
e responda na thread do canal.

**E se a atualização do painel falhar?**
A Rotina tenta duas vezes. Se não der, a mensagem do Slack sai só com o link do painel 156 geral (sem link
de report de squad), e a falha aparece só na notificação interna.

**Onde está o report de Seguros?**
Seguros tem set próprio no canal `#seguro_pix-cartão_cx` (ID `C0BDW931ZA9`) e aparece no painel 156 (aba
Seguros › Report da squad). O RAF saiu do pipeline.

**Como ajusto o período (ex: mês anterior)?**
Edite o prompt da Rotina temporariamente antes de usar "Run now". Restaure depois.

**O que acontece se um MCP falhar?**
Seções dependentes daquele MCP são omitidas silenciosamente — o report continua com os dados
disponíveis. Databricks ou Slack indisponíveis encerram a execução e notificam. Total: 21 sets.

---

## Contato
Dúvidas: Artur Nunes — `@artur.nunes` no Slack ou artur.nunes@recargapay.com
