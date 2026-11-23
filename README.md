# VoC-Product-Reports — v3.23 (23/11/2026)

Painel 156 (Experiência do Produto) e Rotina única de reports VoC.

| Caminho | O que é | Onde vai |
|---|---|---|
| `prompt-rotina-unica.txt` | Prompt v3.23 da rotina semanal | Rotina "Report Produto A" e repositório |
| `painel-156/` | Contratos, validadores, montador, scripts de histórico, registro dos canais, shell, JS, CSS, 8 queries, documentação, exemplos e `historico/` (semente W45) | Repositório (substitui a pasta inteira) |
| `publicacao-arturito/` | Pacote de publicação manual do 156 (CSS, JS, queries, documentação, previews). **Não cole o `4-html-inicial.html`**: a rotina já publica o html semanal | Referência; **cole o JS e o CSS novos** |
| `MUDANCAS-v3.23.md` | O que mudou e o checklist | Repositório |

## v3.23: histórico de 4 semanas nos destaques
- Seletor de semanas nos Destaques, da mais antiga para a atual (abre na atual), com destaques, exemplos e movimentos arquivados; dados num bloco comprimido do html (~11 KB por semana), sem peso no código (JS +3 KB).
- Rotina: `historico/` (uma semana por arquivo), `arquivar_semana.py`, `extrair_historico.py` e `montar_html_painel.py --historico`.
- Veja `painel-156/contrato-ia-v2.md` (seção "Histórico de semanas") e `publicacao-arturito/preview-historico-TESTE.html`.

## Pendente fora deste pacote
- Colar o novo JS e CSS no dashboard 156.
- Alinhar `SKILL.md` e `canais.json` (template antigo do Slack, Report Executivo separado, RAF).
- Repositório mudou de endereço (`rp-arturnunes/VoC-Product-Reports`): conferir referências.
- Conferir o `ia/` da W46 com `validar_ia.py --completo` e rodar a rotina em `MODO=TESTE`.
