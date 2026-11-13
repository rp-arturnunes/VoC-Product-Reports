# Reports de squad no painel 156 — contrato de dados (v1.1) e procedimento semanal

Lido pela **Rotina única** (Fase 4B do `SKILL.md`). A v1.1 acrescenta o **detalhe aprofundado** (`det`, §8): cada motivo de contato e cada card de menções abre uma tela lateral no painel.

## 1. Formato: dados em JSON, layout fixo no painel
O layout (CSS e JS) já está publicado no painel 156 e desenha qualquer report que siga este contrato. A automação entrega só **conteúdo**.

- Cada report é um bloco oculto no campo `html` do painel: `<div hidden data-px-report="cartao">{...JSON...}</div>`.
- A atualização semanal envia **somente `html` e `rationale_md`**. Nunca `js`, `css` nem `queries` (um JS truncado já derrubou o painel em 04/09).
- Seção ausente no JSON = seção não aparece. Nunca escrever "N/D" nem placeholder.
- No JSON enviado ao painel, os caracteres `&`, `<` e `>` saem como `\u0026`, `\u003c` e `\u003e` (o `montar_html_reports.py` já faz isso). Dentro do texto só `<b>…</b>` é permitido.

## 2. Campos
| Campo | Obrig. | Conteúdo | Limite |
|---|---|---|---|
| `squad` | ✔ | `geral, pix, cartao, emprestimo, t2p, link, account, seguros, cdb, transporte, fraude, outros` | |
| `sub` | | sub-produto (ex.: `conta desativada`, `cartao`); `executivo` quando `squad=geral` | |
| `rot`, `periodo`, `pub` | ✔ | `"Semana 41"`, `"05/10 – 11/10/2026"`, `pub` = AAAA-MM-DD do dia da publicação | |
| `meta` | | linha de dados (período, janela de comparação, data de publicação) | |
| `resumo` | ✔ | mesma mensagem raiz do set | 520 car. |
| `alertas` | | `{t, v, bot, n, ctx, txt, aberto}` (só limiares atingidos) | 4 |
| `monit` / `ok` | | `{t, txt}` / texto curto | 5 / 4 |
| `kpis` | | `{l, v, d, sub, serie[3–8], ref, st, sc, cls}`; `cls` = `up` (ruim), `down` (bom) ou `flat` | 6 |
| `funil` | | `{partes:[{l,n,p,wow}], total, nota}` | |
| `motivos` / `causas` | | `{t, n, ant, var, det?}` / `{t, n, ant, bot, txt}` | 6 / 5 |
| `recl` | | `{motivo, n, var, resumos, nr, cob, temas[[nome,n]], exp[], cor[], ex[], aberto}` | 5 (temas 6; exp/cor/ex 3) |
| `mencoes` | | `{cards[{f,v,sub,serie,lis[],det?}], cor[], trechos[{txt,f}], fonte}` — NPS Relacional, NPS Transacional (por cluster), Lojas de apps e Redes sociais | 4 cards, 3 trechos |
| `cenario` | | `{t, sub, serie[[rótulo,valor,nota]], base, marc{rótulo:texto}, fatos[{v,t}], fecho}` | |
| `eventos` | | `{d, tag, g(bad/hot), txt, old}`; `old:true` vai para "semanas anteriores"; o `txt` termina com `Impacto: …` (indicador, variação e comparação com a semana anterior; ou `Impacto: sem variação relevante nos indicadores`) | 14 |
| `atualiz` | | `{t, itens[], nota, link{t,u(https)}, fonte}` | 5 itens |
| `rodape` | | `{fonte}` | |

Fonte de correlação vai como `[[Report S41]]` ou `[[#canal, 07/10]]`. Mesmas regras de inferência do `SKILL.md`: só afirmar o que tem fonte e data; correlação é "coincide com", nunca "causou".

**Arquivos de apoio desta pasta:** `modelo-report.json` (mínimo; falha na validação de propósito, para não ser publicado com placeholder), `exemplo-seguros-s40.json` (report completo de uma semana passada: copiar a estrutura, nunca o conteúdo) e `exemplo-det.json` (**exemplo real do detalhe `det` de um motivo**, em Cartão: copiar o nível de profundidade e a estrutura, nunca o conteúdo).

## 3. Orçamento de tamanho (v1.1)
- Alvo por report: 24 KB. Limite duro: 40 KB.
- `det` de motivo: alvo 5,2 KB, limite duro 7 KB. `det` de card de menções: até ~3 KB.
- `det` só nos **3 maiores motivos** de cada report (mínimo de 15 contatos) e nos cards de menções.
- Total dos blocos de dados: até 320 KB (`montar_html_reports.py`). **Acima de ~155 KB ainda não foi testado no Arturito**: validar antes em `MODO=TESTE` (painel 485).
- Para caber: `recl` com 3 motivos, `eventos` dos últimos 14 dias, `trechos` com 2, relatos curtos.
- Se passar do limite, o `montar_html_reports.py` aborta e nada é enviado.

## 4. Registro e links (`registro-painel.json`)
Cada saída da automação tem uma **chave do painel** (`squad[/sub]`):
- 21 saídas do Slack (Geral, Executivo e 19 produtos) → 20 chaves, porque **Boleto de Cobrança é fundido em Contas e Boletos** (chave `outros/utilities`, um report só).
- **Seguros** (`seguros`) tem set próprio em `#seguro_pix-cartão_cx` (ID `C0BDW931ZA9`). O RAF saiu do pipeline (sem report, seção ou menção).

**Link de um report:** `https://optimus.recargapay.com/PHP/dashboard_view.php?id=156&r=<chave>/rep` (`&` simples, nunca `&amp;`; sub-produto com espaço vira `%20`; acento vira percent-encoding). O painel roda em iframe isolado: o `#` da URL não chega ao JS, mas a query da página principal chega pelo `document.referrer`, por isso o parâmetro é `r`.

## 5. Procedimento semanal da Rotina
1. Para cada report, gravar um arquivo `.json` em um diretório novo (ex.: `/tmp/painel-saida/`), uma chave por arquivo. A chave vem do próprio JSON (`squad` + `sub`).
2. Rodar:
   `python3 painel-156/montar_html_reports.py --skeleton painel-156/html-esqueleto.html --registro painel-156/registro-painel.json --reports-dir /tmp/painel-saida --out /tmp/painel-saida/html_final.html --manifest /tmp/painel-saida/manifest.json`
   Ele valida cada report (inclusive o `det`), confere o total, monta o campo `html` e grava o manifesto (`publicados`, `ausentes`). Qualquer erro aborta sem gravar nada.
3. Enviar ao Arturito: `arturito_update_dashboard(dashboard_id=156, html=<conteúdo de html_final.html, sem alterar>, rationale_md=<conteúdo de rationale-painel-156.md>)`. **Só esses dois campos.**
4. Conferir a resposta (`status: success`, `snapshot_version`). Se a ferramenta devolver o dashboard de volta, conferir tamanho do `html`, quantidade de blocos `data-px-report` e o marcador final `<!--px-reports-end-->`; se faltar o marcador, o envio foi cortado: reenviar uma vez.
5. Usar o manifesto: só quem está em `publicados` recebe o link do report no Slack.

## 6. O que ainda não foi testado
- ❌ Envio de html com mais de ~155 KB de dados numa única chamada (o detalhe `det` aumenta o total). Testar primeiro no painel 485.
- ❌ A Rotina lendo ~30 conversas por report (custo e tempo da Fase 3); o orçamento está em `canais.json › analise_profunda`.
- ⚠️ O painel foi validado com o detalhe de um motivo real (Cartão, piloto de 09/11/2026); os demais produtos ainda não.

## 7. Tela lateral no painel
- Clicar na linha de um motivo (tabela "Motivos e causas raiz") ou no card de uma fonte (seção "Menções ao produto") abre a tela lateral. `Esc`, o botão × ou o fundo escuro fecham.
- Motivo ou card **sem `det`** continua como era (sem clique).

## 8. Detalhe aprofundado (`det`) — contrato v1.1

### 8.1 `motivos[i].det` (motivo de contato, N1 humano)
```json
{
 "res":  "o achado em 1–2 frases (até 360 car.)",
 "cen":  "cenário: volume, causas, gatilho e ponto da jornada (até 900 car.)",
 "dor":  ["dor nas palavras do cliente, com a contagem da amostra", "... (até 4)"],
 "exp":  "expectativa que falhou, só quando o cliente a descreve",
 "falha":[{"o":"Produto|App|Bot|Central de Ajuda|Atendimento|Processo|Canal","t":"o que falha; inferência começa com 'Indício:'"}],
 "causas":[["causa", 188], ["outra", 173]],
 "serie":[207, 367], "serie_lbl":["sem. anterior","sem. atual"],
 "ev":   [{"d":"19/10","f":"#canal ou report","t":"o que a squad sinalizou","e":"efeito observado"}],
 "rel":  [{"t":"trecho curto sem nome (até 260 car.)","m":"ticket 12345 · canal · tema"}],
 "base": {"lidos":25,"total":367,"met":"como a amostra foi tirada","lim":"limite da leitura"}
}
```
Limites: `dor` 4, `falha` 4, `causas` 7 (6 + "Outras causas"), `ev` 4, `rel` 5, `serie` 2–8 números. **`base.lidos` é obrigatório** (conversas completas realmente lidas).

### 8.2 `mencoes.cards[i].det` (fonte de feedback)
```json
{
 "sub": "linha de apoio opcional", "resumo": "visão geral da fonte",
 "temas":[{"t":"tema","n":14,"tom":"neg|neu|pos|mix","x":"trecho ou explicação"}],
 "cl":   [{"c":"cluster do cliente","nps":42,"n":120,"x":"o que dizem"}],
 "ux":   [{"t":"navegação","n":3,"tom":"neg","x":"trecho"}],
 "ev":   [{"d":"10/10","f":"fonte","t":"evento","e":"efeito"}],
 "rel":  [{"t":"trecho curto","m":"origem"}],
 "base": {"met":"como as menções foram lidas"}
}
```
Limites: `temas` 6, `cl` 8, `ux` 3, `ev` 4, `rel` 5. `cl` só no card de NPS Transacional.

### 8.3 Regras
Mesmas de todos os reports: só afirmar o que tem fonte e data; correlação é "coincide com"; sem PII (nome do cliente, e-mail, CPF, telefone); sem trecho bruto de transcrição (`Conversation with`, `autor=`); só `<b>…</b>` como marcação. O validador (`validar_report.py`) reprova o que quebrar o contrato.

## 6. Reports no Slack (v3.21): um report por canal
**Regra central:** cada canal recebe **um único report** (uma mensagem principal com a sua thread). São 11 canais; o registro (`registro-painel.json`, chave `canais`) lista o canal, o tipo e os produtos de cada um. Os 21 reports de análise (seção 2) continuam a alimentar o painel e as respostas; eles **não** viram mais um post cada.

| Canal | Tipo | Respostas na thread |
|---|---|---|
| #cxm-team | geral | Resumo geral · Destaques da semana · Menções por produto |
| #lideres-cx-e-cxm | executivo | as mesmas 3 respostas |
| #account_cx | produto | Minha Conta |
| #cc-produto-e-cx | produto | Cartão de Crédito |
| #cx_fraud | produto | Conta Desativada · Carteira Desativada · Chargeback Recovery |
| #investments-e-cx | produto | CDB · Rendimento CDI · Movimentações Financeiras |
| #melhoria-continua-verticais | produto | Transporte · Contas e Boletos (inclui Boleto de Cobrança) · Recarga de Celular |
| #pixcc-home-raf-cx | produto | Pix · Pix CC |
| #squad_loan_seguimento | produto | Empréstimo Pessoal · Empréstimo Consignado |
| #subacquirer-cx | produto | Tap to Pay · Link de Pagamento |
| #seguro_pix-cartão_cx (C0BDW931ZA9) | produto | Seguros |

**RAF:** removido. Não há report, seção nem menção de RAF; o canal `#pixcc-home-raf-cx` só mantém o nome e recebe Pix e Pix CC.

**Mensagem principal** (todos os canais): 1ª linha `:bar_chart: Report VoC — {nome} · Semana {NN} · {DD/MM}–{DD/MM/AAAA}`; 2ª linha a manchete em `**negrito**`; depois a linha fina. Canais de produto acrescentam "Na thread: um resumo, os destaques da semana e as menções de cada produto ({produtos})" e o link **Experiência RecargaPay**. Executivo e geral terminam com **só o link do painel** (`url_base`, sem `&r=`).

**Canais de produto, uma resposta por produto** (na ordem do registro): `**{Produto}**` · `**Resumo:**` (2 a 3 frases, números contra a semana anterior e correlação com eventos) · `**Destaques da semana:**` (2 a 4 itens, com a situação; saem dos destaques do painel em que o produto aparece em `p` ou `ps`, e todo squad tem pelo menos um) · `**Menções:**` (NPS Relacional, lojas, redes e Reclame Aqui, uma linha cada; só as que existirem, sem "sem menções") · link `Ver no Report de {produto}` (`{url_base}&r={chave}/rep`). Se o report do produto não foi publicado, `"link_painel": true` e o link é o do painel geral.

**Executivo e geral, 3 respostas:** **Resumo geral** (resultado, satisfação, volume e reputação, **só variações, sem valores de contatos ou tickets**) · **Destaques da semana** (os 5 primeiros do painel, `rank` 1 a 5, com a situação) · **Menções por produto** (uma linha por produto que tiver menção). Nenhuma resposta tem link.

**Formato do arquivo** (`slack-saida/{slug}.json`, um por canal):
```json
{"canal": "#pixcc-home-raf-cx", "tipo": "produto", "principal": "texto da mensagem principal",
 "threads": [{"produto": "Pix", "chave": "pix", "texto": "..."}, {"produto": "Pix CC", "chave": "pix/cartao", "texto": "..."}]}
```
Executivo e geral usam `{"secao": "Resumo geral", "texto": "..."}` nas respostas. Exemplos reais da W45 (Pix e Pix CC, executivo e Cartão) em `exemplo-slack-w45/`.

**Validação antes do envio:** `python3 painel-156/validar_slack.py --registro painel-156/registro-painel.json --saida slack-saida`. Barra: canal faltando ou report extra no mesmo canal; número ou ordem de respostas diferente do registro; executivo/geral com mais de um link ou com link que não seja o do painel 156; resposta de produto sem exatamente 1 link do próprio report; valor de contatos ou tickets no executivo; texto de RAF; `S46`, `N1/N2`, "a RecargaPay"; negrito com um asterisco; `&amp;`; link sem hiperlink; emoji; "sem menções"; e textos acima de 3.000 (principal) ou 3.500 caracteres (resposta).
