# Experiência do Produto RecargaPay (dashboard 156)

## Request
Rebuild the product experience dashboard as a modern, executive-first page: highlights (new themes, opportunities, immediate-attention items with their resolution status), a heatmap radar of products across day, week and month, general indicators with targets and period-over-period variation, customer voice (support tickets, NPS, app stores, social networks and Reclame Aqui) with real examples, a timeline of company movements with their effect on each channel, and one page per product with subproducts. Indicators must refresh daily from Databricks; the AI analysis must refresh weekly by an automation that only rewrites the `html` field.

## Business Question
How is the customer experience of each RecargaPay product changing versus the previous period, which company movements explain it, what are customers saying about it, and which new themes or opportunities need attention now?

## Architecture
- `js`, `css` and `queries` are fixed. They are published by hand and never touched by the weekly automation.
- Eight queries (below) feed all indicators through `window.__ARTURITO_DATA__.queries["..."]`. The JS turns the rows into the structure the page needs (week labels from ISO weeks, partial month detection, product mapping).
- The AI analysis lives in hidden blocks inside `html`: `<div hidden data-px-ia="meta|resumos|destaques|vozes|lojasredes|ra|eventos|exemplos|produto:{id}">{json}</div>` (20 blocks). All real customer examples (ticket, user, date) live in the single `exemplos` block and the themes cite them by id. A missing or invalid block only hides that part; the indicators never depend on it.
- A compressed history block `data-px-hist` (gzip + base64 JSON) keeps the highlights, their examples and the company movements of the last 3 weeks before the current one (4 weeks in total). The JS decompresses it on load and shows a week selector in the highlights section; indicators always follow the current week.
- A snapshot block `data-px-db` exists only in the first publication, so the page is populated before the first scheduled run. The JS ignores it as soon as the queries return rows.
- Highlights are rendered as a news front page: the five highest impact and urgency items (`rank` 1-5) are cards and ten more go to a "trending themes" list (15 in total). Every squad has at least one highlight, and correlated products can share a highlight. Each opens a side panel with all fields, charts and at least five examples when the week's volume allows.
- The radar heatmap has a Total row (overall indicator, not the sum of the rows).
- Each product has a Journey tab: stages of the product journey with the volume of feedbacks and the share of positive ones in the last 30 days (vs the previous 30), and, on click, an automatic analysis plus real comments (criticism and praise) from `Jornada Exemplos`. An optional AI note per stage can come from `produto.jornada` in the html blocks.
- The Movements section shows the last 30 days (relative to the viewing date) on a timeline; older AI events are hidden.
- Report links keep the format `...&r={key}/rep`; the JS opens the matching product.

## Main Tables
Certification status was not verified through `datahub_get_dataset` for this publication.

### `prod.cx.agg_overview` (certification not verified)
Support tickets and CSAT aggregated by day and vertical.
| Column | Type | Description |
|---|---|---|
| `date` | date | Day |
| `vertical` | string | Product vertical (lowercase, e.g. `cartao de credito do recargapay`, `pix`) |
| `source` | string | `tickets` or `experiencia` |
| `metric` | string | `csat` when `source = 'experiencia'` |
| `flg_human`, `flg_retention_bot` | boolean | Human contact / retained by the bot |
| `ticket_count` | bigint | Tickets |
| `promoter_like_count`, `neutral_count`, `detractor_dislike_count` | bigint | CSAT positive / neutral / negative answers |
| `friendly_service_channel` | string | Service channel; `derivacao` is excluded |

### `prod.cx.fat_indecx_metrics` (certification not verified)
NPS answers (IndeCX). Filters: `metric = 'nps-0-10'`, `deleted IS NOT TRUE`, `survey_type IN ('transacional','relacional')`. Product comes from `action_name`.

### `prod.cx.fat_app_reviews` and `prod.cx.fat_buzzmonitor_posts` (certification not verified)
App store reviews (`brand = 'RecargaPay'`, `length(content) > 15`) and social posts (types comment, reply, mention, review; emoji-only posts excluded). Product is inferred from the text with accent-free regular expressions, so a comment can count for more than one product.

### Journey queries (`Jornada Produtos`, `Jornada Exemplos`)
Comments from `fat_indecx_metrics` (NPS transactional and relational, `feedback` with 15+ characters) and `fat_app_reviews` in the last 60 days, split into `atual` (last 30 days) and `anterior` (30 days before). Product comes from `action_name` for transactional NPS and from accent-free regular expressions for the others; stages are matched by keyword regular expressions per product (an `et` VALUES table), so a comment can count in more than one stage. Positive = NPS 9-10 or store rating 4-5. `_total` is the number of distinct comments per product and `_sem` the comments with no stage. Examples: up to 3 positive and 3 negative comments per stage, 30+ characters, without long digit sequences, e-mails or links.

### Card type (`Cartão Tipos`)
Card type per user from `prod.credit_card.dim_card_account.credit_type`: COLLATERAL = Garantido, GRANTED = Concedido, INVESTMENT = Investimento (a user with several accounts takes the highest of INVESTMENT > GRANTED > COLLATERAL). Human support and bot retention come from `prod.cx.dim_zendesk_tickets_summary` (verticals starting with `cartão de crédito`, channel `derivacao` excluded) and transactional NPS from `fat_indecx_metrics` (`nps transacional cartão rp`), both joined by user. Tickets of users without a card account go to `cc_x` and are not shown. There is no per-user CSAT source, so card types show no CSAT.

### Insurance subproducts (`Seguros Subprodutos`)
Seguros has three subproducts. Pix e Cartão (`plan-pix-cartao-coacao`) and Acidente e Renda (`plan-ap-short-loans-medio`) come from `prod.checkout.dim_insurance_policy_lifecycle` (new policies by `policy_created_at`; cancellations requested by the user by `cancelled_at`; regret-period cancellations = `churn_type = 'SUSEP_WITHDRAWAL'`) and from `prod.checkout.fat_insurance_cx_contact` (tickets with `is_about_insurance`, attributed to the plan of the user's latest policy before the ticket; `is_unauthorized_claim` = disputes having bought it). Empréstimo is the loan insurance ("prestamista"): `prod.lending.snap_loan_insurance` (current rows; cancellations exclude `DEBT_SETTLEMENT`) and `prod.lending.agg_daily_loan_insurance` (insured / eligible contracts). Human support comes from the Zendesk verticals `seguros::proteção pix e cartões`, `seguros::seguro acidente e renda` and insurance reasons inside the `empréstimo` vertical. No NPS or CSAT by subproduct.

### `prod.cx.fat_hugme_tickets` (certification not verified)
Reclame Aqui complaints from HugMe by `creation_date`. Product comes from `vertical`; when empty, from `complaint_title` and `complaint_content`.

## Metrics
| Metric | Type | Description | Logic |
|---|---|---|---|
| Suporte humano | Quantity | Human contacts | `sum(ticket_count) WHERE source='tickets' AND flg_human` |
| CSAT | Percentage | Positive share of support ratings | `promoter_like_count / (promoter_like_count + neutral_count + detractor_dislike_count)` |
| NPS | Score | All answers of the product | `round((promoters - detractors) * 100 / answers)`; promoters 9-10, detractors 0-6 |
| Lojas: % positivas | Percentage | Store reviews with rating 4-5 | `positive / reviews` (no average rating: it only covers reviews with comments) |
| Redes: % negativas | Percentage | Negative share of social posts | Buzzmonitor sentiment; the positive label is unreliable |
| Reclame Aqui | Quantity | Complaints by creation date | `count(*)` |
| Jornada: % positivos | Percentage | Positive share of the comments that mention the stage | `positive comments / comments` in the last 30 days; stages with fewer than 5 comments are grey |

Targets are fixed in the JS: NPS 75 (minimum 55) and CSAT 80% (floor 75%).

## Key Notes
### Windows are relative to the current date
```sql
-- day: last 14 days; week: last 10 completed weeks (Monday-Sunday); month: last 6 months, current month partial
d >= date_sub(current_date(), 14)
d >= date_sub(CAST(date_trunc('week', current_date()) AS DATE), 70) AND d < CAST(date_trunc('week', current_date()) AS DATE)
d >= add_months(CAST(date_trunc('month', current_date()) AS DATE), -5) AND d < current_date()
```
### Product mapping
`fraude` sums the verticals `carteira desativada`, `chargeback recovery` and `conta desativada`; `emprestimo` uses the `emprestimo` vertical only (`emprestimo consignado` is a subproduct). Pix subproducts have no own support series. Top Up (phone top-up) uses the `topup` vertical; `adicionar dinheiro` (wallet cash-in), `movimentações financeiras` and `cashback e rendimento` are not mapped to a product. Transactional NPS of Consignado comes from `nps transacional loans consignado` (key `consignado`) and feeds only the Consignado subproduct; the Empréstimo product NPS stays on `nps transacional loans`.
### First-load behavior
Query results arrive as strings; the JS converts them. With no rows and no snapshot the page shows "waiting for the first load".

## Decisions & Assumptions
- Out of scope: Dia/Mês for store and social data by day (volume too small); CSAT by card type (no per-user CSAT source).
- The first publication replaced the previous 13 queries and the report-based JS. Arturito keeps the previous version in its history.
- The weekly week of the AI analysis may differ from the week of the indicators for a short time on Mondays; the page shows both.

## How to Validate
- 2026-11-02 week, `NPS Produtos`: key `geral` = 4,482 answers, 3,523 promoters, 578 detractors (NPS 66); `cartao` = 541 / 350 / 126 (NPS 41).
- 2026-11-02 week, `Reclame Aqui HugMe`: `total` = 514 complaints, `cartao` = 155, `emprestimo` = 132.
- `Suporte Verticais`, day 2026-11-08, vertical `pix`: 59 human contacts, 59 retained by the bot. Week 2026-11-02, vertical `topup`: 8 human contacts.
- 2026-11-02 week, `NPS Produtos`, key `consignado`: 10 answers, 7 promoters, 1 detractor (NPS 60).
- 2026-11-02 week, `Seguros Subprodutos`: Pix e Cartão 41,223 new policies, 14,911 user cancellations (4,159 in the regret period), 797 insurance contacts (554 disputing the purchase), 204 human tickets; Acidente e Renda 1,589 new policies and 79 user cancellations; Empréstimo 4,073 of 7,989 eligible loans insured.
- 2026-11-02 week, `Cartão Tipos`: Garantido 1,672 human contacts and NPS 36 (354 answers); Concedido 184 and NPS 54 (158); Investimento 157 and NPS 31 (29). The three types add up to the 541 NPS answers of the card.
