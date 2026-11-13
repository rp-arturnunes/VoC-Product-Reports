# VoC-Product-Reports — v3.21 (13/11/2026)

Painel 156 (Experiência do Produto) e Rotina única de reports VoC.

## O que tem aqui
| Caminho | O que é | Onde vai |
|---|---|---|
| `prompt-rotina-unica.txt` | Prompt v3.21 da rotina semanal | Rotina "Report Produto A" e repositório |
| `painel-156/` | Arquivos que a rotina lê: contratos, validadores, montador, registro dos canais, shell, JS, CSS, 8 queries, documentação e exemplos da W45 | Repositório (substitui a pasta inteira) |
| `publicacao-arturito/` | Pacote de publicação manual do dashboard 156: CSS, JS, html inicial, as 8 queries em SQL, documentação, descrição e o preview offline | Referência; o Arturito já tem as queries e a documentação (versão 198) |
| `MUDANCAS-v3.21.md` | O que mudou, checklist da rotina e dúvidas em aberto | Repositório |

## O que mudou na v3.21
- Slack: um report por canal (11 canais), uma resposta por produto na thread, executivo e geral só com o link do painel, RAF removido. Validador `painel-156/validar_slack.py`.
- Destaques: 15 (5 cards + 10 temas em alta), todo squad com pelo menos um cenário, produtos correlacionados no mesmo destaque (`ps`).
- Seguros com 3 subprodutos (Acidente e Renda, Empréstimo e Pix e Cartão), query `Seguros Subprodutos` e análise por subproduto.
- NPS Transacional do Empréstimo Consignado; Top Up pela vertical `topup`.
- Imagens dos destaques da pasta do Drive; html semanal com teto de 185 KB.

## Pendente fora deste pacote
- Alinhar `SKILL.md` e `canais.json` (template antigo de 3 respostas por report, Report Executivo separado e entradas de RAF).
- Pasta do Drive com acesso "Qualquer pessoa com o link: Leitor".
- Colar o JS (`publicacao-arturito/3-js.js`) no dashboard 156 e rodar a rotina uma vez com `MODO=TESTE`.
- Pode apagar do repositório: `catalogo-imagens-design-system.json`, `montar_html_reports.py` e `html-esqueleto.html` (nada usa).
