# Tabela de Eventos e Incidentes (Fase 1) - leitura de Slack em 23/11/2026

Janela principal: 09/11 a 22/11 (14 dias). Contexto anterior (24/10 a 08/11) no final. Canais lidos: #cxm-team, #lideres-cx-e-cxm, #comunicados_e_atualizações_cx, #account_cx, #cc-produto-e-cx, #cx_fraud, #investments-e-cx, #melhoria-continua-verticais, #pixcc-home-raf-cx, #squad_loan_seguimento, #subacquirer-cx, #seguro_pix-cartão_cx e #the-voice-cx (só como fonte de eventos; sem posts de rascunho). Horários em BRT. Sem nomes de pessoas. Resolução só quando a mensagem informa.

## 09/11 a 22/11 (mais recente primeiro)

| Data | Canal de origem | Produto(s) | Tipo | Descrição | Status / resolução |
|---|---|---|---|---|---|
| 22/11 | #the-voice-cx | Pix, Checkout (Payments) | Incidente | Pagamentos com wallet, sobretudo Pix, falharam por volta da meia-noite (alerta de envio de Pix + P1 em Payments): 00h18 a 03h21, cerca de 104 mil ordens com erro e queda de 34% nas aprovações. 132 contatos, 86 com humano; 73% dos tickets humanos com sentimento negativo | Resolvido 03h21; engenharia ainda concilia débitos de wallet sem ordem aprovada |
| 22/11 | #the-voice-cx, #lideres-cx-e-cxm (alertas da Central) | Tap to Pay | Incidente | Atraso no pagamento de vendas: alerta automático desde 02h00 (novo ciclo 14h05), até 19h34; 12 contatos, todos com humano; aviso do bot não apareceu em nenhuma conversa | Resolvido 19h34 (segundo #the-voice-cx) |
| 22/11 | #cx_fraud | Carteira Desativada (saldo bloqueado) | Comunicado/status | Backlog de carteiras bloqueadas em 2.370 (2.634 no dia anterior; 3.814 em 15/11), 355 acima do SLA; sentimento negativo no Zendesk 55% em 7 dias; 261 carteiras de CCRP Fraude com Merchant 100% acima do SLA | Em queda 3 dias seguidos; fila acima do SLA ainda ativa |
| 19/11 | #the-voice-cx | Plataforma (Admin, ferramenta interna), Empréstimo (aba) | Incidente | Duas quedas do Admin (12h57-13h27 e ~17h28-18h03); aba de Empréstimos fora até ~20h28; 100% do BPO e cerca de metade da operação interna sem acesso; volume de tickets não subiu | Resolvido ~20h28 |
| 19/11 | #lideres-cx-e-cxm | Contas desativadas por segurança | Comunicado | Resposta validada com Legal e Produto publicada no artigo "Contas e contas cartão desativadas por segurança", após clientes contestarem drenagem e bloqueio; assistentes avisados via Weduka | Publicado |
| 19/11 | #cc-produto-e-cx | Cartão de Crédito | Comunicado | Estornos de anuidade de inativos devem seguir padrão "Estorno Anuidade - Mês/Ano" com justificativa auditável; os pendentes não auditáveis serão declinados | Em vigor |
| 18-19/11 | #cc-produto-e-cx, #lideres-cx-e-cxm | Cartão de Crédito (compras no Mercado Pago/Livre) | Incidente/mudança de regra | Desde 11/11 recusas antifraude saltaram de ~600/dia para 3,5-4,9 mil/dia (~79% em Mercado Pago/Livre); contatos de "problemas com o uso do cartão" de ~14/dia para ~42/dia; tema de 4,8% para 15,8% dos contatos humanos de cartão; Risco diz que houve ataque, bloqueio intencional, ataque mitigado; só ~2% dos afetados ligam. Pedido de padronização do discurso | Ativo (sem sinal de retirada em 18/11) |
| 18/11 | #lideres-cx-e-cxm, #the-voice-cx | Empréstimo | Incidente | Virada do dia Matera 01h00-04h35 (1.632 contratações recusadas, 9 contatos) e manutenção Matera/Oracle 21h00-22h50 (26 contatos, 2,4x a janela de 11/11) | Resolvido |
| 18/11 | #lideres-cx-e-cxm, #account_cx | Conta Desativada (celular roubado, invasão) | Mudança | Bloqueio automático dos formulários de segurança valida só CPF e data de nascimento (antes 5 dados); e-mail e telefone viram evidência no ticket | Em produção |
| 18/11 | #lideres-cx-e-cxm | CDB e Investimentos | Mudança/comunicado | Vencimentos de CDB começaram em 17/11, principalmente 107% de liquidez diária; reinvestimento automático em 103%; 107% desligado temporariamente; retenção potencial de R$ 29 mi em 2 semanas | Em andamento |
| 17-19/11 | #subacquirer-cx, #cxm-team, #lideres-cx-e-cxm, #the-voice-cx | Link de Pagamento | Incidente (desligamento) | Ataque na noite de 17/11; Cyber desligou o endpoint (confirmado 18/11 ~10h). Aviso no bot desde 15h59 de 18/11 (alerta da Central ligado por mais de 26h em 19/11). 18/11: contatos ~2,4x dia útil normal; humano ~5x; bot reteve 64%; 23 de 29 tickets humanos chegaram antes do aviso | Ativo; retorno previsto 23/11 |
| 17/11 | #the-voice-cx | Cartão (pagamento com cartão: cadastro, dados sensíveis, PIN) | Incidente | 11h40-12h10 sem aviso ao cliente; ~18% das chamadas de dados sensíveis falharam | Resolvido 12h10 |
| 17/11 | #the-voice-cx | Pix (envio, DICT BTG) | Instabilidade | 01h31-01h43, alerta ao cliente por 4 min; 4ª falha de Pix ligada ao BTG desde 11/11 | Resolvido 01h43 |
| 17/11 | #cx_fraud | Carteira Desativada (saldo bloqueado) | Correção | Após o fix da rotina de desbloqueio, contatos de "saldo da carteira bloqueado - todo o saldo" caem ~52% (53 contra 110 em 16/11); revisão automática roda o dia todo desde 17/11 | Resolvido (fix); backlog ainda alto |
| 17/11 | #lideres-cx-e-cxm | Empréstimo (renegociação) | Comunicado | Novo formato de acordo de renegociação em rollout para 5% dos clientes (desconto aparece como "parcela balão" no Admin; não falar disso com o cliente) | Em rollout |
| 17/11 | #cxm-team | Geral (Tribe) | Comunicado | Pulso de CX definiu pós-morte do Pix, carteira vencida direto ao humano, Tap to Pay com saldo em 24h; Pix e saldo bloqueado levam a visibilidade da Tribe | Informativo |
| 16/11 | #the-voice-cx | Empréstimo (pagamento de parcela por Pix QR e boleto) | Incidente | 08h00-10h44, 71 contatos, sem aviso ao cliente; atribuído à falha de certificado com o BTG | Resolvido 10h44 |
| 16/11 | #the-voice-cx | Pix (envio e recebimento) | Incidente | Envio 09h26-10h38 (62 contatos, ~2x segunda normal); recebimento 2ª onda 15/11 23h33 a 16/11 07h13 (61 contatos, bot reteve 63,9%) | Resolvido |
| 16/11 | #cxm-team (Alerta da Central) | Pix (recebimento) | Instabilidade | Alerta automático NewRelic ligado 05h29 (mais de 1h34 em 07h) | Resolvido (ver #the-voice-cx 07h13) |
| 16/11 | #lideres-cx-e-cxm | CDB | Mudança | CDB 107% do CDI com liquidez diária retirado do app; mantém 103%; quem tem 107% segue até o vencimento | Em vigor |
| 16/11 | #cx_fraud | Carteira Desativada | Correção | Revisão automática de desbloqueio parada de 08/11 a 15/11, volta parcialmente em 16/11 (15h46) | Parcial em 16/11, completa em 17/11 |
| 16/11 | #subacquirer-cx | Tap to Pay | Lançamento | Botão de cancelamento de transação T2P na tela de recibo (só D+1); D+0 entra em desenvolvimento na semana seguinte | Disponível (D+1) |
| 16/11 | #cxm-team | Geral | Comunicado | Report VoC W46 enviado: Pix indisponível por certificado vencido do BTG puxa o suporte humano e o NPS Tx cai a 63,6, o menor em 10 semanas | Informativo |
| 14-15/11 | #lideres-cx-e-cxm (resumo semanal), #the-voice-cx | Pix | Incidente | Certificado mTLS do BTG venceu 23h22 de 14/11; Pix Out, chaves e Pix In intermitentes por ~11h; causa identificada às 04h52; sem alerta de vencimento. 15/11: 1.132 contatos nos motivos de instabilidade contra média de 24; 2.136 no dia contra 706 num domingo normal; humano 661; bot reteve 12%; fila >520 clientes; Play Store: 22 de 33 avaliações do dia com 1-2 estrelas, 16 sobre Pix; Instagram 43 DMs contra média 3. Aviso da Central ficou até 13h (3h além do necessário) | Normalizado 10h12 de 15/11 (alerta da Central até 13h08) |
| 14-15/11 | #the-voice-cx | Transporte (recarga SP) | Incidente | 14/11 23h38 a 15/11 02h39, sem contatos válidos | Resolvido |
| 13/11 | #investments-e-cx, #cxm-team | CDB | Lançamento/correção | Solução implementada para instabilidades no resgate dentro da jornada de CDB | Implementado |
| 13/11 | #cc-produto-e-cx | Cartão de Crédito | Mudança | Falta de estoque do cartão físico Standard/Gold; botão "Pedir físico" removido temporariamente; data de entrega dos já pedidos será atualizada | Ativo (sem data) |
| 13/11 | #account_cx | Minha Conta | Comunicado | Acesso ao cadastro: contatos semanais de 462 para 279 (-40%); "não consegue acessar o cadastro" sai do Top 1 para o Top 6; tela de "abertura reprovada" em 10/11 15h | Informativo |
| 12/11 | #comunicados_e_atualizações_cx, #lideres-cx-e-cxm | Conta, Carteira e Cartão | Comunicado | Risk & Fraud bloqueou ~500 usuários (wallet e conta cartão) por possível fraude; não desbloquear nem abrir derivação; resposta padrão ao cliente | Ativo |
| 12/11 | #lideres-cx-e-cxm | Pix | Correção | CPFs mascarados em contatos Pix salvos, que faziam o Pix falhar (~300 erros/dia): corrigido em produção, redução de 100% dos erros | Resolvido |
| 12/11 | #lideres-cx-e-cxm | Anuidade CC | Comunicado | Fechamento do ciclo 1 de anuidade Standard/Gold (24/09 a 08/11): contact rate semanal de 1,34% para 0,60%, retenção do bot de 39% para 52%; início do ciclo 2 | Informativo |
| 11/11 | #the-voice-cx | Pix (BTG), Transporte | Incidente | Pix recebimento e envio 06h39-08h29 (91 contatos, ~3x quarta normal, bot reteve 16,5%); Transporte recarga em 17 cidades desde 21h13, até 12/11 21h08 | Pix resolvido 08h29; Transporte resolvido 12/11 21h08 |
| 11/11 | #the-voice-cx (via alerta da Central em #cxm-team) | Transporte | Instabilidade | Alerta automático NewRelic ligado 21h39 de 11/11; ainda ligado 12/11 10h (12h25 de duração); 9 contatos | Resolvido 12/11 |
| 11/11 | #cx_fraud | Carteira Desativada | Incidente interno | Contatos de saldo bloqueado batem 120 em 10/11 (maior da série); 219 carteiras de regra automática fora do SLA (~R$ 333 mil); lote das 22h não roda desde 07/11. Causas confirmadas: query da rotina passou do timeout de 60 s e modelo de Pix Infraction Reported (08/11) não desbloqueou | Resolvido em 17/11 (ver acima) |
| 11/11 | #cxm-team | Seguros, Central de Ajuda | Mudança | Nova categoria macro "Seguros" mudou o endereço da categoria de Seguro Pix; bloco do bot ainda aponta para o endereço antigo (retorna vazio); correção no backlog | Em validação |
| 10/11 | #comunicados_e_atualizações_cx, #the-voice-cx | Empréstimo | Incidente | Indisponibilidade Matera: virada do dia sem concluir 01h32-14h09; renegociações indisponíveis; contratação e pagamento de contratos antigos operando; 104 contatos, abaixo das terças anteriores | Resolvido 14h09 |
| 10/11 | #cc-produto-e-cx | Cartão (contestação, chargeback) | Comunicado | Reunião CXM + Chargeback + Produto de 09/11: 7 recomendações; 3DS estrutural sem prazo; "contestação rejeitada" é principal tema de cartão em BACEN; follow-up em 23/11 | Em andamento |
| 10/11 | #lideres-cx-e-cxm (resumo), #the-voice-cx | Pix | Incidente | Degradação do BTG em Pix a partir de 09/11 08h01 até pelo menos 10/11 07h54 (alertas automáticos sem confirmação humana) | Sem confirmação de resolução |
| 09/11 | #the-voice-cx | Empréstimo | Incidente | Equifax instável e erro 500 nos endpoints de Empréstimo, 13h53-15h54; ~391 usuários com desembolso falho; 28 contatos; aviso não ativado | Resolvido 15h54 |
| 09/11 | #lideres-cx-e-cxm, #cc-produto-e-cx | Cartão de Crédito | Lançamento | Rollout faseado da negociação de saldo devedor total (renegociar todo o saldo em vez de só a fatura) e parcelamento do saldo total | Em rollout |
| 09/11 | #lideres-cx-e-cxm, #cc-produto-e-cx | Cartão de Crédito | Lançamento | Cancelamento e reemissão de cartão físico pelo app, segmentos 1, 3 e 5 (R$ 20 pela 2ª via); 30% em 09/11, subida a 100% prevista; 349 aberturas da tela, 54% decidiram (até 17/11) | Em rollout |
| 09/11 | #pixcc-home-raf-cx / #cxm-team | Pix CC | Comunicado | Report VoC W45 publicado: teste da taxa de 4,99% no Pix com cartão começou em 05/11 | Informativo |
| 09/11 | #account_cx | Minha Conta (onboarding) | Mudança | Regra de fraude R6: bloqueios caem de 4,1% para 2,6% dos novos usuários (desde 27/10); desde 02/11, ~30% dos usuários sem CEP válido bloqueados até cadastrarem endereço válido | Ativo |
| 09/11 | #cxm-team | CXM | Mudança de processo | Nova planilha e painel de governança de iniciativas de redução de contato (campo "Data do reporte") | Informativo |

## Contexto anterior (24/10 a 08/11, para correlação)

| Data | Canal de origem | Produto(s) | Tipo | Descrição | Status / resolução |
|---|---|---|---|---|---|
| 08/11 | #the-voice-cx | Pix | Incidente | Envio indisponível (BTG) sáb 23h38 a dom 07h51 (50 contatos) e dom 16h03-16h49 (11 contatos) | Resolvido |
| 06/11 | #the-voice-cx | Pix | Incidente | Queda do DICT do Banco Central (P2) 19h26-21h02, 110 contatos, bot reteve 13,6%; 44% dos tickets humanos de Pix não concluído ou não recebido | Resolvido 21h02 |
| 06/11 | #lideres-cx-e-cxm, #the-voice-cx | Transporte (aviso de instabilidade em Curitiba) | Mudança/correção | Aviso manual ativo desde 30/10 aparecia para todos os usuários do app; desativado 06/11 às 11h34 | Resolvido 11h34 |
| 05/11 | #lideres-cx-e-cxm, #melhoria-continua-verticais | Contas e Boletos | Mudança | Fim do cashback em contas e boletos pagos com saldo (PF e PJ), aviso a ~130 mil clientes em 04/11. Contatos pico de 90 no dia (5,7x dia útil); normal desde 13/11; sentimento negativo nas redes de 22% para 60%; TPV de Bills PJ com saldo -14% | Em vigor; contatos normalizados |
| 05/11 | #lideres-cx-e-cxm | Pix CC | Mudança | Teste da taxa de 4,99% (era 2,99%) para 50% dos clientes com limite concedido | Em teste |
| 05/11 | #subacquirer-cx | Link de Pagamento | Incidente (regularização) | Incidente de 13/10 (regra de preço aplicou juros de 11,90% em vendas parceladas, 14h36-15h34): 59 vendas cobradas acima da tabela (R$ 1.773,36) a creditar na wallet do lojista | Regularização em andamento |
| 05/11 | #the-voice-cx | Pix, Empréstimo | Incidente | Pix envio e recebimento 20h38-21h02; Empréstimo contratação 12h00-12h14 | Resolvido |
| 04/11 | #the-voice-cx | Empréstimo | Incidente | Contratação e negociação indisponíveis 07h14-07h23 (29 contatos) e manutenção Matera/Oracle 22h00 | Resolvido |
| 04/11 | #cc-produto-e-cx | Cartão de Crédito | Mudança | Cobrança de R$ 9,90 por inatividade em 02/11 atingiu ~48,3 mil clientes; 423 tickets em 03/11 (pico anterior 411 em 30/10) | Pico no dia seguinte à cobrança |
| 03/11 | #the-voice-cx | Pix | Incidente | Envio indisponível (BTG) 20h53-23h49; ~11,3 mil usuários com erro visível; 35 contatos | Resolvido |
| 03/11 | #lideres-cx-e-cxm | Atendimento (C2C) | Mudança | Ligação que falha agora segue para o Chat após a 3ª tentativa (antes fechava como "atendimento não prestado") | Em produção |
| 02/11 | #lideres-cx-e-cxm | CXM e Help Design | Mudança de processo | A partir de novembro, CXM e Help Design atuam como frente única | Informativo |
| 02/11 | #account_cx | Minha Conta | Mudança | Desde 02/11, ~30% dos usuários sem CEP válido bloqueados no cadastro até informarem endereço válido | Ativo |
| 01/11 | #the-voice-cx | Empréstimo, Transporte, Pix | Incidente | Certificado mTLS do Lending vencido (~5h25, contratação e pagamento parados, sem aviso); Transporte Curitiba (alerta manual desde 30/10); Pix envio 4 min | Resolvido (Curitiba até 06/11) |
| 29/10 | #lideres-cx-e-cxm | Minha Conta (login) | Mudança | WAF só aceita acesso do Brasil; ~2.600 usuários únicos afetados; exceção em avaliação | Ativo; sem definição |
| 29/10 | #cc-produto-e-cx / #cxm-team | Seguros | Lançamento | Seguro Acidente e Renda liberado a 100% da base | Em vigor |
| 28/10 | #the-voice-cx | Pix | Incidente | Envio instável 10h14 de 28/10 a 08h16 de 29/10; 139 contatos até 23h59 de 28/10; aviso de Pix apareceu para clientes de outros temas | Resolvido 08h16 de 29/10 |
| 28/10 | #account_cx | Minha Conta | Mudança de processo | Ajuste de atendimento após bloqueio de CPF de 14/10 (checar cadastros DELETED/CLOSED antes de orientar) | Em vigor |
| 28/10 | #squad_loan_seguimento | Empréstimo | Comunicado | Mesa de trabalho: erro "cadastro não habilitado" na simulação e cancelamento de empréstimos (63% viram derivação); Produto investiga | Em andamento |
| 27/10 | #account_cx | Minha Conta (onboarding) | Mudança | Fraude refinou a regra R6; bloqueios de 4,1% a 2,6% dos novos usuários | Em produção |
| 27/10 | #the-voice-cx | Empréstimo, Pix | Incidente | Manutenção Matera 21h01-21h28; Pix envio 23h37-00h05 | Resolvido |
| 26/10 | #investments-e-cx, #the-voice-cx | CDB | Incidente | Tela de resgate ("continuar resgate") não avançava; 10h02-12h05; 34 contatos, bot reteve 8,8% | Resolvido 12h05 (solução de jornada implementada em 13/11) |
| 26/10 | #the-voice-cx | Transporte (recarga SP) | Incidente | 16h29-20h35 (3 ciclos), 5 contatos | Resolvido 20h35 |
| 25/10 | #the-voice-cx | Pix | Incidente | Pico de erro CircuitBreaker no envio, ~7 min (20h36-20h43), se resolveu sozinho | Resolvido |
| 24/10 | #cc-produto-e-cx (relatório W43) | Anuidade CC | Comunicado | Nova onda de cobrança de anuidade em 24/10 | Pico de cancelamentos em 25/10 |

## Observações de cobertura

- #comunicados_e_atualizações_cx não teve postagens entre 13/11 e 23/11; os comunicados operacionais da W47 vieram de #lideres-cx-e-cxm (o canal com mais comunicados de operação).
- #cx_fraud passou a receber resumo diário de carteiras bloqueadas (a partir de 17/11, mensagens de 18/11 e 23/11 referentes a 17, 18 e 22/11).
- Em 19/11 o #the-voice-cx menciona transcrições só até 18/11 e Zendesk MCP fora do ar; os volumes de incidentes vêm do Databricks.
- Resolução de Pix (14-15/11): #lideres-cx-e-cxm informa normalização às 10h12 de 15/11; #the-voice-cx lista a janela do alerta 23h33 a 13h08. Registrar as duas fontes quando citadas.
- Link de Pagamento segue desligado em 19/11; retorno previsto para 23/11, sem confirmação de retorno nas mensagens lidas.
