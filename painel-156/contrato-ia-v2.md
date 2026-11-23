# Contrato dos blocos de IA do painel 156 (v2)

O painel 156 tem duas fontes que mudam em ritmos diferentes. A Rotina semanal só mexe na segunda.

| Parte | Quem atualiza | Quando | Onde fica |
|---|---|---|---|
| Estrutura (JS, CSS) e 4 queries | Time de VoC, à mão | Só quando o layout ou uma métrica muda | Campos `js`, `css` e `queries` do Arturito |
| Indicadores (suporte, CSAT, NPS, lojas, redes, Reclame Aqui) | As 4 queries, no agendamento diário (11 10 * * * BRT) | Todo dia | `window.__ARTURITO_DATA__.queries[...]` |
| Análises de IA | Rotina semanal (Sonnet) | Segunda, 9:30 BRT | Blocos `<div hidden data-px-ia="...">` no campo `html` |

A Rotina envia ao Arturito **somente `html` e `rationale_md`**, nunca `js`, `css`, `queries` ou `schedules`.

## Como o html é montado

`painel-156/montar_html_painel.py` junta `shell.html` (a estrutura fixa) com os 20 blocos de IA. A Rotina:

1. escreve os JSON em uma pasta `ia/`, um arquivo por bloco (lista abaixo);
2. roda `python3 painel-156/montar_html_painel.py --ia ia --shell painel-156/shell.html --out html-painel-156.html --max-total 165000`;
3. corrige o que o validador apontar (até 2 rodadas); o que continuar inválido é **omitido** e o painel mostra "indisponível" só nessa parte;
4. envia `html-painel-156.html` e `rationale-painel-156.md` com `arturito_update_dashboard`.

O JS nunca quebra por causa da IA: bloco ausente ou com JSON inválido só some, e um aviso no topo lista o que ficou de fora. Se a semana da análise for diferente da semana dos indicadores (por exemplo, entre 9:30 e 10:11 de segunda), o aviso informa os dois.

## Arquivos em `ia/` (20)

| Arquivo | Conteúdo |
|---|---|
| `meta.json` | `semana` {`w` "W46", `ini` "09/11", `fim` "15/11/2026", `pub` "16/11/2026", `modelo`}, `pulso` (manchete + 1 a 2 frases, até 500 caracteres), `atencao` (lista de textos) |
| `resumos.json` | Um parágrafo analítico por seção, correlacionando resultados, vozes e eventos: `produtos`, `destaques`, `radar`, `indicadores`, `vozes`, `lojasredes`, `movimentos` (até 700 caracteres cada) |
| `destaques.json` | `novos`, `oport`, `agir`: até 5 cartões cada. Cartão: `t` (110), `p` (id do produto), `m` (número com variação, 120), `x` (260), `sl` (situação), `s` (evidência da situação, 180), `det` (análise, 600), `serie` {`l`, `v` (10 números), `u` "pts" se for NPS}, `serie2` (opcional), `ex` (pelo menos 5 exemplos, por id), `p` (produto principal) e `ps` (opcional: outros produtos correlacionados no mesmo destaque), `rank` (inteiro único de 1 a N, 1 = maior impacto e urgência; N = 15), `img` (opcional: link ou id de uma imagem da pasta do Drive; sem ela o painel usa a imagem do produto) |
| `vozes.json` | `reclamam`, `pedem`, `elogiam`: até 5 temas cada. Tema: `t`, `d` (240), `p`, `det`, `serie`, `ex` |
| `lojasredes.json` | `texto` (700), `aviso`, `loja` {`temas`, `neg`, `pos`}, `rede` {`temas`, `neg`, `falsopos`} |
| `ra.json` | `texto` (700), `aviso`, `temas`: até 12, cada um com `t`, `p`, `v` (10 números por semana), `det`, `ex` (até 2) |
| `eventos.json` | Até 12 movimentos, do mais recente ao mais antigo: `d`, `t`, `tipo`, `res` (220), `imp` (até 5 itens [canal, nível, texto]), `analise` (440), `marca` (300), `pred` (300) |
| `exemplos.json` | **Bloco único de exemplos reais.** Objeto `{"e1": {"t": trecho do cliente (até 112 caracteres, cortado com …), "m": "Suporte · ticket 46715308 · 04/11 · usuário 32366365"}, ...}`. Destaques, vozes, motivos, Reclame Aqui, lojas e redes citam os exemplos **por id** (`"ex": ["e1","e7",...]`), então o mesmo exemplo pode aparecer em vários temas sem repetir o texto |
| `produto-{id}.json` | Um por produto (`pix`, `cartao`, `emprestimo`, `t2p`, `link`, `conta`, `seguros`, `cdb`, `transp`, `fraude`, `boletos`, `topup`): `analise` {`clientes` (650), `mudou` (550), `atencao` (até 3 de 220)}, `motivos` (até 4, com `det`: `res` 320, `dor` até 3, `exp` 220, `falha` até 1, `ex` pelo menos 5 por id), `temas` (até 4), `exemplos` por canal (até 2), `mencoes` {`texto` (750), `ra` (até 3 exemplos)}, `eventos` (até 3), `jornada` (obrigatório: `{"etapa": "análise de até 300 caracteres, com evidência"}` para as 3 etapas de maior volume da aba Jornada e para as que fogem da média do produto; ids de etapa por produto no `ETAPAS` do `validar_ia.py`; os números vêm das queries de jornada) |

`exemplo-ia/` traz os 20 arquivos da W45 como modelo de campos e de tom (veja o LEIA-ME da pasta: ele passa na validação normal, mas não no `--completo`). Use-os como modelo de campos e de tom.

### Situação dos destaques (`sl`)
`Resolvido`, `Parcialmente resolvido`, `Em andamento`, `Em acompanhamento`, `Em apuração`, `Sem solução registrada`, `Sem registro`, `Não resolvido` ou `Estável`. O campo `s` traz a evidência com data. Sem evidência, use `Sem registro`.

## Histórico de semanas (pelo menos 4 semanas)
Os blocos de IA do html são substituídos por completo a cada rodada, então o painel mantém o histórico num bloco separado e comprimido: `<div hidden data-px-hist>BASE64</div>` (JSON em gzip + base64). O JS só o descomprime quando a página abre (`DecompressionStream`), e o código do painel cresce ~3 KB.

- **O que cada semana guarda** (`historico/{W}.json`): `semana`, `pulso`, `resumo` (da seção Destaques), os 15 `destaques` (com no máximo 3 exemplos cada, resolvidos num `exemplos` próprio da semana), e os `eventos` cujo dia cai dentro daquela semana (a lista da rodada cobre 30 dias; cada semana guarda só os seus).
- **No painel:** um seletor "Semana" acima dos Destaques, da mais antiga para a atual (da esquerda para a direita), que abre sempre na atual (W atual + 3 anteriores). A semana arquivada mostra os 5 cards, os 10 temas em alta, o painel de análise de cada um e a lista "Movimentos da semana". Os indicadores continuam sempre os da semana atual, e a aba "Destaques" de cada produto também.
- **Custo no html:** ~11 KB por semana arquivada (comprimido). Com 3 semanas anteriores: ~35 KB; com 7: ~85 KB. Teto do montador: 260 KB.
- **Rotina:** `arquivar_semana.py` (grava a semana da rodada), `extrair_historico.py` (restaura `historico/` a partir de um html publicado) e `montar_html_painel.py --historico historico/ --semanas-historico 3`. A pasta `historico/` guarda todas as semanas; o painel usa as 3 mais recentes antes da atual. Sem histórico, o painel mostra só a semana atual.
- **Limites:** exige navegador com `DecompressionStream` (Chrome, Edge, Safari 16.4+, Firefox 113+); sem ele o seletor não aparece. As semanas arquivadas guardam 3 exemplos por destaque (a semana atual mostra todos). Vozes, lojas, redes e Reclame Aqui não entram no histórico.

## Completude obrigatória (toda rodada)
A rotina semanal escreve **os 20 blocos completos em toda execução, inclusive em MODO=TESTE e em envios para DM**. Não existe execução reduzida: o montador recusa gerar o html se `python3 validar_ia.py ia --completo` tiver qualquer erro, e um painel parcial nunca é publicado (a semana anterior permanece e os erros vão para a notificação interna).

O modo `--completo` exige:
| Bloco | O que precisa existir |
|---|---|
| `meta` | `imagens` com os 12 produtos (link da pasta do Drive) |
| `destaques` | sempre 15; todos com `img` e pelo menos 5 `ex`; todo squad coberto |
| `vozes` | `reclamam`, `pedem` e `elogiam` com pelo menos 3 temas cada, `serie` de 10 semanas e pelo menos 5 `ex` por tema (NPS, lojas e redes) |
| `lojasredes` | `loja` e `rede` com pelo menos 3 temas e 5 exemplos negativos |
| `ra` | pelo menos 8 temas de `fat_hugme_tickets`, série de 10 semanas e pelo menos 5 reclamações literais por tema |
| `eventos` | pelo menos 1 movimento dos últimos 30 dias |
| `produto-{id}` (12) | `analise` completa, `motivos` com pelo menos 5 exemplos (ou todos, se o motivo tem menos contatos), `temas`, `mencoes.texto`, `eventos` (pode ser `[]`) e `jornada` com pelo menos 3 etapas |
| Seguros | `subs` com `seg_ar`, `seg_emp` e `seg_pix`: análise, temas e pelo menos 5 exemplos |

**`base_pequena: true`** (no destaque, tema, voz, subproduto ou produto) dispensa a regra de pelo menos 5 exemplos, de `temas` e de `jornada` quando o volume da semana realmente não permite (ex.: Seguros teve 2 feedbacks em 30 dias). Nunca vale para um destaque, voz ou tema de Reclame Aqui com volume, e deve ser citada na notificação interna.

**Frases literais** são trechos reais do cliente (NPS, ticket, loja, rede ou Reclame Aqui), sem nome, CPF, e-mail ou telefone, nunca resumos. Para tickets, use a mensagem mais longa do cliente; se a transcrição estiver atrasada, use os dias mais recentes e complete com as outras fontes.

**Imagens:** em toda rodada a pasta do Drive é listada inteira (todas as páginas, nunca só por palavra-chave) e cada destaque e cada produto recebe a imagem que combina com o tema. Se o Drive falhar, use `imagens-drive.json` (`padrao_por_produto`); `img` nunca fica vazio.

### Cobertura: todo squad tem pelo menos um destaque
- São **15 destaques** por semana: 5 cards e 10 temas em alta.
- **Todo squad do registro** (`registro-painel.json`, campo `painel` de cada canal) precisa aparecer em pelo menos 1 destaque, em `p` ou em `ps`. Se um squad não tiver cenário de impacto, traga o fato mais relevante do produto (variação, ponto de atenção ou referência positiva), sempre com a situação e a evidência. O validador **erra** quando um squad fica sem destaque e avisa quando um produto fica sem.
- Um produto ou squad **pode aparecer em mais de um destaque**, e produtos **correlacionados podem ser misturados em um mesmo destaque** (ex.: Tap to Pay e Link de Pagamento no "não recebeu a venda"; Cartão e Empréstimo na fatura que vem de empréstimo): coloque o principal em `p` e os demais em `ps`. Não force a mistura quando os produtos não têm relação.

### Como os destaques aparecem
A seção "Destaques da semana" tem formato de portal de notícias e separa os destaques pelo `rank`:
- **Principais da semana:** os 5 primeiros (`rank` 1 a 5) viram cards. O `rank` 1 é o card maior, com o gráfico de `serie`; os outros 4 ficam em grade. O card mostra imagem, `m` em destaque, categoria, produto, `t`, `x` e `sl`.
- **Temas em alta:** os demais (`rank` 6 a 15, até 10) entram numa lista ao lado, com miniatura, título, categoria, produtos e `m`. São os temas de menor impacto ou urgência, mas importantes de acompanhar.
- **Ao abrir** um card ou um item da lista, o painel lateral mostra tudo: `m`, `x`, `sl` com `s`, `det` em tópicos, `serie` e `serie2` em gráficos grandes, `ex` e o link do produto.

Como ranquear: some **impacto** (tamanho da variação, quantidade de clientes ou contatos afetados, risco para NPS, CSAT, reputação e receita) e **urgência** (situação: `Não resolvido` e `Sem solução registrada` vêm antes de `Em andamento`; tema novo ou em aceleração vem antes de tema estável). Oportunidades já em andamento e destaques positivos entram na lista. Sem `rank`, o painel usa uma ordem de reserva (Atenção imediata, depois Temas novos, depois Oportunidades, e dentro de cada grupo pela situação), então defina o `rank` em todos. Escreva `det` em todo destaque (o validador avisa quando falta) e `serie` sempre que houver número de 10 semanas.

### Notícia da semana no card do produto
A **primeira frase** de `analise.clientes` (se faltar, a primeira de `analise.mudou`) aparece no card de cada produto, abaixo das métricas, com o rótulo "Notícia da W46". Escreva-a como uma frase completa e autônoma, que conte a notícia do produto na semana, com até cerca de 300 caracteres (o card mostra no máximo 6 linhas). O texto completo fica na abertura do produto.

### Movimentos dos últimos 30 dias
`eventos.json` traz os movimentos dos **últimos 30 dias** (até 20), do mais recente ao mais antigo. O painel mostra só os que caem nos 30 dias anteriores à data de visualização. Para eventos da semana ainda em andamento, use `"Sem efeito"` com o texto "ainda não medido" em `imp`.

### Imagens (pasta do Drive)
As imagens do painel vêm da pasta do Drive `1ZEWdNRx9Hb09SbylBFLkgX1PLi25bxG6` (imagens do Design System em .webp). A rotina lista a pasta a cada execução (busca `parentId = '1ZEWdNRx9Hb09SbylBFLkgX1PLi25bxG6'` no conector do Google Drive), escolhe pelo nome a imagem que combina com cada tema (ex.: `media-cartao-atencao` para problema no Cartão, `media-sem-internet` para instabilidade) e grava:
- em cada destaque, `img` = `https://lh3.googleusercontent.com/d/<id>=w400` (também aceita só o id ou o link de compartilhamento do Drive);
- opcionalmente, em `meta.json`, `imagens` = `{"cartao": "<link ou id>", ...}` para trocar a imagem padrão de um produto (`_` troca a imagem genérica).
Não invente ids: se nenhuma imagem combinar, deixe sem `img` e o painel usa a imagem padrão do produto. Se a imagem não carregar, o painel tenta a miniatura do Drive e, por último, mostra o emoji do produto. **A pasta precisa estar compartilhada como "Qualquer pessoa com o link: Leitor"**; se estiver privada, todos veem o emoji.

### Análise por subproduto (`subs` no produto)
Um `produto-{id}.json` pode ter `subs`: `{"<id do subproduto>": {analise, motivos, temas, exemplos, eventos, mencoes}}`. Quando o leitor escolhe o subproduto no painel, cada campo presente em `subs` substitui o do produto; o que faltar vem do produto. Use `[]` para esvaziar um campo que não vale para o subproduto (por exemplo, `motivos` sem volume).
**Seguros** tem três subprodutos e a rotina escreve os três toda semana:
- `seg_pix` (Pix e Cartão, plano `plan-pix-cartao-coacao`): contatos de segurados em `prod.checkout.fat_insurance_cx_contact` (contesta a contratação, pede estorno, quer cancelar, só dúvida) e apólices e cancelamentos pedidos pelo cliente em `prod.checkout.dim_insurance_policy_lifecycle`.
- `seg_ar` (Acidente e Renda, plano `plan-ap-short-loans-medio`): as mesmas duas bases.
- `seg_emp` (Empréstimo, seguro prestamista): `prod.lending.snap_loan_insurance` e `agg_daily_loan_insurance` (adesão e cancelamento sem os de quitação antecipada) e os tickets com motivo de seguro na vertical Empréstimo.
Os números de cada subproduto saem da query `Seguros Subprodutos`; os exemplos vêm de `user_quote` (contatos classificados) ou da transcrição, sempre com ticket e data.

## Regras de escrita (o validador verifica o que dá para verificar)

- **Semanas:** "W46", nunca "S46".
- **Nomes:** "Suporte humano", nunca "N1" ou "N2"; Pix In, Pix Out Wallet e Pix Out CC sempre separados; "o RecargaPay".
- **Emoji:** não escreva. O painel acrescenta o emoji ao nome do produto.
- **Ações:** não sugira. Indique a oportunidade ou o problema e verifique se já foi resolvido.
- **Números:** todo número vem das queries ou da leitura das transcrições. Nos textos executivos sobre contatos humanos, bot e automações, só crescimentos e variações, sem valores de contatos ou tickets.
- **NPS:** o de todas as respostas do produto. O NPS de quem comentou só aparece rotulado como tal.
- **Lojas de apps:** volume e % de avaliações positivas, sem nota média de estrelas. A % positiva das redes não é confiável (o Buzzmonitor classifica reclamações como positivas): use a negativa.
- **Amostragem:** leia no mínimo 30 conversas por motivo, ou todas se houver menos, e **não informe** a quantidade nos textos.
- **Exemplos:** trecho real de até 112 caracteres (corte com …), guardado em `exemplos.json` e citado por id. `m` = canal, id do ticket ou usuário e data (dd/mm). Remova nome, CPF, CNPJ, e-mail, telefone, links e nome de atendente. Para tickets, prefira a **mensagem mais longa do cliente** (as primeiras costumam ser só cliques de menu como "Falar com atendente").
- **Pelo menos 5 exemplos** em cada destaque, em cada tema de "O que os clientes dizem" e em cada motivo de contato dos produtos (o validador avisa quando faltar). Reaproveite exemplos entre temas parecidos. Se o volume da semana não permitir 5 (motivo com poucos tickets), use todos os que existirem e registre na notificação interna.
- **Reclame Aqui:** base `prod.cx.fat_hugme_tickets`, pela data da reclamação. O id do cliente na HugMe não é o userId do RecargaPay. Não use "recarga" sozinha para classificar transporte (casa com o nome do RecargaPay); use bilhete, transporte ou ônibus.
- **Tamanho:** o html completo fica abaixo de 165 KB (o maior tamanho já aceito pelo Arturito é cerca de 167 KB). Os limites acima mantêm o conjunto em cerca de 164 KB (a W45 tem 164 KB). Se a Rotina tiver dificuldade para enviar o html, reduza exemplos e `det` antes de tudo.

## Links dos reports

Os links do Slack seguem `{url_base}&r={chave}/rep`. O JS abre o produto correspondente (por exemplo `r=cartao/rep` abre o Cartão e `r=fraude/conta desativada/rep` abre Bloqueios, subproduto Conta Desativada). `r=geral/rep` abre a página inicial.
