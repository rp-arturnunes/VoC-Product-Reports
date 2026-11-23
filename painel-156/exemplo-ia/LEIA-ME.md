# Exemplo W45 (modelo de campos e de tom)

Estes 20 arquivos mostram o formato dos blocos de IA. Passam na validação normal (`python3 validar_ia.py exemplo-ia`), mas **não** em `--completo`, porque foram escritos antes da regra de completude e faltam frases reais de clientes que não puderam ser levantadas depois:

- 12 temas do Reclame Aqui (`ra.json`) com 1 ou 2 exemplos, em vez de 5;
- 7 motivos de contato com menos exemplos do que o volume pede (CDB, Minha Conta, Bloqueios, Seguros e Transporte);
- exemplos negativos de redes (`lojasredes.json`): 4, em vez de 5.

Já cumprem a completude: imagens dos 12 produtos (`meta.imagens`), notas de jornada nas 3 etapas de maior volume (texto gerado dos números reais das queries de jornada, mais simples do que as notas qualitativas que a rotina escreve), 15 destaques com imagem e 5 exemplos, vozes, lojas, redes, Seguros com 3 subprodutos. Seguros, Link e Bloqueios usam `base_pequena: true` (poucos feedbacks em 30 dias).

A rotina semanal deve passar em `python3 validar_ia.py ia --completo`; a W46 ainda precisa ser conferida assim.
