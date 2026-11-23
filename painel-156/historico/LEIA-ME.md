# Histórico de semanas do painel 156

Uma semana por arquivo (`W45.json`...), gerada por `python3 painel-156/arquivar_semana.py ia painel-156/historico` depois de a análise passar em `validar_ia.py --completo`. Cada arquivo guarda os 15 destaques (com no máximo 3 exemplos por destaque), os movimentos da empresa daquela semana, o resumo e o pulso. **Não apague arquivos desta pasta.**

O montador inclui no html as 3 semanas mais recentes antes da atual (`--semanas-historico 3`), comprimidas em um bloco `data-px-hist`: a atual mais 3 anteriores dão 4 semanas no seletor dos Destaques. Se a pasta estiver vazia (clone novo), restaure do html publicado: `python3 painel-156/extrair_historico.py <html-publicado> painel-156/historico`.

`W45.json` é a semente (dados reais da W45). A W46 entra na primeira rodada, recuperada do html já publicado.
